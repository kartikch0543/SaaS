import { getDashboardSummary } from "../services/dashboardService.js";

export const getDashboard = async (_req, res) => {
  const summary = await getDashboardSummary();
  res.json(summary);
};
