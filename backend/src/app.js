import cors from "cors";
import compression from "compression";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import { randomUUID } from "crypto";
import rateLimit from "express-rate-limit";
import healthRoutes from "./routes/healthRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import blogRoutes from "./routes/blogRoutes.js";
import analyticsRoutes from "./routes/analyticsRoutes.js";
import { env } from "./config/env.js";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler.js";
import { logger } from "./utils/logger.js";

export const createApp = () => {
  const app = express();
  const isAllowedOrigin = (origin) => {
    const normalizedOrigin = origin.replace(/\/+$/, "");

    if (env.frontendOrigins.includes(normalizedOrigin)) {
      return true;
    }

    if (/^https:\/\/.*\.vercel\.app$/i.test(normalizedOrigin)) {
      return true;
    }

    if (/^http:\/\/localhost:\d+$/i.test(normalizedOrigin)) {
      return true;
    }

    return false;
  };

  app.use(helmet());
  app.use(compression());
  app.use(
    cors({
      origin: (origin, callback) => {
        if (!origin) {
          return callback(null, true);
        }

        if (isAllowedOrigin(origin)) {
          return callback(null, true);
        }

        return callback(new Error(`CORS blocked for origin: ${origin}`));
      },
      credentials: true
    })
  );
  app.use(express.json({ limit: "1mb" }));
  app.use(morgan("dev"));
  app.use((req, res, next) => {
    req.requestId = randomUUID();
    const startedAt = Date.now();

    logger.info("Incoming request", {
      requestId: req.requestId,
      method: req.method,
      path: req.originalUrl
    });

    res.on("finish", () => {
      logger.info("Request completed", {
        requestId: req.requestId,
        method: req.method,
        path: req.originalUrl,
        statusCode: res.statusCode,
        durationMs: Date.now() - startedAt
      });
    });

    next();
  });
  app.use(
    rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 300
    })
  );

  app.use("/health", healthRoutes);
  app.use("/api/health", healthRoutes);
  app.use("/api/auth", authRoutes);
  app.use("/api/ai", aiRoutes);
  app.use("/api/dashboard", dashboardRoutes);
  app.use("/api/blogs", blogRoutes);
  app.use("/api/admin/analytics", analyticsRoutes);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
};
