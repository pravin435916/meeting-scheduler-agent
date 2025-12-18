import express from "express";
import { analyzeTranscript } from "../services/transcript.service.js";

const router = express.Router();
// Analyze transcript and extract structured data
router.post("/analyze", async (req, res) => {
  try {
    const { transcript } = req.body;

    if (!transcript || transcript.trim().length < 10) {
      return res.status(400).json({
        error: "Valid transcript is required"
      });
    }

    const structuredData = await analyzeTranscript(transcript);

    return res.status(200).json(structuredData);
  } catch (error) {
    console.error("Transcript Analysis Error:", error.message);

    return res.status(500).json({
      error: "Failed to analyze transcript"
    });
  }
});

export default router;
