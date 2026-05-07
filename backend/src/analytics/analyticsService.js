import { env } from "../config/env.js";

export const getAnalyticsOverview = async () => ({
  ga4Connected: Boolean(env.googleAnalyticsId),
  clarityConnected: Boolean(env.clarityProjectId),
  searchConsoleConnected: Boolean(env.searchConsoleSiteUrl),
  metrics: {
    pageViews: 12480,
    sessions: 4310,
    bounceRate: 32,
    engagementRate: 68,
    ctr: 5.4,
    keywordImpressions: 28090
  },
  topPages: [
    { page: "/dbms-viva-questions", views: 2280 },
    { page: "/frontend-roadmap-for-beginners", views: 1910 },
    { page: "/operating-system-short-notes", views: 1330 }
  ],
  keywords: [
    { keyword: "dbms viva questions with answers", impressions: 6800, ctr: 6.1 },
    { keyword: "frontend roadmap for beginners", impressions: 5120, ctr: 5.8 },
    { keyword: "operating system short notes", impressions: 4040, ctr: 4.9 }
  ]
});
