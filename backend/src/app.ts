import * as dotenv from "dotenv";
import express from "express";
import cors from "cors";
import connectDB from "./configs/db.connect"
import { mainRouter } from "./middleware/mainRouter";

const app = express();
connectDB()
dotenv.config();

const FRONTEND_UR = process.env.FRONTEND_URL || "http://localhost:5173";
console.log("FRONTEND_URL:", FRONTEND_UR);
app.use(cors({origin: FRONTEND_UR , methods: ["GET","POST"]}));
app.use(express.json());
app.use('/', mainRouter);

export { app };