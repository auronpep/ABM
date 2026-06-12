# Old-Site Page Inventory

Complete map of `C:\barmatrix-site` pages: what each was, and whether its content carried into `C:\ABM`. The old site was a **zero-build static site** (React + Babel from unpkg CDN, JSX transpiled in-browser; every page a standalone `.html`).

Shared brand system across all pages: Newsreader serif + IBM Plex Sans/Mono; forensic-red `#C8102E`, ink `#0A0A0A`, paper `#F6F3EC`. Recurring product facts cited sitewide: founder **Vera Brooks**; **11 years** CA bar tutoring; **600+** students; **47 trap shapes**; **156 tension points**; **2,400 tagged questions**; focus-group cohort **n=1,247**; **$899** founding price; **California July 28, 2026** exam.

> Many "data" elements on the marketing pages (press hits, attendee counts, the named sample examinee "Jordan A. Reyes") are placeholder/fictional, not live records.

---

## A. Pages that carried into C:\ABM (already present, no action)

`index.html`, all `lp-*.html` landing pages, `campaign.html`, `checkout.html`, `emails.html`, `help.html`, `login.html`, `404.html`. These exist in the new repo's `public/`.

## B. Unique content pages NOT in C:\ABM (captured here)

| Page | Type | Purpose | Preserve | Captured in |
|---|---|---|---|---|
| `about.html` | static | Founder origin story + method-origin narrative; names the trap taxonomy; 5-step timeline (2015→2026) | **YES** | `05_BRAND_KIT_AND_FOUNDER.md` |
| `partners.html` | React | Approval-only partner program; approved/prohibited-claims grid; FTC disclosure; application form | **YES** | `04_PARTNER_PROGRAM.md` |
| `press.html` | static | Press/brand kit: boilerplate, logo variants, **color hex + roles**, type spec | **YES (brand kit)** | `05_BRAND_KIT_AND_FOUNDER.md` |
| `webinar.html` | React | Webinar RSVP funnel; 60-min agenda with 3 teaching traps + focus-group % | partial | `05` (teaching content) |
| `webinar-replay.html` | static | Replay viewer; 3 question cards (MBE-CR-0421, MBE-EV-1102, MBE-CN-0883) | partial | `05` |
| `sprint.html` | static (internal) | Fabricated AI-worker kanban; only value = a snapshot of the intended build surface | mostly NO | — |
| `red-zone-map.html` | static (print) | **Complete worked diagnostic deliverable** — 5 FRE-anchored trap cards + focus-group bars + 8×7 matrix + 67-day repair path | **YES (highest)** | `01` + `02` |
| `seasonal.html` | React | 3 persona landings (California / Repeat Takers / Full-Course Companion) + **competitor-companion comparison table** | **YES** | `05_BRAND_KIT_AND_FOUNDER.md` |
| `tiktok.html` | static (internal) | Library of 6 full TikTok scripts (of 30; "24 more in Airtable") w/ FTC disclosure | **YES** | `05_BRAND_KIT_AND_FOUNDER.md` |
| `app.html` | prototype shell | Loader for the student-app React prototype | shell NO / logic YES | `01_PRODUCT_AND_DATA_MODEL.md` |
| `operator.html` | prototype shell | Loader for the founder Operator Console prototype | shell NO / logic YES | `01` + `02` |
| `mobile.html` | prototype | iOS + Android mockups (device frames, full mobile design system inline) | partial | `01` (note) |

## C. Prototype apps — where the real logic lives

The three prototype shells (`app.html`, `operator.html`, `mobile.html`) are just script loaders. The substantive logic/content lives in folders, now copied to `source/`:

- **Student app** (`app/`): `dashboard.jsx`, `drill.jsx`, `data.js`, `drill-manifest.js`, `evidence-a1-drill.js`, `drill-privileges-b003/004/005.js`. Views: shell, dashboard, drill mode, Tension Matrix, Pattern Mastery board, misconceptions, red-zones. → captured in `01`.
- **Operator console** (`operator/`): `mission.jsx` (Mission Control), `content-pipeline.jsx`, `authoring.jsx`, `pipeline-data.js`, `data.js`. The 5 console routes: Mission Control, Funnel, Refunds, Partners, Content Pipeline. → captured in `01` + `02`.
- **Mobile** (`mobile-screens.jsx`, `mobile-main.jsx`, `starters/`): iOS/Android frames for dashboard, drill mode, forensics bottom-sheet, mini matrix, app-store screenshot templates. Web-first until mobile builds are approved. *(Not copied — design-only; revisit if a mobile build is revived.)*
