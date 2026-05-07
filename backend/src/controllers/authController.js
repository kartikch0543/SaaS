import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { sessionSchema } from "../validators/authValidators.js";
import { env } from "../config/env.js";
import { User } from "../models/User.js";

export const createSession = async (req, res, next) => {
  try {
    const payload = sessionSchema.parse(req.body);

    let user;
    if (mongoose.connection.readyState === 1) {
      user = await User.findOneAndUpdate(
        { email: payload.email },
        {
          email: payload.email,
          name: payload.name,
          avatarUrl: payload.avatarUrl || "",
          firebaseUid: payload.email
        },
        { new: true, upsert: true }
      );
    } else {
      user = {
        id: "seed-user",
        email: payload.email,
        name: payload.name,
        avatarUrl: payload.avatarUrl || "",
        role: "student"
      };
    }

    const token = jwt.sign(
      {
        sub: user.id || user._id?.toString() || payload.email,
        email: payload.email,
        name: payload.name,
        role: user.role || "student"
      },
      env.jwtSecret,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      user: {
        id: user.id || user._id?.toString() || payload.email,
        email: payload.email,
        name: payload.name,
        avatarUrl: payload.avatarUrl || "",
        role: user.role || "student"
      }
    });
  } catch (error) {
    next(error);
  }
};
