import express from "express";
import {
  getPostById,
  getAllPosts,
  createPost,
  updatePost,
  getPostsByUserId,
} from "../controllers/jsonPlaceholderController.js";

const router = express.Router();

// JSON Placeholder API routes
router.get("/post/:id", getPostById);
router.get("/posts", getAllPosts);
router.post("/post", createPost);
router.put("/post/:id", updatePost);
router.get("/posts/user/:userId", getPostsByUserId);

export default router;
