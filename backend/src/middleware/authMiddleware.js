import jwt from "jsonwebtoken";
import { getFirebaseAdmin } from "../config/firebase.js";
import { env } from "../config/env.js";

export const requireAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Missing authorization token." });
  }

  const token = authHeader.replace("Bearer ", "");

  try {
    const admin = getFirebaseAdmin();

    if (admin) {
      const decoded = await admin.auth().verifyIdToken(token);
      req.user = decoded;
      return next();
    }

    const decoded = jwt.verify(token, env.jwtSecret);
    req.user = decoded;
    return next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token." });
  }
};
