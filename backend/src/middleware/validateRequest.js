export const validateRequest = (schema) => (req, _res, next) => {
  const parsed = schema.safeParse(req.body);

  if (!parsed.success) {
    return next({
      statusCode: 400,
      message: parsed.error.issues.map((issue) => issue.message).join(", ")
    });
  }

  req.validatedBody = parsed.data;
  next();
};
