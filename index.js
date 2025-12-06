import express from "express";
const app = express();
app.use(cors({
  origin: "http://localhost:3000", 
  credentials: true
}));
import router from "./routes/jsonPlaceholderRoutes.js"
import authRouter from "./routes/auth.js";
import dotenv from "dotenv"
import cors from "cors";
import cookieParser from "cookie-parser";
import postRouter from "./routes/userPost.js";
dotenv.config();
app.set("view engine","ejs");


app.set("views","./views");
app.use(express.urlencoded({extended:true}));
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(cookieParser());
app.use(express.static("public"));





const PORT = process.env.PORT || 3000;

//routes
app.use("/api/jsonPlaceHolder",router);
app.use("/api/auth",authRouter);
app.use("/api",postRouter);


//check routes
app.get("/check",(req,res)=>{
    res.send("Server is running");
})

app.get("/",(req,res)=>{
    res.render("index");
})

app.listen(PORT,()=>{
    console.log(`server is running on http://localhost:${PORT}`);
})