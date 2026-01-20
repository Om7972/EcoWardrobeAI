import { RequestHandler } from "express";
import { Outfit, ClothingItem } from "../models/index";
import { executeWithFallback } from "../config/database";
import { generateOutfitWithAI } from "../services/aiService";
import { getWeather, getWeatherBasedRecommendations, getMockWeather } from "../services/weatherService";

// Mock outfit data for fallback
const mockOutfits = [
  {
    _id: "mock-outfit-1",
    userId: "demo-user",
    title: "Professional Work Outfit",
    description: "A polished look perfect for business meetings and office environments",
    items: ["mock-item-1", "mock-item-2"],
    occasion: "work",
    weather: "clear",
    saved: true,
    aiSuggestion: {
      outfitDescription: "Professional and sustainable outfit combining organic cotton with recycled materials",
      styleNotes: ["Perfect for business meetings", "Comfortable all-day wear", "Sustainable materials"],
      sustainabilityTips: "Choose quality pieces that can be mixed and matched for multiple professional looks"
    },
    generatedAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: "mock-outfit-2",
    userId: "demo-user", 
    title: "Casual Weekend Look",
    description: "Relaxed and comfortable outfit for weekend activities",
    items: ["mock-item-1"],
    occasion: "casual",
    weather: "partly cloudy",
    saved: false,
    aiSuggestion: {
      outfitDescription: "Comfortable casual look with sustainable materials",
      styleNotes: ["Perfect for weekend outings", "Easy to move in", "Versatile styling"],
      sustainabilityTips: "Mix high and low pieces, and don't be afraid to repeat favorite outfits"
    },
    generatedAt: new Date(),
    updatedAt: new Date()
  }
];

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

    const result = await executeWithFallback(
      async () => {
        const query: Record<string, any> = { userId };

        if (saved === "true") query.saved = true;
        if (occasion) query.occasion = occasion;

        const outfits = await Outfit.find(query)
          .populate("items")
          .sort({ generatedAt: -1 });

        return outfits;
      },
      () => {
        // Fallback: return mock outfits
        let filteredOutfits = mockOutfits.filter(outfit => 
          outfit.userId === userId || outfit.userId === "demo-user"
        );

        // Apply filters
        if (saved === "true") {
          filteredOutfits = filteredOutfits.filter(outfit => outfit.saved);
        }
        if (occasion) {
          filteredOutfits = filteredOutfits.filter(outfit => outfit.occasion === occasion);
        }

        return filteredOutfits;
      },
      "Fetch user outfits"
    );

    res.json({
      success: true,
      count: result.length,
      data: result,
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
