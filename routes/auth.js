import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  renderRegisterPage,
  renderLoginPage,
  register,
  login,
  isLogin,
  logout,
} from "../controllers/authController.js";

const authRouter = express.Router();

// Render pages
authRouter.get("/register", renderRegisterPage);
authRouter.get("/login", renderLoginPage);

// Authentication routes
authRouter.post("/register", register);
authRouter.post("/login", login);

// Protected routes
authRouter.get("/isLogin", authMiddleware, isLogin);
authRouter.get("/logout", authMiddleware, logout);

export default authRouter;
