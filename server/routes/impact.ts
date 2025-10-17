import { RequestHandler } from "express";
import { User, ClothingItem, Outfit } from "../models/index";

// Calculate environmental metrics
export const calculateImpactMetrics: RequestHandler = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findOne({ userId });
    const closetItems = await ClothingItem.find({ userId });
    const outfits = await Outfit.find({ userId });

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

    res.json({
      success: true,
      data: metrics,
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

    const closetItems = await ClothingItem.find({ userId }).sort({
      uploadedAt: -1,
    });

    const history = closetItems.map((item) => ({
      date: item.uploadedAt,
      action: "Item Added",
      waterSaved: 2700,
      co2Reduced: 25,
      itemTitle: item.title,
    }));

    res.json({
      success: true,
      count: history.length,
      data: history,
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

    const closetItems = await ClothingItem.find({ userId });
    const outfits = await Outfit.find({ userId });

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

    res.json({
      success: true,
      count: achievements.length,
      data: achievements,
    });
  } catch (error) {
    console.error("Achievements error:", error);
    res.status(500).json({ error: "Failed to fetch achievements" });
  }
};
