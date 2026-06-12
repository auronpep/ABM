export type Route =
  | "home"
  | "how-it-works"
  | "pricing"
  | "diagnostic"
  | "drills"
  | "welcome"
  | "repair"
  | "prayer-chain"
  | "prayer"
  | "sign-in"
  | "sign-up";

export interface PageProps {
  navigate: (route: Route) => void;
}
