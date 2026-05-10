import { z } from "zod";

export const vivaSchema = z.object({
  subject: z.string().min(2).max(40).default("general"),
  topic: z.string().min(3).max(120).optional().or(z.literal("")),
  level: z.enum(["beginner", "intermediate", "advanced"]).default("intermediate")
});

export const roadmapSchema = z.preprocess((input) => {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    return input;
  }

  const payload = input;
  const normalizedGoal = payload.goal || payload.topic || payload.query || payload.search || "";
  const normalizedDuration =
    typeof payload.durationWeeks === "string" ? Number.parseInt(payload.durationWeeks, 10) : payload.durationWeeks;

  return {
    ...payload,
    goal: normalizedGoal,
    durationWeeks: Number.isNaN(normalizedDuration) ? payload.durationWeeks : normalizedDuration
  };
}, z.object({
  goal: z.string().trim().min(3, "Topic is required").max(160, "Topic is too long"),
  durationWeeks: z.number().int().min(2).max(16).default(8)
}));
