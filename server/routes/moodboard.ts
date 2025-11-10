import { RequestHandler } from "express";
import { Moodboard } from "../models";

// Create a new moodboard
export const createMoodboard: RequestHandler = async (req, res) => {
  try {
    const { userId, title, mood, description, items, tags, isPublic } = req.body;
    
    const moodboard = new Moodboard({
      userId,
      title,
      mood,
      description: description || "",
      items: items || [],
      tags: tags || [],
      isPublic: isPublic || false,
      likes: 0,
    });
    
    await moodboard.save();
    
    res.status(201).json({
      success: true,
      data: moodboard,
    });
  } catch (error) {
    console.error("Create moodboard error:", error);
    res.status(500).json({ error: "Failed to create moodboard" });
  }
};

// Get all moodboards for a user
export const getUserMoodboards: RequestHandler = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const moodboards = await Moodboard.find({ userId })
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      data: moodboards,
    });
  } catch (error) {
    console.error("Fetch user moodboards error:", error);
    res.status(500).json({ error: "Failed to fetch moodboards" });
  }
};

// Get a specific moodboard by ID
export const getMoodboard: RequestHandler = async (req, res) => {
  try {
    const { moodboardId } = req.params;
    
    const moodboard = await Moodboard.findById(moodboardId);
    
    if (!moodboard) {
      return res.status(404).json({ error: "Moodboard not found" });
    }
    
    res.json({
      success: true,
      data: moodboard,
    });
  } catch (error) {
    console.error("Fetch moodboard error:", error);
    res.status(500).json({ error: "Failed to fetch moodboard" });
  }
};

// Update a moodboard
export const updateMoodboard: RequestHandler = async (req, res) => {
  try {
    const { moodboardId } = req.params;
    const updateData = req.body;
    
    const moodboard = await Moodboard.findByIdAndUpdate(
      moodboardId,
      updateData,
      { new: true }
    );
    
    if (!moodboard) {
      return res.status(404).json({ error: "Moodboard not found" });
    }
    
    res.json({
      success: true,
      data: moodboard,
    });
  } catch (error) {
    console.error("Update moodboard error:", error);
    res.status(500).json({ error: "Failed to update moodboard" });
  }
};

// Delete a moodboard
export const deleteMoodboard: RequestHandler = async (req, res) => {
  try {
    const { moodboardId } = req.params;
    
    const moodboard = await Moodboard.findByIdAndDelete(moodboardId);
    
    if (!moodboard) {
      return res.status(404).json({ error: "Moodboard not found" });
    }
    
    res.json({
      success: true,
      message: "Moodboard deleted successfully",
    });
  } catch (error) {
    console.error("Delete moodboard error:", error);
    res.status(500).json({ error: "Failed to delete moodboard" });
  }
};

// Get public moodboards
export const getPublicMoodboards: RequestHandler = async (req, res) => {
  try {
    const { mood, limit = "20" } = req.query;
    
    const filter: any = { isPublic: true };
    if (mood) filter.mood = mood;
    
    const moodboards = await Moodboard.find(filter)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit as string));
    
    res.json({
      success: true,
      data: moodboards,
    });
  } catch (error) {
    console.error("Fetch public moodboards error:", error);
    res.status(500).json({ error: "Failed to fetch public moodboards" });
  }
};

// Like a moodboard
export const likeMoodboard: RequestHandler = async (req, res) => {
  try {
    const { moodboardId } = req.params;
    
    const moodboard = await Moodboard.findByIdAndUpdate(
      moodboardId,
      { $inc: { likes: 1 } },
      { new: true }
    );
    
    if (!moodboard) {
      return res.status(404).json({ error: "Moodboard not found" });
    }
    
    res.json({
      success: true,
      data: { likes: moodboard.likes },
    });
  } catch (error) {
    console.error("Like moodboard error:", error);
    res.status(500).json({ error: "Failed to like moodboard" });
  }
};

// Generate AI-powered moodboard suggestions
export const generateMoodboardSuggestions: RequestHandler = async (req, res) => {
  try {
    const { userId, mood, closetItems } = req.body;
    
    // This would typically call an AI service to generate suggestions
    // For now, we'll return mock data
    const suggestions = [
      {
        title: `${mood.charAt(0).toUpperCase() + mood.slice(1)} Vibes`,
        items: closetItems.slice(0, Math.min(4, closetItems.length)),
        tags: [mood, "ai-generated"]
      },
      {
        title: `Perfect ${mood} Outfit`,
        items: closetItems.slice(Math.min(4, closetItems.length), Math.min(8, closetItems.length)),
        tags: [mood, "ai-recommended"]
      }
    ];
    
    res.json({
      success: true,
      data: suggestions,
    });
  } catch (error) {
    console.error("Generate moodboard suggestions error:", error);
    res.status(500).json({ error: "Failed to generate moodboard suggestions" });
  }
};