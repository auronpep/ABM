export type Route =
  | "home"
  | "how-it-works"
  | "pricing"
  | "diagnostic"
  | "drills"
  | "practice"
  | "dashboard"
  | "welcome"
  | "repair"
  | "prayer-chain"
  | "sign-in"
  | "sign-up"
  | "tensions"
  | "tensions-detail"
  | "traps"
  | "traps-detail"
  | "subjects"
  | "subjects-detail"
  | "about"
  | "faq"
  | "terms"
  | "privacy"
  | "refund"
  | "webinar"
  | "waitlist"
  | "referral"
  | "program"
  | "program-lesson"
  | "red-zones"
  | "red-zone-detail"
  | "coach"
  | "mastery"
  | "account";

export interface RouteState {
  route: Route;
  slug?: string;
}

export interface PageProps {
  navigate: (route: Route, slug?: string) => void;
}
