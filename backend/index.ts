import "dotenv/config";
import express from "express";
import cors from "cors";
import path from "path";
import { connectDB } from "./src/config/db";
import heroRoutes from "./src/routes/heroRoutes";
import authRoutes from "./src/routes/authRoutes";

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// servir les images
const uploadDir = process.env.UPLOAD_DIR || "uploads";
app.use(
  `/${uploadDir}`,
  express.static(path.join(__dirname, uploadDir))
);

app.use("/api/heroes", heroRoutes);
app.use("/api/auth", authRoutes);

connectDB().then(() => {
  app.listen(port, () => {
    console.log(`🚀 Backend running on http://localhost:${port}`);
  });
});
