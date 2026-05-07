import mongoose from "mongoose";

const progressSchema = new mongoose.Schema(
  {
    topic: { type: String, required: true },
    completed: { type: Boolean, default: false },
    hoursSpent: { type: Number, default: 0 },
    quizScore: { type: Number, default: 0 }
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    firebaseUid: { type: String, unique: true, sparse: true },
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    avatarUrl: String,
    role: { type: String, enum: ["student", "admin"], default: "student" },
    streakDays: { type: Number, default: 0 },
    learningHours: { type: Number, default: 0 },
    progress: { type: [progressSchema], default: [] }
  },
  { timestamps: true }
);

export const User = mongoose.models.User || mongoose.model("User", userSchema);
