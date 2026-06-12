// Clerk production instance — bound to clerk.barmatrix.app (the publishable
// key is public by design; it encodes the frontend API domain). Env override
// first so previews/test instances can swap it without a code change.
export const CLERK_PUBLISHABLE_KEY: string =
  (import.meta.env.VITE_CLERK_PUBLISHABLE_KEY as string | undefined) ||
  (import.meta.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY as string | undefined) ||
  "pk_live_Y2xlcmsuYmFybWF0cml4LmFwcCQ";
