import { RequestHandler } from "express";
import { Capsule } from "../models";

// Create a new capsule
export const createCapsule: RequestHandler = async (req, res) => {
  try {
    const { userId, title, description, purpose, items, startDate, endDate, isPublic } = req.body;
    
    const capsule = new Capsule({
      userId,
      title,
      description: description || "",
      purpose,
      items: items || [],
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      isPublic: isPublic || false,
      likes: 0,
    });
    
    await capsule.save();
    
    res.status(201).json({
      success: true,
      data: capsule,
    });
  } catch (error) {
    console.error("Create capsule error:", error);
    res.status(500).json({ error: "Failed to create capsule" });
  }
};

// Get all capsules for a user
export const getUserCapsules: RequestHandler = async (req, res) => {
  try {
    const { userId } = req.params;
    
    const capsules = await Capsule.find({ userId })
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      data: capsules,
    });
  } catch (error) {
    console.error("Fetch user capsules error:", error);
    res.status(500).json({ error: "Failed to fetch capsules" });
  }
};

// Get a specific capsule by ID
export const getCapsule: RequestHandler = async (req, res) => {
  try {
    const { capsuleId } = req.params;
    
    const capsule = await Capsule.findById(capsuleId);
    
    if (!capsule) {
      return res.status(404).json({ error: "Capsule not found" });
    }
    
    res.json({
      success: true,
      data: capsule,
    });
  } catch (error) {
    console.error("Fetch capsule error:", error);
    res.status(500).json({ error: "Failed to fetch capsule" });
  }
};

// Update a capsule
export const updateCapsule: RequestHandler = async (req, res) => {
  try {
    const { capsuleId } = req.params;
    const updateData = req.body;
    
    // Convert date strings to Date objects if present
    if (updateData.startDate) {
      updateData.startDate = new Date(updateData.startDate);
    }
    if (updateData.endDate) {
      updateData.endDate = new Date(updateData.endDate);
    }
    
    const capsule = await Capsule.findByIdAndUpdate(
      capsuleId,
      updateData,
      { new: true }
    );
    
    if (!capsule) {
      return res.status(404).json({ error: "Capsule not found" });
    }
    
    res.json({
      success: true,
      data: capsule,
    });
  } catch (error) {
    console.error("Update capsule error:", error);
    res.status(500).json({ error: "Failed to update capsule" });
  }
};

// Delete a capsule
export const deleteCapsule: RequestHandler = async (req, res) => {
  try {
    const { capsuleId } = req.params;
    
    const capsule = await Capsule.findByIdAndDelete(capsuleId);
    
    if (!capsule) {
      return res.status(404).json({ error: "Capsule not found" });
    }
    
    res.json({
      success: true,
      message: "Capsule deleted successfully",
    });
  } catch (error) {
    console.error("Delete capsule error:", error);
    res.status(500).json({ error: "Failed to delete capsule" });
  }
};

// Get public capsules
export const getPublicCapsules: RequestHandler = async (req, res) => {
  try {
    const { purpose, limit = "20" } = req.query;
    
    const filter: any = { isPublic: true };
    if (purpose) filter.purpose = purpose;
    
    const capsules = await Capsule.find(filter)
      .sort({ createdAt: -1 })
      .limit(parseInt(limit as string));
    
    res.json({
      success: true,
      data: capsules,
    });
  } catch (error) {
    console.error("Fetch public capsules error:", error);
    res.status(500).json({ error: "Failed to fetch public capsules" });
  }
};

// Like a capsule
export const likeCapsule: RequestHandler = async (req, res) => {
  try {
    const { capsuleId } = req.params;
    
    const capsule = await Capsule.findByIdAndUpdate(
      capsuleId,
      { $inc: { likes: 1 } },
      { new: true }
    );
    
    if (!capsule) {
      return res.status(404).json({ error: "Capsule not found" });
    }
    
    res.json({
      success: true,
      data: { likes: capsule.likes },
    });
  } catch (error) {
    console.error("Like capsule error:", error);
    res.status(500).json({ error: "Failed to like capsule" });
  }
};

// Generate AI-powered capsule suggestions
export const generateCapsuleSuggestions: RequestHandler = async (req, res) => {
  try {
    const { userId, purpose, closetItems, maxItems = 15 } = req.body;
    
    // This would typically call an AI service to generate suggestions
    // For now, we'll return mock data
    const suggestions = {
      title: `${purpose.charAt(0).toUpperCase() + purpose.slice(1)} Capsule Wardrobe`,
      items: closetItems
        .slice(0, Math.min(maxItems, closetItems.length))
        .map((item: any) => ({
          clothingItemId: item._id,
          category: item.category,
          isEssential: Math.random() > 0.5,
          notes: ""
        })),
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days from now
    };
    
    res.json({
      success: true,
      data: suggestions,
    });
  } catch (error) {
    console.error("Generate capsule suggestions error:", error);
    res.status(500).json({ error: "Failed to generate capsule suggestions" });
  }
};