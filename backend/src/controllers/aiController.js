import { generateAIHealthSample, generateRoadmap, generateVivaPack } from "../services/aiService.js";
import { logger } from "../utils/logger.js";

export const getVivaQuestions = async (req, res, next) => {
  try {
    logger.info("Viva generation requested", {
      requestId: req.requestId,
      body: req.body,
      validatedBody: req.validatedBody
    });
    const pack = await generateVivaPack(req.validatedBody);
    res.json(pack);
  } catch (error) {
    logger.error("Viva generation controller failed", {
      requestId: req.requestId,
      error: error.message
    });
    res.status(503).json({
      success: false,
      message: "AI service temporarily unavailable"
    });
  }
};

export const getRoadmap = async (req, res, next) => {
  try {
    logger.info("Roadmap generation requested", {
      requestId: req.requestId,
      body: req.body,
      validatedBody: req.validatedBody
    });
    const roadmap = await generateRoadmap(req.validatedBody);
    res.json(roadmap);
  } catch (error) {
    logger.error("Roadmap generation controller failed", {
      requestId: req.requestId,
      error: error.message
    });
    res.status(503).json({
      success: false,
      message: "AI service temporarily unavailable"
    });
  }
};

export const getAITest = async (_req, res, next) => {
  try {
    const sample = await generateAIHealthSample();
    res.json(sample);
  } catch (error) {
    next(error);
  }
};
