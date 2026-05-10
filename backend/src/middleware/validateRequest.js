import { logger } from "../utils/logger.js";

export const validateRequest = (schema) => (req, _res, next) => {
  const parsed = schema.safeParse(req.body);

  if (!parsed.success) {
    logger.warn("Request validation failed", {
      requestId: req.requestId,
      path: req.originalUrl,
      body: req.body,
      issues: parsed.error.issues.map((issue) => ({
        path: issue.path.join("."),
        message: issue.message
      }))
    });
    return next({
      statusCode: 400,
      message: parsed.error.issues.map((issue) => issue.message).join(", ")
    });
  }

  req.validatedBody = parsed.data;
  logger.info("Request validation passed", {
    requestId: req.requestId,
    path: req.originalUrl,
    validatedBody: req.validatedBody
  });
  next();
};
