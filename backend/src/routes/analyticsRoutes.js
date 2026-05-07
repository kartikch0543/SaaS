import { Router } from "express";
import { getAnalyticsReport } from "../controllers/analyticsController.js";
import { requireAuth } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/overview", requireAuth, getAnalyticsReport);

export default router;
