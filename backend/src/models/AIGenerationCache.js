import mongoose from "mongoose";

const aiGenerationCacheSchema = new mongoose.Schema(
  {
    cacheKey: { type: String, required: true, unique: true },
    type: { type: String, enum: ["roadmap", "viva"], required: true },
    input: { type: mongoose.Schema.Types.Mixed, required: true },
    response: { type: mongoose.Schema.Types.Mixed, required: true },
    provider: { type: String, default: "fallback" },
    model: { type: String, default: "local-blueprint" },
    status: { type: String, enum: ["success", "fallback", "cached"], default: "success" },
    lastError: { type: String, default: "" }
  },
  { timestamps: true }
);

export const AIGenerationCache =
  mongoose.models.AIGenerationCache || mongoose.model("AIGenerationCache", aiGenerationCacheSchema);
