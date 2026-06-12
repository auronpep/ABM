export type Route =
  | "home"
  | "how-it-works"
  | "pricing"
  | "diagnostic"
  | "drills"
  | "welcome"
  | "repair"
  | "prayer-chain"
  | "sign-in"
  | "sign-up";

export interface PageProps {
  navigate: (route: Route) => void;
}
