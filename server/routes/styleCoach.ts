import { RequestHandler } from "express";
import {
  generateDailySuggestions,
  getPersonalizedOutfitAdvice,
  getWeeklyOutfitInsights,
  getSeasonalAdvice,
} from "../services/styleCoachService";

// Get daily outfit suggestions
export const getDailySuggestions: RequestHandler = async (req, res) => {
  try {
    const { date = "today" } = req.query;

    const suggestions = await generateDailySuggestions(
      (date as "today" | "tomorrow") || "today"
    );

    res.json({
      success: true,
      data: suggestions,
    });
  } catch (error) {
    console.error("Daily suggestions error:", error);
    res.status(500).json({ error: "Failed to generate suggestions" });
  }
};

// Get personalized outfit advice
export const getOutfitAdvice: RequestHandler = async (req, res) => {
  try {
    const { colorPalette, stylePreferences, occasion, bodyType } = req.body;

    if (!colorPalette || !stylePreferences || !occasion) {
      res.status(400).json({
        error: "Missing required fields: colorPalette, stylePreferences, occasion",
      });
      return;
    }

    const advice = await getPersonalizedOutfitAdvice(
      { colorPalette, stylePreferences, bodyType },
      occasion
    );

    res.json({
      success: true,
      data: advice,
    });
  } catch (error) {
    console.error("Outfit advice error:", error);
    res.status(500).json({ error: "Failed to generate advice" });
  }
};

// Get weekly outfit insights
export const getWeeklyInsights: RequestHandler = async (req, res) => {
  try {
    const insights = getWeeklyOutfitInsights();

    res.json({
      success: true,
      data: insights,
    });
  } catch (error) {
    console.error("Weekly insights error:", error);
    res.status(500).json({ error: "Failed to get insights" });
  }
};

// Get seasonal advice
export const getSeasonalGuidance: RequestHandler = async (req, res) => {
  try {
    const { season } = req.params;

    if (!["spring", "summer", "fall", "winter"].includes(season)) {
      res.status(400).json({ error: "Invalid season" });
      return;
    }

    const advice = getSeasonalAdvice(season as any);

    res.json({
      success: true,
      data: advice,
    });
  } catch (error) {
    console.error("Seasonal guidance error:", error);
    res.status(500).json({ error: "Failed to get seasonal guidance" });
  }
};

// Get quick style tips
export const getStyleTips: RequestHandler = async (req, res) => {
  try {
    const { occasion, timeOfDay } = req.query;

    const tips = {
      occasion: occasion || "general",
      timeOfDay: timeOfDay || "any time",
      tips: [
        "Wear clothes that make you feel confident",
        "Quality over quantity - invest in versatile pieces",
        "Accessories can completely change an outfit",
        "Colors that make your skin glow are your best friends",
        "Comfort is key - if you feel good, you'll look good",
        "Mix and match pieces to create multiple outfits",
        "Take care of your clothes to make them last longer",
        "Personal style is about expressing yourself, not following trends",
      ],
    };

    res.json({
      success: true,
      data: tips,
    });
  } catch (error) {
    console.error("Style tips error:", error);
    res.status(500).json({ error: "Failed to get tips" });
  }
};
