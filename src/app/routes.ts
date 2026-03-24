import { createBrowserRouter } from "react-router";
import { LandingPage } from "../features/landing/LandingPage";
import { LoginPage } from "../features/login/LoginPage";
import { MainPage } from "../features/main/MainPage";
import { MatchesPage } from "../features/main/MatchesPage";
import { CompanyDashboard } from "../features/company/CompanyDashboard";
import { SettingsPage } from "../features/settings/SettingsPage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: LandingPage,
  },
  {
    path: "/login",
    Component: LoginPage,
  },
  {
    path: "/swipe",
    Component: MainPage,
  },
  {
    path: "/matches",
    Component: MatchesPage,
  },
  {
    path: "/company",
    Component: CompanyDashboard,
  },
  {
    path: "/settings",
    Component: SettingsPage,
  },
]);
