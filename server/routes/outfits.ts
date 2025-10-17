import { RequestHandler } from "express";
import { Outfit, ClothingItem } from "../models/index";
import { generateOutfitWithAI } from "../services/aiService";
import { getWeather, getWeatherBasedRecommendations, getMockWeather } from "../services/weatherService";

// Generate outfit with AI
export const generateOutfit: RequestHandler = async (req, res) => {
  try {
    const { userId, occasion, weather, stylePreferences, lat, lon } = req.body;

    if (!userId || !occasion) {
      res.status(400).json({
        error: "Missing required fields: userId, occasion",
      });
      return;
    }

    // Get weather if coordinates provided
    let weatherData = weather;
    if (!weatherData && lat && lon) {
      const fetchedWeather = await getWeather(lat, lon);
      weatherData = fetchedWeather?.description || "Clear";
    } else if (!weatherData) {
      const mockWeather = getMockWeather();
      weatherData = mockWeather.description;
    }

    // Generate outfit with AI
    const aiResponse = await generateOutfitWithAI({
      occasion,
      weather: weatherData,
      stylePreferences,
    });

    // Get random items from user's closet for the outfit
    const closetItems = await ClothingItem.find({ userId })
      .limit(5)
      .exec();
    const itemIds = closetItems.map((item) => item._id.toString());

    // Create outfit record
    const outfit = new Outfit({
      userId,
      title: `${occasion.charAt(0).toUpperCase() + occasion.slice(1)} Outfit`,
      description: aiResponse.outfitDescription,
      items: itemIds,
      occasion,
      weather: weatherData,
      saved: false,
      aiSuggestion: {
        explanation: aiResponse.outfitDescription,
        confidence: aiResponse.confidence,
      },
    });

    await outfit.save();

    // Get weather recommendations
    const mockWeather = getMockWeather();
    const weatherRecommendations = getWeatherBasedRecommendations(mockWeather);

    res.status(201).json({
      success: true,
      data: {
        outfit: outfit,
        description: aiResponse.outfitDescription,
        suggestions: [...aiResponse.suggestions, ...weatherRecommendations],
        weatherInfo: mockWeather,
        confidence: aiResponse.confidence,
      },
    });
  } catch (error) {
    console.error("Generate outfit error:", error);
    res.status(500).json({ error: "Failed to generate outfit" });
  }
};

// Get user's outfits
export const getUserOutfits: RequestHandler = async (req, res) => {
  try {
    const { userId } = req.params;
    const { saved, occasion } = req.query;

    const query: Record<string, any> = { userId };

    if (saved === "true") query.saved = true;
    if (occasion) query.occasion = occasion;

    const outfits = await Outfit.find(query)
      .populate("items")
      .sort({ generatedAt: -1 });

    res.json({
      success: true,
      count: outfits.length,
      data: outfits,
    });
  } catch (error) {
    console.error("Fetch outfits error:", error);
    res.status(500).json({ error: "Failed to fetch outfits" });
  }
};

// Save/unsave outfit
export const toggleSaveOutfit: RequestHandler = async (req, res) => {
  try {
    const { outfitId } = req.params;

    const outfit = await Outfit.findById(outfitId);

    if (!outfit) {
      res.status(404).json({ error: "Outfit not found" });
      return;
    }

    outfit.saved = !outfit.saved;
    await outfit.save();

    res.json({
      success: true,
      data: outfit,
    });
  } catch (error) {
    console.error("Save outfit error:", error);
    res.status(500).json({ error: "Failed to save outfit" });
  }
};

// Rate outfit
export const rateOutfit: RequestHandler = async (req, res) => {
  try {
    const { outfitId } = req.params;
    const { rating } = req.body;

    if (rating < 1 || rating > 5) {
      res.status(400).json({ error: "Rating must be between 1 and 5" });
      return;
    }

    const outfit = await Outfit.findByIdAndUpdate(
      outfitId,
      { rating },
      { new: true }
    );

    if (!outfit) {
      res.status(404).json({ error: "Outfit not found" });
      return;
    }

    res.json({
      success: true,
      data: outfit,
    });
  } catch (error) {
    console.error("Rate outfit error:", error);
    res.status(500).json({ error: "Failed to rate outfit" });
  }
};
