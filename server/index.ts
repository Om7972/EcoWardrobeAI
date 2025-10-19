import "dotenv/config";
import express, { Express } from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import { connectDatabase } from "./config/database";
import * as clothingRoutes from "./routes/clothing";
import * as outfitRoutes from "./routes/outfits";
import * as impactRoutes from "./routes/impact";
import * as userRoutes from "./routes/users";
import * as marketplaceRoutes from "./routes/marketplace";
import * as styleCoachRoutes from "./routes/styleCoach";
import * as featureRoutes from "./routes/features";
import * as careRepairRoutes from "./routes/careRepair";
import * as communityRoutes from "./routes/community";

let dbConnected = false;

// Initialize database connection
async function initializeDatabase() {
  if (!dbConnected) {
    try {
      await connectDatabase();
      dbConnected = true;
    } catch (error) {
      console.error("Database initialization failed:", error);
      console.warn("Running in mock mode without database persistence");
    }
  }
}

export async function createServer(): Promise<Express> {
  const app = express();

  // Initialize database
  await initializeDatabase();

  // Middleware
  app.use(cors());
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));

  // Health check
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  // User routes
  app.post("/api/users", userRoutes.getOrCreateUser);
  app.get("/api/users/:userId", userRoutes.getUserProfile);
  app.put("/api/users/:userId", userRoutes.updateUserProfile);
  app.put("/api/users/:userId/preferences", userRoutes.updateStylePreferences);

  // Clothing/Closet routes
  app.post("/api/clothing", clothingRoutes.uploadClothingItem);
  app.get("/api/clothing/user/:userId", clothingRoutes.getUserCloset);
  app.get("/api/clothing/:itemId", clothingRoutes.getClothingItem);
  app.put("/api/clothing/:itemId", clothingRoutes.updateClothingItem);
  app.delete("/api/clothing/:itemId", clothingRoutes.deleteClothingItem);
  app.get("/api/clothing/:itemId/eco-score", clothingRoutes.getEcoScore);

  // Outfit generation routes
  app.post("/api/outfits/generate", outfitRoutes.generateOutfit);
  app.get("/api/outfits/user/:userId", outfitRoutes.getUserOutfits);
  app.put("/api/outfits/:outfitId/save", outfitRoutes.toggleSaveOutfit);
  app.put("/api/outfits/:outfitId/rate", outfitRoutes.rateOutfit);

  // Impact tracking routes
  app.get("/api/impact/:userId/metrics", impactRoutes.calculateImpactMetrics);
  app.get("/api/impact/:userId/history", impactRoutes.getImpactHistory);
  app.get("/api/impact/:userId/achievements", impactRoutes.getAchievements);

  // Marketplace/Thrift Swap routes
  app.post("/api/marketplace/listings", marketplaceRoutes.createSwapListing);
  app.get("/api/marketplace/listings", marketplaceRoutes.getAllListings);
  app.get("/api/marketplace/listings/:listingId", marketplaceRoutes.getListing);
  app.get("/api/marketplace/user/:userId/listings", marketplaceRoutes.getUserListings);
  app.post("/api/marketplace/requests", marketplaceRoutes.createSwapRequest);
  app.get("/api/marketplace/user/:userId/requests", marketplaceRoutes.getUserSwapRequests);
  app.put("/api/marketplace/requests/:requestId/accept", marketplaceRoutes.acceptSwapRequest);
  app.put("/api/marketplace/requests/:requestId/reject", marketplaceRoutes.rejectSwapRequest);
  app.put("/api/marketplace/listings/:listingId/rate", marketplaceRoutes.rateListing);

  // AI Style Coach routes
  app.get("/api/style-coach/daily-suggestions", styleCoachRoutes.getDailySuggestions);
  app.post("/api/style-coach/outfit-advice", styleCoachRoutes.getOutfitAdvice);
  app.get("/api/style-coach/weekly-insights", styleCoachRoutes.getWeeklyInsights);
  app.get("/api/style-coach/seasonal/:season", styleCoachRoutes.getSeasonalGuidance);
  app.get("/api/style-coach/tips", styleCoachRoutes.getStyleTips);

  // Premium Features routes
  app.post("/api/features/analyze-footprint", featureRoutes.analyzeMaterialFootprint);
  app.get("/api/features/circular-matches", featureRoutes.getCircularMatches);
  app.get("/api/features/maintenance-report", featureRoutes.getMaintenanceReport);
  app.get("/api/features/weather-forecast", featureRoutes.getWeatherForecast);

  // Care & Repair routes
  app.get("/api/care/instructions", careRepairRoutes.getCareInstructions);
  app.get("/api/care/repair-history", careRepairRoutes.getRepairHistory);
  app.get("/api/care/nearby-services", careRepairRoutes.getNearbyServices);
  app.get("/api/care/all-services", careRepairRoutes.getAllServices);

  return app;
}
