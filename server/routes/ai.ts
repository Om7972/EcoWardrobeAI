import { Request, Response } from "express";
import {
  generateAIResponse,
  generateOutfitSuggestion,
  generateStyleAdvice,
  analyzeFabric,
  generateSustainabilityTips,
  OpenAIMessage,
} from "../services/openai";

export async function chatWithAI(req: Request, res: Response) {
  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Messages array is required" });
    }

    const response = await generateAIResponse(messages);
    res.json({ response });
  } catch (error: any) {
    console.error("AI Chat Error:", error);
    res.status(500).json({ error: error.message || "Failed to generate AI response" });
  }
}

export async function getOutfitSuggestion(req: Request, res: Response) {
  try {
    const { occasion, weather, style, items } = req.body;

    if (!occasion || !weather || !style || !items) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const suggestion = await generateOutfitSuggestion(
      occasion,
      weather,
      style,
      items
    );
    res.json({ suggestion });
  } catch (error: any) {
    console.error("Outfit Suggestion Error:", error);
    res.status(500).json({ error: error.message || "Failed to generate outfit suggestion" });
  }
}

export async function getStyleAdvice(req: Request, res: Response) {
  try {
    const { query, context } = req.body;

    if (!query) {
      return res.status(400).json({ error: "Query is required" });
    }

    const advice = await generateStyleAdvice(query, context);
    res.json({ advice });
  } catch (error: any) {
    console.error("Style Advice Error:", error);
    res.status(500).json({ error: error.message || "Failed to generate style advice" });
  }
}

export async function analyzeFabricComposition(req: Request, res: Response) {
  try {
    const { fabricDescription, imageData } = req.body;

    if (!fabricDescription) {
      return res.status(400).json({ error: "Fabric description is required" });
    }

    const analysis = await analyzeFabric(fabricDescription, imageData);
    res.json({ analysis });
  } catch (error: any) {
    console.error("Fabric Analysis Error:", error);
    res.status(500).json({ error: error.message || "Failed to analyze fabric" });
  }
}

export async function getSustainabilityTips(req: Request, res: Response) {
  try {
    const { userProfile } = req.body;

    if (!userProfile) {
      return res.status(400).json({ error: "User profile is required" });
    }

    const tips = await generateSustainabilityTips(userProfile);
    res.json({ tips });
  } catch (error: any) {
    console.error("Sustainability Tips Error:", error);
    res.status(500).json({ error: error.message || "Failed to generate sustainability tips" });
  }
}
