import { getBlogPostBySlug, listBlogPosts } from "../services/blogService.js";

export const getBlogPosts = async (_req, res) => {
  const posts = await listBlogPosts();
  res.json({ items: posts });
};

export const getBlogPost = async (req, res) => {
  const post = await getBlogPostBySlug(req.params.slug);

  if (!post) {
    return res.status(404).json({ message: "Post not found." });
  }

  return res.json(post);
};
