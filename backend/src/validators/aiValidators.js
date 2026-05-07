import { z } from "zod";

export const vivaSchema = z.object({
  subject: z.enum(["dbms", "oops", "cn", "os"]).default("dbms"),
  level: z.enum(["beginner", "intermediate", "advanced"]).default("intermediate")
});

export const roadmapSchema = z.object({
  goal: z.string().min(5),
  durationWeeks: z.number().int().min(2).max(16).default(8)
});
