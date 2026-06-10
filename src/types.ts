export type Route = "home" | "how-it-works" | "pricing" | "diagnostic" | "drills";

export interface PageProps {
  navigate: (route: Route) => void;
}
