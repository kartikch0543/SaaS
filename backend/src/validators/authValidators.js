import { z } from "zod";

export const sessionSchema = z.object({
  firebaseToken: z.string().min(10),
  name: z.string().min(1),
  email: z.string().email(),
  avatarUrl: z.string().url().optional().or(z.literal(""))
});
