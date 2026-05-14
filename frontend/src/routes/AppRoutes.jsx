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
const ContentHubPage = lazy(() => import("../pages/ContentHubPage").then((module) => ({ default: module.ContentHubPage })));
const ArticlePage = lazy(() => import("../pages/ArticlePage").then((module) => ({ default: module.ArticlePage })));

export const AppRoutes = () => {
  usePageTracking();

  return (
    <AppShell>
      <Suspense
        fallback={
          <div className="section-shell py-16">
            <div className="surface-card h-40 animate-pulse" />
          </div>
        }
      >
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/blog" element={<ContentHubPage />} />
          <Route path="/roadmap" element={<ContentHubPage />} />
          <Route path="/viva" element={<ContentHubPage />} />
          <Route path="/interview-prep" element={<ContentHubPage />} />
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
          <Route path="/:section/:slug" element={<ArticlePage />} />
          <Route path="/:slug" element={<ArticlePage />} />
        </Routes>
      </Suspense>
    </AppShell>
  );
};
