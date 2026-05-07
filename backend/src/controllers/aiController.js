import { generateAIHealthSample, generateRoadmap, generateVivaPack } from "../services/aiService.js";

export const getVivaQuestions = async (req, res, next) => {
  try {
    const pack = await generateVivaPack(req.validatedBody);
    res.json({ items: pack });
  } catch (error) {
    next(error);
  }
};

export const getRoadmap = async (req, res, next) => {
  try {
    const roadmap = await generateRoadmap(req.validatedBody);
    res.json(roadmap);
  } catch (error) {
    next(error);
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
