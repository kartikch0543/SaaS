import mongoose from "mongoose";

const faqSchema = new mongoose.Schema(
  {
    question: String,
    answer: String
  },
  { _id: false }
);

const blogPostSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    intent: { type: String, required: true },
    keywords: { type: [String], default: [] },
    heroStat: String,
    content: { type: [String], default: [] },
    faqs: { type: [faqSchema], default: [] },
    canonicalPath: { type: String, required: true }
  },
  { timestamps: true }
);

export const BlogPost = mongoose.models.BlogPost || mongoose.model("BlogPost", blogPostSchema);
