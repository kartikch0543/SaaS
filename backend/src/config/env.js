import dotenv from "dotenv";

dotenv.config();

const normalizeOrigin = (value) => value?.trim().replace(/\/+$/, "") || "";
const parseOrigins = (value) =>
  value
    .split(",")
    .map(normalizeOrigin)
    .filter(Boolean);

const frontendOrigins = parseOrigins(process.env.FRONTEND_URL || "http://localhost:5173");

export const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT || 5000),
  frontendUrl: frontendOrigins[0] || "http://localhost:5173",
  frontendOrigins,
  mongodbUri: process.env.MONGODB_URI || "",
  jwtSecret: process.env.JWT_SECRET || "development-secret",
  firebaseProjectId: process.env.FIREBASE_PROJECT_ID || "",
  firebaseClientEmail: process.env.FIREBASE_CLIENT_EMAIL || "",
  firebasePrivateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n") || "",
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME || "",
    apiKey: process.env.CLOUDINARY_API_KEY || "",
    apiSecret: process.env.CLOUDINARY_API_SECRET || ""
  },
  googleAnalyticsId: process.env.GOOGLE_ANALYTICS_ID || "",
  searchConsoleSiteUrl: process.env.SEARCH_CONSOLE_SITE_URL || "",
  clarityProjectId: process.env.CLARITY_PROJECT_ID || ""
};

export const isProduction = env.nodeEnv === "production";
