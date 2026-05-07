import { getAnalyticsOverview } from "../analytics/analyticsService.js";

export const getAnalyticsReport = async (_req, res) => {
  const report = await getAnalyticsOverview();
  res.json(report);
};
