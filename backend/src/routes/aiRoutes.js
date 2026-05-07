import { Router } from "express";
import { getAITest, getRoadmap, getVivaQuestions } from "../controllers/aiController.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { roadmapSchema, vivaSchema } from "../validators/aiValidators.js";

const router = Router();

router.get("/test", getAITest);
router.post("/viva", validateRequest(vivaSchema), getVivaQuestions);
router.post("/roadmap", validateRequest(roadmapSchema), getRoadmap);

export default router;
