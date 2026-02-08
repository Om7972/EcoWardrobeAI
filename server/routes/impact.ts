import { RequestHandler } from "express";
import { User, ClothingItem, Outfit } from "../models/index";
import { executeWithFallback } from "../config/database";

// Mock impact data for fallback
const mockImpactMetrics = {
  waterSaved: 5400, // liters
  co2Reduced: 50, // kg
  outfitsGenerated: 12,
  itemsCatalogued: 8,
  potentialWasteReduced: 400, // kg
  monthlyMetrics: {
    waterSaved: 450,
    co2Reduced: 4,
  },
};

const mockImpactHistory = [
  {
    date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
    waterSaved: 450,
    co2Reduced: 4,
    itemsAdded: 2,
    outfitsGenerated: 3
  },
  {
    date: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000), // 60 days ago
    waterSaved: 400,
    co2Reduced: 3,
    itemsAdded: 1,
    outfitsGenerated: 4
  }
];

const mockAchievements = [
  {
    id: "eco-warrior",
    title: "Eco Warrior",
    description: "Saved over 1000 liters of water",
    icon: "🌊",
    unlockedAt: new Date(),
    progress: 100
  },
  {
    id: "style-master",
    title: "Style Master", 
    description: "Generated 10+ sustainable outfits",
    icon: "👗",
    unlockedAt: new Date(),
    progress: 100
  },
  {
    id: "carbon-saver",
    title: "Carbon Saver",
    description: "Reduced CO2 emissions by 25kg+",
    icon: "🌱",
    unlockedAt: null,
    progress: 80
  }
];

// Calculate environmental metrics
export const calculateImpactMetrics: RequestHandler = async (req, res) => {
  try {
    const { userId } = req.params;

    const result = await executeWithFallback(
      async () => {
        const user = await (User.findOne as any)({ userId }).lean();
        const closetItems = await (ClothingItem.find as any)({ userId }).lean();
        const outfits = await (Outfit.find as any)({ userId }).lean();

        // Mock calculations based on items and outfits
        const waterSavedPerItem = 2700; // liters per year of extended use
        const co2PerItem = 25; // kg per year of extended use

        const totalWaterSaved = closetItems.length * waterSavedPerItem;
        const totalCO2Reduced = closetItems.length * co2PerItem;
        const totalOutfitsGenerated = outfits.length;

        const metrics = {
          waterSaved: totalWaterSaved,
          co2Reduced: totalCO2Reduced,
          outfitsGenerated: totalOutfitsGenerated,
          itemsCatalogued: closetItems.length,
          potentialWasteReduced: closetItems.length * 50, // kg
          monthlyMetrics: {
            waterSaved: Math.round(totalWaterSaved / 12),
            co2Reduced: Math.round(totalCO2Reduced / 12),
          },
        };

        // Update user sustainability stats
        if (user) {
          user.sustainability.totalWaterSaved = totalWaterSaved;
          user.sustainability.totalCO2Reduced = totalCO2Reduced;
          await user.save();
        }

        return metrics;
      },
      () => {
        // Fallback: return mock impact metrics
        return mockImpactMetrics;
      },
      "Calculate impact metrics"
    );

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Impact calculation error:", error);
    res.status(500).json({ error: "Failed to calculate impact" });
  }
};

// Get impact history
export const getImpactHistory: RequestHandler = async (req, res) => {
  try {
    const { userId } = req.params;

    const result = await executeWithFallback(
      async () => {
        const closetItems = await (ClothingItem.find as any)({ userId }).sort({
          uploadedAt: -1,
        }).lean();

        const history = closetItems.map((item) => ({
          date: item.uploadedAt,
          action: "Item Added",
          waterSaved: 2700,
          co2Reduced: 25,
          itemTitle: item.title,
        }));

        return history;
      },
      () => {
        // Fallback: return mock impact history
        return mockImpactHistory;
      },
      "Fetch impact history"
    );

    res.json({
      success: true,
      count: result.length,
      data: result,
    });
  } catch (error) {
    console.error("Impact history error:", error);
    res.status(500).json({ error: "Failed to fetch impact history" });
  }
};

// Get achievement badges
export const getAchievements: RequestHandler = async (req, res) => {
  try {
    const { userId } = req.params;

    const result = await executeWithFallback(
      async () => {
        const closetItems = await (ClothingItem.find as any)({ userId }).lean();
        const outfits = await (Outfit.find as any)({ userId }).lean();

        const achievements = [];

        if (closetItems.length >= 10) {
          achievements.push({
            id: "closet_10",
            title: "Wardrobe Builder",
            description: "Catalogued 10 items",
            icon: "👕",
          });
        }

        if (closetItems.length >= 50) {
          achievements.push({
            id: "closet_50",
            title: "Fashion Library",
            description: "Catalogued 50 items",
            icon: "📚",
          });
        }

        if (outfits.length >= 10) {
          achievements.push({
            id: "outfits_10",
            title: "Style Explorer",
            description: "Generated 10 outfits",
            icon: "✨",
          });
        }

        if (outfits.filter((o) => o.saved).length >= 5) {
          achievements.push({
            id: "saved_5",
            title: "Fashion Curator",
            description: "Saved 5 outfits",
            icon: "💾",
          });
        }

        const totalWaterSaved = closetItems.length * 2700;
        if (totalWaterSaved >= 27000) {
          achievements.push({
            id: "water_hero",
            title: "Water Conservationist",
            description: "Saved 27,000 liters of water",
            icon: "💧",
          });
        }

        return achievements;
      },
      () => {
        // Fallback: return mock achievements
        return mockAchievements;
      },
      "Fetch achievements"
    );

    res.json({
      success: true,
      count: result.length,
      data: result,
    });
  } catch (error) {
    console.error("Achievements error:", error);
    res.status(500).json({ error: "Failed to fetch achievements" });
  }
};
