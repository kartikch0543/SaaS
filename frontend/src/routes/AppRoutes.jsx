import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { usePageTracking } from "../hooks/usePageTracking";
import { AppShell } from "../components/layouts/AppShell";
import { ProtectedRoute } from "./ProtectedRoute";

const HomePage = lazy(() => import("../pages/HomePage").then((module) => ({ default: module.HomePage })));
const LoginPage = lazy(() => import("../pages/LoginPage").then((module) => ({ default: module.LoginPage })));
const DashboardPage = lazy(() =>
  import("../pages/DashboardPage").then((module) => ({ default: module.DashboardPage }))
);
const VivaPrepPage = lazy(() => import("../pages/VivaPrepPage").then((module) => ({ default: module.VivaPrepPage })));
const RoadmapPage = lazy(() => import("../pages/RoadmapPage").then((module) => ({ default: module.RoadmapPage })));
const SeoLibraryPage = lazy(() =>
  import("../pages/SeoLibraryPage").then((module) => ({ default: module.SeoLibraryPage }))
);
const ArticlePage = lazy(() => import("../pages/ArticlePage").then((module) => ({ default: module.ArticlePage })));

export const AppRoutes = () => {
  usePageTracking();

  return (
    <AppShell>
      <Suspense
        fallback={
          <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="h-40 animate-pulse rounded-3xl bg-white/70 shadow-glass" />
          </div>
        }
      >
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/viva-prep" element={<VivaPrepPage />} />
          <Route path="/roadmap-generator" element={<RoadmapPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route path="/seo-library" element={<SeoLibraryPage />} />
          <Route path="/:slug" element={<ArticlePage />} />
        </Routes>
      </Suspense>
    </AppShell>
  );
};
