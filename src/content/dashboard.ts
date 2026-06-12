export const DASHBOARD_COPY = {
  cohort: "July 2026 cohort",
  welcomeTitle: "You\u2019re in.",
  dashboardTitle: "Today.",
  authTitle: "Your dashboard is account-gated.",
  authBody:
    "Sign in with the email you enrolled with. If you just checked out, use the checkout email so your seat can be matched.",
  todayLabel: "\u258c Today's assigned work",
  todayDefaultUnlock: "Completion updates the map and decides the next assigned step.",
  mapLabel: "\u258c Your Red-Zone map",
  mapEmpty: "Your repair map appears after the diagnostic.",
  progressLabel: "\u258c Progress mirrors",
  insightsLabel: "\u258c Quiet insights",
  accountLabel: "\u258c Account continuity",
  optionalLibraryLabel: "Explore full bank",
  optionalLibraryNote: "Optional library work stays secondary. Today's assignment remains the spine.",
  enrollmentIssueTitle: "\u258c Enrollment not found for this account",
  enrollmentIssueBody:
    "Use the exact email from checkout, or send the receipt email to support@barmatrix.app so the seat can be matched.",
  purchaseSuccess:
    "Payment return received. If you just enrolled, create or sign into the account that uses your checkout email so the paid seat can be recognized.",
  statuses: {
    repaired: {
      label: "REPAIRED · HOLDING",
      group: "Holding",
      help: "Repaired for now; waiting for its scheduled hold check.",
    },
    "retest-ready": {
      label: "RETEST READY",
      group: "Retest ready",
      help: "The hold check is due. This outranks every other assignment.",
    },
    "in-repair": {
      label: "IN REPAIR",
      group: "Active",
      help: "This is the zone currently being worked.",
    },
    queued: {
      label: "QUEUED",
      group: "Queued",
      help: "Queued behind the active repair and any due retest.",
    },
  },
} as const;
