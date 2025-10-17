import { RequestHandler } from "express";
import { User } from "../models/index";

// Get or create user
export const getOrCreateUser: RequestHandler = async (req, res) => {
  try {
    const { userId, email, name } = req.body;

    if (!userId) {
      res.status(400).json({ error: "userId is required" });
      return;
    }

    let user = await User.findOne({ userId });

    if (!user) {
      user = new User({
        userId,
        email: email || `user_${userId}@ecowardrobe.local`,
        name: name || `User ${userId}`,
        profile: {
          stylePreferences: [],
          favoriteColors: [],
        },
        sustainability: {
          totalWaterSaved: 0,
          totalCO2Reduced: 0,
          totalGarmentsDonated: 0,
          cardsEarned: 0,
          points: 0,
        },
      });

      await user.save();
    }

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error("User creation error:", error);
    res.status(500).json({ error: "Failed to get/create user" });
  }
};

// Get user profile
export const getUserProfile: RequestHandler = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findOne({ userId });

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error("Fetch user error:", error);
    res.status(500).json({ error: "Failed to fetch user" });
  }
};

// Update user profile
export const updateUserProfile: RequestHandler = async (req, res) => {
  try {
    const { userId } = req.params;
    const updateData = req.body;

    const user = await User.findOneAndUpdate({ userId }, updateData, {
      new: true,
    });

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error("Update user error:", error);
    res.status(500).json({ error: "Failed to update user" });
  }
};

// Add style preferences
export const updateStylePreferences: RequestHandler = async (req, res) => {
  try {
    const { userId } = req.params;
    const { preferences } = req.body;

    const user = await User.findOneAndUpdate(
      { userId },
      { "profile.stylePreferences": preferences },
      { new: true }
    );

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error("Update preferences error:", error);
    res.status(500).json({ error: "Failed to update preferences" });
  }
};
