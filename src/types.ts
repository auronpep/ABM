export type Route =
  | "home"
  | "how-it-works"
  | "pricing"
  | "diagnostic"
  | "drills"
  | "welcome"
  | "repair"
  | "prayer-chain";

export interface PageProps {
  navigate: (route: Route) => void;
}
