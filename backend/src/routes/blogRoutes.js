import { Router } from "express";
import { getBlogPost, getBlogPosts } from "../controllers/blogController.js";

const router = Router();

router.get("/", getBlogPosts);
router.get("/:slug", getBlogPost);

export default router;
