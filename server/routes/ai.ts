import { Request, Response } from "express";
import { multiAI, AIMessage } from "../services/multiAI";
import { weatherService } from "../services/weather";
import { calendarService } from "../services/calendar";

export async function chatWithAI(req: Request, res: Response) {
  try {
    const { messages, provider } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "Messages array is required" });
    }

    try {
      const aiMessages: AIMessage[] = messages.map((msg: any) => ({
        role: msg.role,
        content: msg.content
      }));

      const response = await multiAI.chat(aiMessages, { provider });
      res.json({ response });
    } catch (aiError: any) {
      console.error("AI service error:", aiError);
      // Fallback response if all AI services fail
      const fallbackResponse = "EcoWardrobe AI is currently running in demo mode. How can I help you with sustainable fashion today?";
      res.json({ response: fallbackResponse });
    }
  } catch (error: any) {
    console.error("AI Chat Error:", error);
    // Always return a response, never throw
    const fallbackResponse = "EcoWardrobe AI is currently running in demo mode. How can I help you with sustainable fashion today?";
    res.json({ response: fallbackResponse });
  }
}

export async function getOutfitSuggestion(req: Request, res: Response) {
  try {
    const { occasion, weather, style, items, provider } = req.body;

    if (!occasion || !weather || !style || !items) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const suggestion = await multiAI.generateOutfitSuggestion(
      occasion,
      weather,
      style,
      items,
      { provider }
    );
    res.json({ suggestion });
  } catch (error: any) {
    console.error("Outfit Suggestion Error:", error);
    res.status(500).json({ error: error.message || "Failed to generate outfit suggestion" });
  }
}

export async function getStyleAdvice(req: Request, res: Response) {
  try {
    const { query, context, provider } = req.body;

    if (!query) {
      return res.status(400).json({ error: "Query is required" });
    }

    const advice = await multiAI.generateStyleAdvice(query, context, { provider });
    res.json({ advice });
  } catch (error: any) {
    console.error("Style Advice Error:", error);
    res.status(500).json({ error: error.message || "Failed to generate style advice" });
  }
}

export async function analyzeFabricComposition(req: Request, res: Response) {
  try {
    const { fabricDescription, provider } = req.body;

    if (!fabricDescription) {
      return res.status(400).json({ error: "Fabric description is required" });
    }

    const analysis = await multiAI.analyzeFabric(fabricDescription, { provider });
    res.json({ analysis });
  } catch (error: any) {
    console.error("Fabric Analysis Error:", error);
    res.status(500).json({ error: error.message || "Failed to analyze fabric" });
  }
}

export async function getSustainabilityTips(req: Request, res: Response) {
  try {
    const { userProfile, provider } = req.body;

    if (!userProfile) {
      return res.status(400).json({ error: "User profile is required" });
    }

    const tips = await multiAI.generateSustainabilityTips(userProfile, { provider });
    res.json({ tips });
  } catch (error: any) {
    console.error("Sustainability Tips Error:", error);
    res.status(500).json({ error: error.message || "Failed to generate sustainability tips" });
  }
}

// New weather-based outfit suggestions
export async function getWeatherBasedOutfit(req: Request, res: Response) {
  try {
    const { location, userPreferences, provider } = req.body;

    if (!location) {
      return res.status(400).json({ error: "Location is required" });
    }

    const weatherData = await weatherService.getCurrentWeather(location);
    const outfit = await multiAI.getWeatherBasedOutfit(
      location,
      weatherData,
      userPreferences || {},
      { provider }
    );

    res.json({ 
      outfit, 
      weather: weatherData,
      recommendations: weatherService.getOutfitRecommendationForWeather(weatherData)
    });
  } catch (error: any) {
    console.error("Weather-based Outfit Error:", error);
    res.status(500).json({ error: error.message || "Failed to generate weather-based outfit" });
  }
}

// New event-based styling
export async function getEventBasedStyling(req: Request, res: Response) {
  try {
    const { eventDetails, userWardrobe, provider } = req.body;

    if (!eventDetails) {
      return res.status(400).json({ error: "Event details are required" });
    }

    const styling = await multiAI.getEventBasedStyling(
      eventDetails,
      userWardrobe || {},
      { provider }
    );

    res.json({ styling });
  } catch (error: any) {
    console.error("Event-based Styling Error:", error);
    res.status(500).json({ error: error.message || "Failed to generate event-based styling" });
  }
}

// Get weather forecast
export async function getWeatherForecast(req: Request, res: Response) {
  try {
    const { location } = req.query;

    if (!location || typeof location !== "string") {
      return res.status(400).json({ error: "Location is required" });
    }

    const forecast = await weatherService.getWeatherForecast(location);
    res.json({ forecast });
  } catch (error: any) {
    console.error("Weather Forecast Error:", error);
    res.status(500).json({ error: error.message || "Failed to get weather forecast" });
  }
}

// Get calendar events and styling suggestions
export async function getCalendarStyling(req: Request, res: Response) {
  try {
    const { calendarId, days } = req.query;

    const suggestions = await calendarService.getEventBasedOutfitSuggestions(
      calendarId as string || "primary",
      parseInt(days as string) || 7
    );

    res.json({ suggestions });
  } catch (error: any) {
    console.error("Calendar Styling Error:", error);
    res.status(500).json({ error: error.message || "Failed to get calendar styling suggestions" });
  }
}

// Test AI providers endpoint
export async function testAIProviders(req: Request, res: Response) {
  try {
    const testMessage = "Hello, please respond with a brief greeting about sustainable fashion.";
    const testMessages: AIMessage[] = [
      {
        role: "system",
        content: "You are a helpful AI assistant specializing in sustainable fashion."
      },
      {
        role: "user",
        content: testMessage
      }
    ];

    const results: any = {};
    const providers: Array<"gemini" | "openai" | "groq" | "anthropic"> = ["gemini", "openai", "groq", "anthropic"];

    for (const provider of providers) {
      try {
        console.log(`Testing provider: ${provider}`);
        const response = await multiAI.chat(testMessages, { provider });
        results[provider] = {
          status: "success",
          response: response.substring(0, 100) + "...", // Truncate for readability
          timestamp: new Date().toISOString()
        };
      } catch (error: any) {
        results[provider] = {
          status: "error",
          error: error.message,
          timestamp: new Date().toISOString()
        };
      }
    }

    res.json({
      message: "AI Provider Test Results",
      results,
      summary: {
        total: providers.length,
        working: Object.values(results).filter((r: any) => r.status === "success").length,
        failed: Object.values(results).filter((r: any) => r.status === "error").length
      }
    });
  } catch (error: any) {
    console.error("AI Provider Test Error:", error);
    res.status(500).json({ error: error.message || "Failed to test AI providers" });
  }
}
