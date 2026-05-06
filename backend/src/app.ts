import * as dotenv from "dotenv";
dotenv.config(); // ✅ FIRST (very important)

import express from "express";
import cors from "cors";
import connectDB from "./configs/db.connect";
import { mainRouter } from "./middleware/mainRouter";

const app = express();

// ✅ Connect DB after env loaded
connectDB();

// ✅ Allowed origins (local + deployed frontend)
const allowedOrigins = [
  "http://localhost:5173",
  "https://erp-system-khaki-beta.vercel.app"
];

// ✅ CORS setup (production-ready)
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("CORS not allowed"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

// ✅ Middleware
app.use(express.json());

// ✅ Routes
app.use('/', mainRouter);

// ✅ Optional test route (very useful)
app.get("/", (req, res) => {
  res.send("Server is running ✅");
});

export { app };