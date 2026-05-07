import { generateRoadmap, generateVivaPack } from "../services/aiService.js";

export const getVivaQuestions = async (req, res) => {
  const pack = generateVivaPack(req.validatedBody);
  res.json({ items: pack });
};

export const getRoadmap = async (req, res) => {
  const roadmap = generateRoadmap(req.validatedBody);
  res.json(roadmap);
};
