import { z } from "zod";

export const vivaSchema = z.object({
  subject: z.enum(["dbms", "oops", "cn", "os"]).default("dbms"),
  topic: z.string().min(3).max(120).optional().or(z.literal("")),
  level: z.enum(["beginner", "intermediate", "advanced"]).default("intermediate")
});

export const roadmapSchema = z.object({
  goal: z.string().min(5),
  durationWeeks: z.number().int().min(2).max(16).default(8)
});
