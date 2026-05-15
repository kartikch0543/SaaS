import { useQuery } from "@tanstack/react-query";
import apiClient from "../api/client";
import { SeoHead } from "../components/seo/SeoHead";
import { StatCard } from "../components/common/StatCard";
import { StudyChart } from "../components/dashboard/StudyChart";

export const DashboardPage = () => {
  const dashboardQuery = useQuery({
    queryKey: ["dashboard"],
    queryFn: async () => (await apiClient.get("/api/dashboard")).data
  });
  const analyticsQuery = useQuery({
    queryKey: ["analytics-overview"],
    queryFn: async () => (await apiClient.get("/api/admin/analytics/overview")).data
  });

  const dashboard = dashboardQuery.data;
  const analytics = analyticsQuery.data;

  if (dashboardQuery.isLoading || analyticsQuery.isLoading) {
    return (
      <section className="section-shell py-16">
        <div className="grid gap-4 md:grid-cols-4">
          {Array.from({ length: 4 }, (_, index) => (
            <div key={index} className="surface-card h-32 animate-pulse" />
          ))}
        </div>
      </section>
    );
  }

  return (
    <>
      <SeoHead
        title="Student Dashboard"
        description="Track study streaks, quiz performance, and content engagement."
        path="/dashboard"
        noindex
      />
      <section className="section-shell py-16">
        <div className="grid gap-4 md:grid-cols-4">
          <StatCard label="Current streak" value={`${dashboard?.streakDays || 0} days`} hint="Consistency builds retention." />
          <StatCard label="Completed topics" value={dashboard?.completedTopics || 0} hint="Micro-progress compounds over a semester." />
          <StatCard label="Learning hours" value={dashboard?.hoursLearned || 0} hint="Track real effort, not just intention." />
          <StatCard label="Average score" value={`${dashboard?.averageQuizScore || 0}%`} hint="Quiz feedback reveals weak areas early." />
        </div>
        <div className="mt-8 grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <StudyChart data={dashboard?.weeklyStudyTrend || []} />
          <div className="surface-card p-6">
            <h2 className="font-display text-xl font-semibold text-fg">Acquisition and engagement snapshot</h2>
            <div className="mt-6 space-y-3 text-muted">
              <p>Sessions: {analytics?.metrics?.sessions || 0}</p>
              <p>Page views: {analytics?.metrics?.pageViews || 0}</p>
              <p>CTR: {analytics?.metrics?.ctr || 0}%</p>
              <p>Keyword impressions: {analytics?.metrics?.keywordImpressions || 0}</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
