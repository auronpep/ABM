export type Route = "home" | "how-it-works" | "pricing" | "diagnostic";

export interface PageProps {
  navigate: (route: Route) => void;
}
