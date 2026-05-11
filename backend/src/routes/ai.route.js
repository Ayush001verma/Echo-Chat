import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { generateAIResponse } from "../controllers/ai.controller.js";

const router = express.Router();

router.post("/generate", protectRoute, generateAIResponse);

export default router;
