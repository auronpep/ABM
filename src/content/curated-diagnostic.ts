// The curated 18-question full diagnostic — drawn from the live qdata bank
// (every entry has per-choice mold metadata for Red-Zone synthesis).
// Subject spread: 2 CivPro · 3 ConLaw · 2 Evidence · 5 Torts · 6 Crim.

export const CURATED_DIAGNOSTIC_IDS: string[] = [
  "CQ14141",
  "CQ14227",
  "CQ15259",
  "CQ14586",
  "CQ14766",
  "CQ15260",
  "CQ14660",
  "CQ14228",
  "CQ15264",
  "CQ14671",
  "CQ14830",
  "CQ15222",
  "CQ14681",
  "CQ14238",
  "CQ15223",
  "CQ14687",
  "CQ14215",
  "CQ14664",
];

/** Mold family → which True & Responsive prong the counterfeit fails (doc 03). */
export function filterForMold(mold: string): "NOT_TRUE" | "NOT_RESPONSIVE" {
  return ["misfit", "bait_doctrine", "wrong_element"].includes(mold)
    ? "NOT_RESPONSIVE"
    : "NOT_TRUE";
}

export function trapLabelForMold(mold: string): string {
  return mold.split("_").join(" ").toUpperCase();
}
