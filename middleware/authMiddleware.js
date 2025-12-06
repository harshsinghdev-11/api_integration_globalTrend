import jwt from "jsonwebtoken";
import dotenv from "dotenv"
dotenv.config();
const JWT_SECRET=process.env.JWT_SECRET;

export default async function authMiddleware(req, res, next){
    try {
    const token = req.cookies.token;
    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid Token" });
  }
}