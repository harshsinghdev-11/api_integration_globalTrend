import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  renderPostsPage,
  addMultiplePosts,
  getAllPosts,
  deleteAllPosts
} from "../controller/posts.controller.js";

const postRouter = express.Router();

// Render posts page
postRouter.get("/posts", renderPostsPage);

// Add multiple posts
postRouter.post("/add-multiple", authMiddleware, addMultiplePosts);

// Get all posts
postRouter.get("/getPosts", authMiddleware, getAllPosts);

// Delete all posts
postRouter.get("/deleteAllPosts", authMiddleware, deleteAllPosts);

export default postRouter;
