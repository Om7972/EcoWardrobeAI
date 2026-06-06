import dotenv from "dotenv";
dotenv.config({ path: process.env.NODE_ENV === "production" ? ".env.production" : ".env" });
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
import * as moodboardRoutes from "./routes/moodboard";
import * as capsuleRoutes from "./routes/capsule";
import * as fabricAnalysisRoutes from "./routes/fabricAnalysis";
import * as styleCircleRoutes from "./routes/styleCircle";
import * as authRoutes from "./routes/auth";
import * as aiRoutes from "./routes/ai";
import { authenticateToken } from "./middleware/auth";

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

// Environment validation
function validateEnvironment() {
  const requiredEnvVars = ['JWT_SECRET'];
  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    console.warn(`⚠️ Missing environment variables: ${missingVars.join(', ')}`);
    console.warn('Using fallback values for missing variables');
  }
  
  // Set fallback values
  if (!process.env.JWT_SECRET) {
    process.env.JWT_SECRET = 'fallback_jwt_secret_key_2025';
  }
  if (!process.env.PING_MESSAGE) {
    process.env.PING_MESSAGE = 'ping pong';
  }
  if (!process.env.NODE_ENV) {
    process.env.NODE_ENV = 'development';
  }
  
  console.log('✅ Environment configuration validated');
}

export async function createServer(): Promise<Express> {
  const app = express();

  // Validate environment variables
  validateEnvironment();

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

  app.get("/health", (_req, res) => {
    res.json({ status: "ok", message: "healthy" });
  });

  app.get("/api/demo", handleDemo);

  // Authentication routes
  app.post("/api/auth/signup", authRoutes.signUp);
  app.post("/api/auth/signin", authRoutes.signIn);
  
  // Protected routes - require authentication
  app.use("/api/protected", authenticateToken);
  
  // User profile routes (protected)
  app.get("/api/protected/profile", authRoutes.getProfile);
  app.put("/api/protected/profile", authRoutes.updateProfile);
  app.put("/api/protected/change-password", authRoutes.changePassword);

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
  app.post("/api/marketplace/listings", marketplaceRoutes.createListing);
  app.get("/api/marketplace/listings", marketplaceRoutes.getAllListings);
  app.get("/api/marketplace/listings/:listingId", marketplaceRoutes.getListing);
  app.get(
    "/api/marketplace/user/:userId/listings",
    marketplaceRoutes.getUserListings,
  );
  app.put("/api/marketplace/listings/:listingId", marketplaceRoutes.updateListing);
  app.delete("/api/marketplace/listings/:listingId", marketplaceRoutes.deleteListing);
  app.post("/api/marketplace/requests", marketplaceRoutes.createSwapRequest);
  app.get(
    "/api/marketplace/user/:userId/requests",
    marketplaceRoutes.getUserSwapRequests,
  );
  app.put(
    "/api/marketplace/requests/:requestId/accept",
    marketplaceRoutes.acceptSwapRequest,
  );
  app.put(
    "/api/marketplace/requests/:requestId/reject",
    marketplaceRoutes.rejectSwapRequest,
  );
  app.put(
    "/api/marketplace/requests/:requestId/complete",
    marketplaceRoutes.completeSwap,
  );
  app.put(
    "/api/marketplace/listings/:listingId/like",
    marketplaceRoutes.likeListing,
  );

  // AI Style Coach routes
  app.get(
    "/api/style-coach/daily-suggestions",
    styleCoachRoutes.getDailySuggestions,
  );
  app.post("/api/style-coach/outfit-advice", styleCoachRoutes.getOutfitAdvice);
  app.get(
    "/api/style-coach/weekly-insights",
    styleCoachRoutes.getWeeklyInsights,
  );
  app.get(
    "/api/style-coach/seasonal/:season",
    styleCoachRoutes.getSeasonalGuidance,
  );
  app.get("/api/style-coach/tips", styleCoachRoutes.getStyleTips);

  // Premium Features routes
  app.post(
    "/api/features/analyze-footprint",
    featureRoutes.analyzeMaterialFootprint,
  );
  app.get("/api/features/circular-matches", featureRoutes.getCircularMatches);
  app.get(
    "/api/features/maintenance-report",
    featureRoutes.getMaintenanceReport,
  );
  app.get("/api/features/weather-forecast", featureRoutes.getWeatherForecast);

  // Care & Repair routes
  app.get("/api/care/instructions/:itemId", careRepairRoutes.getCareInstructions);
  app.put("/api/care/instructions/:itemId", careRepairRoutes.upsertCareInstructions);
  app.get("/api/care/repair-history/:userId/:itemId", careRepairRoutes.getRepairHistory);
  app.post("/api/care/repair-log/:userId", careRepairRoutes.addRepairLog);
  app.put("/api/care/repair-log/:logId", careRepairRoutes.updateRepairLog);
  app.delete("/api/care/repair-log/:logId", careRepairRoutes.deleteRepairLog);
  app.get("/api/care/nearby-services", careRepairRoutes.getNearbyServices);
  app.get("/api/care/all-services", careRepairRoutes.getAllServices);
  app.post("/api/care/service-provider", careRepairRoutes.addServiceProvider);

  // Community/Style Circles routes
  app.get("/api/community/circles", communityRoutes.getCircles);
  app.get("/api/community/circles/:circleId", communityRoutes.getCircleById);
  app.get(
    "/api/community/circles/:circleId/feed",
    communityRoutes.getCircleFeed,
  );
  app.get("/api/community/feed", communityRoutes.getCommunityFeed);
  app.get("/api/community/badges", communityRoutes.getAvailableBadges);
  app.get(
    "/api/community/users/:userId/badges",
    communityRoutes.getUserBadgesHandler,
  );

  // Moodboard routes
  app.post("/api/moodboards", moodboardRoutes.createMoodboard);
  app.get("/api/moodboards/user/:userId", moodboardRoutes.getUserMoodboards);
  app.get("/api/moodboards/:moodboardId", moodboardRoutes.getMoodboard);
  app.put("/api/moodboards/:moodboardId", moodboardRoutes.updateMoodboard);
  app.delete("/api/moodboards/:moodboardId", moodboardRoutes.deleteMoodboard);
  app.get("/api/moodboards", moodboardRoutes.getPublicMoodboards);
  app.put("/api/moodboards/:moodboardId/like", moodboardRoutes.likeMoodboard);
  app.post("/api/moodboards/generate", moodboardRoutes.generateMoodboardSuggestions);

  // Capsule routes
  app.post("/api/capsules", capsuleRoutes.createCapsule);
  app.get("/api/capsules/user/:userId", capsuleRoutes.getUserCapsules);
  app.get("/api/capsules/:capsuleId", capsuleRoutes.getCapsule);
  app.put("/api/capsules/:capsuleId", capsuleRoutes.updateCapsule);
  app.delete("/api/capsules/:capsuleId", capsuleRoutes.deleteCapsule);
  app.get("/api/capsules", capsuleRoutes.getPublicCapsules);
  app.put("/api/capsules/:capsuleId/like", capsuleRoutes.likeCapsule);
  app.post("/api/capsules/generate", capsuleRoutes.generateCapsuleSuggestions);

  // Fabric analysis routes
  app.post("/api/fabric-analyses", fabricAnalysisRoutes.createFabricAnalysis);
  app.get("/api/fabric-analyses/user/:userId", fabricAnalysisRoutes.getUserFabricAnalyses);
  app.get("/api/fabric-analyses/:analysisId", fabricAnalysisRoutes.getFabricAnalysis);
  app.put("/api/fabric-analyses/:analysisId", fabricAnalysisRoutes.updateFabricAnalysis);
  app.delete("/api/fabric-analyses/:analysisId", fabricAnalysisRoutes.deleteFabricAnalysis);
  app.post("/api/fabric-analyses/analyze", fabricAnalysisRoutes.analyzeFabric);

  // Style Circle routes
  app.post("/api/style-circles", styleCircleRoutes.createStyleCircle);
  app.get("/api/style-circles", styleCircleRoutes.getAllStyleCircles);
  app.get("/api/style-circles/:circleId", styleCircleRoutes.getStyleCircle);
  app.put("/api/style-circles/:circleId", styleCircleRoutes.updateStyleCircle);
  app.delete("/api/style-circles/:circleId", styleCircleRoutes.deleteStyleCircle);
  app.post("/api/style-circles/:circleId/join", styleCircleRoutes.joinStyleCircle);
  app.post("/api/style-circles/:circleId/leave", styleCircleRoutes.leaveStyleCircle);
  app.post("/api/style-circles/:circleId/posts", styleCircleRoutes.createCirclePost);
  app.get("/api/style-circles/:circleId/posts", styleCircleRoutes.getCirclePosts);
  app.put("/api/style-circles/:circleId/posts/:postId/like", styleCircleRoutes.likeCirclePost);

  // AI Service routes
  app.post("/api/ai/chat", aiRoutes.chatWithAI);
  app.post("/api/ai/outfit-suggestion", aiRoutes.getOutfitSuggestion);
  app.post("/api/ai/style-advice", aiRoutes.getStyleAdvice);
  app.post("/api/ai/fabric-analysis", aiRoutes.analyzeFabricComposition);
  app.post("/api/ai/sustainability-tips", aiRoutes.getSustainabilityTips);
  app.post("/api/ai/weather-outfit", aiRoutes.getWeatherBasedOutfit);
  app.post("/api/ai/event-styling", aiRoutes.getEventBasedStyling);
  app.get("/api/ai/weather-forecast", aiRoutes.getWeatherForecast);
  app.get("/api/ai/calendar-styling", aiRoutes.getCalendarStyling);
  app.get("/api/ai/test-providers", aiRoutes.testAIProviders);

  return app;
}