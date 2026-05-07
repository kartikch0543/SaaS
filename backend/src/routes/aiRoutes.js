import { Router } from "express";
import { getRoadmap, getVivaQuestions } from "../controllers/aiController.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { roadmapSchema, vivaSchema } from "../validators/aiValidators.js";

const router = Router();

router.post("/viva", validateRequest(vivaSchema), getVivaQuestions);
router.post("/roadmap", validateRequest(roadmapSchema), getRoadmap);

export default router;
