import mongoose from "mongoose";
import { BlogPost } from "../models/BlogPost.js";
import { seoArticles } from "../utils/seedData.js";

const useDatabase = () => mongoose.connection.readyState === 1;

export const listBlogPosts = async () => {
  if (!useDatabase()) {
    return seoArticles;
  }

  const posts = await BlogPost.find().sort({ createdAt: -1 }).lean();
  return posts.length ? posts : seoArticles;
};

export const getBlogPostBySlug = async (slug) => {
  if (!useDatabase()) {
    return seoArticles.find((post) => post.slug === slug);
  }

  return BlogPost.findOne({ slug }).lean();
};
