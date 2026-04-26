import { createBrowserRouter } from "react-router";
import { LandingPage } from "../features/landing/LandingPage";
import { LoginPage } from "../features/login/LoginPage";
import { MainPage } from "../features/main/MainPage";
import { MatchesPage } from "../features/main/MatchesPage";
import { CompanyDashboard } from "../features/company/CompanyDashboard";
import { SettingsPage } from "../features/settings/SettingsPage";
import { TipsPage } from "../features/tips/TipsPage";
import { PricingPage } from "../features/pricing/PricingPage";
import { AdminDashboard } from "../features/admin/AdminDashboard";
import { SchoolDashboard } from "../features/school/SchoolDashboard";

export const router = createBrowserRouter([
  { path: "/",          Component: LandingPage },
  { path: "/login",     Component: LoginPage },
  { path: "/pricing",   Component: PricingPage },
  { path: "/swipe",     Component: MainPage },
  { path: "/matches",   Component: MatchesPage },
  { path: "/settings",  Component: SettingsPage },
  { path: "/tips",      Component: TipsPage },
  { path: "/company",   Component: CompanyDashboard },
  { path: "/school",    Component: SchoolDashboard },
  { path: "/admin",     Component: AdminDashboard },
]);
