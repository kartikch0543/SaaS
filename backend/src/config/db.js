import mongoose from "mongoose";
import { env } from "./env.js";

export const connectDatabase = async () => {
  if (!env.mongodbUri) {
    console.warn("MongoDB URI is not configured. Running in content-seed mode.");
    return;
  }

  await mongoose.connect(env.mongodbUri);
};
