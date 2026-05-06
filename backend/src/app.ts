import * as dotenv from "dotenv";
dotenv.config(); // ✅ load env first

import express from "express";
import cors from "cors";
import connectDB from "./configs/db.connect";
import { mainRouter } from "./middleware/mainRouter";
import { log } from "console";

const app = express();

// ✅ connect DB
connectDB();

// ✅ allowed origins (local + production)
const allowedOrigins = [
  "http://localhost:5173",
  process.env.FRONTEND_URL
];
console.log(process.env.FRONTEND_URL)
// ✅ CORS setup
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin as string)) {
        callback(null, true);
      } else {
        callback(new Error("CORS not allowed"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
  })
);

// ✅ middleware
app.use(express.json());

// ✅ routes
app.use("/", mainRouter);

// ✅ test route (optional)
app.get("/", (req, res) => {
  res.send("Server is running ✅");
});

export { app };