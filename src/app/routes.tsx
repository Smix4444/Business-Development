import { createBrowserRouter, Navigate } from "react-router";
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
import { ProtectedRoute } from "./components/ProtectedRoute";
import { RootRedirect } from "./components/RootRedirect";

export const router = createBrowserRouter([
  { path: "/",          Component: RootRedirect },
  { path: "/login",     Component: LoginPage },
  { path: "/pricing",   Component: PricingPage },
  {
    path: "/swipe",
    element: <ProtectedRoute allowedRoles={['student']}><MainPage /></ProtectedRoute>,
  },
  {
    path: "/matches",
    element: <ProtectedRoute allowedRoles={['student']}><MatchesPage /></ProtectedRoute>,
  },
  {
    path: "/settings",
    element: <ProtectedRoute allowedRoles={['student', 'company']}><SettingsPage /></ProtectedRoute>,
  },
  {
    path: "/tips",
    element: <ProtectedRoute allowedRoles={['student']}><TipsPage /></ProtectedRoute>,
  },
  {
    path: "/company",
    element: <ProtectedRoute allowedRoles={['company']}><CompanyDashboard /></ProtectedRoute>,
  },
  {
    path: "/school",
    element: <ProtectedRoute allowedRoles={['school']}><SchoolDashboard /></ProtectedRoute>,
  },
  {
    path: "/admin",
    element: <ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>,
  },
]);
