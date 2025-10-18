import { RequestHandler } from "express";
import { analyzeFootprint } from "../services/footprintService";
import { generateCircularMatches } from "../services/circularMatchesService";
import { generateMaintenanceReport } from "../services/maintenanceService";

// Material Footprint Analyzer
export const analyzeMaterialFootprint: RequestHandler = async (req, res) => {
  try {
    const { materialComposition } = req.body;

    if (!materialComposition) {
      res.status(400).json({
        error: "materialComposition is required (e.g., '100% Cotton')",
      });
      return;
    }

    const analysis = analyzeFootprint(materialComposition);

    res.json({
      success: true,
      data: analysis,
    });
  } catch (error) {
    console.error("Footprint analysis error:", error);
    res.status(500).json({ error: "Failed to analyze footprint" });
  }
};

// Circular Matches (Outfit Swap Suggestions)
export const getCircularMatches: RequestHandler = async (req, res) => {
  try {
    const { stylePreferences = ["casual", "minimalist"] } = req.query;

    const styles = Array.isArray(stylePreferences)
      ? stylePreferences
      : [stylePreferences];

    const matches = generateCircularMatches(
      styles.map((s) => String(s).toLowerCase())
    );

    res.json({
      success: true,
      count: matches.length,
      data: matches,
    });
  } catch (error) {
    console.error("Circular matches error:", error);
    res.status(500).json({ error: "Failed to get matches" });
  }
};

// Eco-Maintenance Report
export const getMaintenanceReport: RequestHandler = async (req, res) => {
  try {
    const report = generateMaintenanceReport();

    res.json({
      success: true,
      data: report,
    });
  } catch (error) {
    console.error("Maintenance report error:", error);
    res.status(500).json({ error: "Failed to generate maintenance report" });
  }
};

// Weather Forecast (14-day)
export const getWeatherForecast: RequestHandler = async (req, res) => {
  try {
    const { days = 14 } = req.query;
    const forecastDays = Math.min(parseInt(String(days)) || 14, 30);

    const mockForecast = Array.from({ length: forecastDays }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() + i);

      const temps = [18, 20, 22, 19, 21, 17, 19, 20, 22, 18, 19, 21, 20, 19];
      const conditions = [
        "Sunny",
        "Partly Cloudy",
        "Cloudy",
        "Rainy",
        "Sunny",
        "Cloudy",
        "Rainy",
        "Sunny",
        "Partly Cloudy",
        "Sunny",
        "Cloudy",
        "Rainy",
        "Sunny",
        "Partly Cloudy",
      ];

      return {
        date: date.toISOString().split("T")[0],
        temp: temps[i % temps.length],
        humidity: 50 + Math.random() * 40,
        description: conditions[i % conditions.length],
        precip: Math.random() > 0.6 ? Math.random() * 30 : 0,
        windSpeed: 5 + Math.random() * 20,
      };
    });

    res.json({
      success: true,
      days: forecastDays,
      data: mockForecast,
    });
  } catch (error) {
    console.error("Weather forecast error:", error);
    res.status(500).json({ error: "Failed to fetch weather forecast" });
  }
};
