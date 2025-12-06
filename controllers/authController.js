import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../model/User.js";
import connectDb from "../db/db.js";

const JWT_SECRET = process.env.JWT_SECRET;

connectDb();

// Render register page
export const renderRegisterPage = (req, res) => {
  res.render("register");
};

// Render login page
export const renderLoginPage = (req, res) => {
  res.render("login");
};

// Register new user
export const register = async (req, res) => {
  try {
    const { username, password } = req.body;

    const existingUser = await User.findOne({ username });
    if (existingUser) return res.status(400).send("User already exists");

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();

    res.redirect("/api/auth/login");
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// Login user
export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) return res.status(400).send("Invalid credentials");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).send("Invalid credentials");

    const token = jwt.sign(
      { id: user._id, username: user.username },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 3600000,
    });

    res.redirect("/");
  } catch (err) {
    res.status(500).send(err.message);
  }
};

// Check if user is logged in
export const isLogin = async (req, res) => {
  try {
    const user = req.user;
    const dbUser = await User.findOne({ username: user.username });
    if (!dbUser) {
      return res.status(404).json({ message: "User does not exist" });
    }

    res.json({
      username: dbUser.username,
      id: dbUser._id,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Logout user
export const logout = async (req, res) => {
  try {
    res.clearCookie("token");
    res.status(200).json({
      message: "Logout Done",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: 500, message: "Error logging out" });
  }
};

