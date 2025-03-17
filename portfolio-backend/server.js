import express from "express";
import session from "express-session";
import cors from "cors";
import passport from "passport";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

import "./config/passport.js";
import authRoutes from "./routes/authRoutes.js";

// Load environment variables
dotenv.config();

// Fix __dirname issue for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 5000;

const app = express();

// Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true
  })
);
app.use(express.json());

// Session Middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET || "your_secret",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: process.env.NODE_ENV === "production" }
  })
);

app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/auth", authRoutes);

// Serve frontend static files
app.use(express.static(path.join(__dirname, "../dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../dist", "index.html"));
});

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
