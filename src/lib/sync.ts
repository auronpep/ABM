// Cross-device progress sync. The buyer's Red-Zone map, program set, and
// mixed-set history travel with their account: stored as a snapshot in the
// Clerk user's unsafeMetadata (client-writable, the user's own study data —
// the server never trusts it). Last-writer-wins with a local dirty flag so
// unsynced local work is never clobbered by an older remote snapshot.
// Sync must never break the app: every path is try/caught.

const SNAPSHOT_KEYS = ["bm_redzone_map", "bm_program_set_v1", "bm_mixed_v1", "bm_program_v1"] as const;
const SYNC_TS_KEY = "bm_sync_ts";
const DIRTY_KEY = "bm_sync_dirty";

/** Fired whenever program/map state changes; the SyncRoot debounces a push. */
export const STATE_EVENT = "bm:state";

export interface Snapshot {
  v: 1;
  ts: number;
  data: Record<string, string | null>;
}

/** Minimal shape of a Clerk user — keeps this module decoupled from the SDK. */
export interface SyncUser {
  unsafeMetadata: Record<string, unknown>;
  update: (params: { unsafeMetadata: Record<string, unknown> }) => Promise<unknown>;
}

/** Mark local state changed: set the dirty flag and notify the SyncRoot. */
export function markStateChanged(): void {
  try {
    localStorage.setItem(DIRTY_KEY, "1");
  } catch {
    // ignore
  }
  try {
    window.dispatchEvent(new Event(STATE_EVENT));
  } catch {
    // ignore (non-browser context)
  }
}

function readLocalData(): Record<string, string | null> {
  const data: Record<string, string | null> = {};
  for (const key of SNAPSHOT_KEYS) {
    try {
      data[key] = localStorage.getItem(key);
    } catch {
      data[key] = null;
    }
  }
  return data;
}

function readRemote(user: SyncUser): Snapshot | null {
  const raw = user.unsafeMetadata?.bm;
  if (!raw || typeof raw !== "object") return null;
  const snap = raw as Snapshot;
  if (snap.v !== 1 || typeof snap.ts !== "number" || typeof snap.data !== "object") return null;
  return snap;
}

function syncTs(): number {
  try {
    return Number(localStorage.getItem(SYNC_TS_KEY)) || 0;
  } catch {
    return 0;
  }
}

function isDirty(): boolean {
  try {
    return localStorage.getItem(DIRTY_KEY) === "1";
  } catch {
    return false;
  }
}

/**
 * Apply the account's snapshot to this browser if it is newer than the last
 * sync point and there is no unsynced local work. Returns true when local
 * state changed (caller should re-render from storage).
 */
export function pullSnapshot(user: SyncUser): boolean {
  try {
    const remote = readRemote(user);
    if (!remote) return false;
    if (remote.ts <= syncTs()) return false;
    if (isDirty()) return false; // local work wins; the next push reconciles
    let changed = false;
    for (const key of SNAPSHOT_KEYS) {
      const value = remote.data[key] ?? null;
      const current = localStorage.getItem(key);
      if (value === current) continue;
      if (value === null) localStorage.removeItem(key);
      else localStorage.setItem(key, value);
      changed = true;
    }
    localStorage.setItem(SYNC_TS_KEY, String(remote.ts));
    return changed;
  } catch {
    return false;
  }
}

/** Push this browser's state to the account. */
export async function pushSnapshot(user: SyncUser): Promise<void> {
  try {
    const data = readLocalData();
    const hasAnything = Object.values(data).some((v) => v !== null);
    if (!hasAnything) return; // nothing to sync; never blank a remote snapshot
    const remote = readRemote(user);
    if (remote && JSON.stringify(remote.data) === JSON.stringify(data)) {
      try {
        localStorage.removeItem(DIRTY_KEY);
      } catch {
        // ignore
      }
      return;
    }
    const snapshot: Snapshot = { v: 1, ts: Date.now(), data };
    // unsafeMetadata budget is ~8KB — drop mixed-set history first if oversized.
    if (JSON.stringify(snapshot).length > 7500) {
      snapshot.data = { ...data, bm_mixed_v1: null };
    }
    await user.update({ unsafeMetadata: { ...user.unsafeMetadata, bm: snapshot } });
    try {
      localStorage.setItem(SYNC_TS_KEY, String(snapshot.ts));
      localStorage.removeItem(DIRTY_KEY);
    } catch {
      // ignore
    }
  } catch {
    // sync failure is invisible; the next state change retries
  }
}
