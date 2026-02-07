import express from "express";
import { generateImage } from "../controllers/aiController.js";

const router = express.Router();

// Public AI route (no auth)
router.post("/generate-image", generateImage);

console.log('AI router initialized');
router.post("/generate-image", (req, res) => {
  res.json({ message: "AI route works!", prompt: req.body.prompt });
});

export default router;
