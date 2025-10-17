import { RequestHandler } from "express";
import { ClothingItem } from "../models/index";
import { calculateEcoScore, getEcoCertifications, getEcoScoreDescription } from "../services/ecoScoreService";

// Upload clothing item
export const uploadClothingItem: RequestHandler = async (req, res) => {
  try {
    const { userId, title, category, color, brand, material, description } = req.body;

    if (!userId || !title || !category) {
      res.status(400).json({
        error: "Missing required fields: userId, title, category",
      });
      return;
    }

    // Mock image URL for demo (in production, use actual file upload)
    const imageUrl = req.body.imageUrl || `https://via.placeholder.com/300?text=${encodeURIComponent(title)}`;

    // Calculate eco score
    const ecoScoreData = calculateEcoScore({
      brand: brand || "unknown",
      materials: material || ["unknown"],
      usageFrequency: 50,
    });

    const item = new ClothingItem({
      userId,
      title,
      description,
      imageUrl,
      category,
      color: color || [],
      brand,
      material: material || [],
      ecoScore: ecoScoreData.score,
      sustainability: {
        rating: Math.ceil(ecoScoreData.score / 20),
        certifications: getEcoCertifications(brand || "", material || []),
        notes: getEcoScoreDescription(ecoScoreData.score),
      },
      usageFrequency: 50,
      tags: [category, ...(color || []), ...(material || [])],
    });

    await item.save();

    res.status(201).json({
      success: true,
      data: item,
    });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ error: "Failed to upload clothing item" });
  }
};

// Get user's closet
export const getUserCloset: RequestHandler = async (req, res) => {
  try {
    const { userId } = req.params;
    const { category, color, brand } = req.query;

    const query: Record<string, any> = { userId };

    if (category) query.category = category;
    if (color) query.color = { $in: [color] };
    if (brand) query.brand = brand;

    const items = await ClothingItem.find(query).sort({ uploadedAt: -1 });

    res.json({
      success: true,
      count: items.length,
      data: items,
    });
  } catch (error) {
    console.error("Fetch closet error:", error);
    res.status(500).json({ error: "Failed to fetch closet" });
  }
};

// Get single item
export const getClothingItem: RequestHandler = async (req, res) => {
  try {
    const { itemId } = req.params;

    const item = await ClothingItem.findById(itemId);

    if (!item) {
      res.status(404).json({ error: "Item not found" });
      return;
    }

    res.json({
      success: true,
      data: item,
    });
  } catch (error) {
    console.error("Fetch item error:", error);
    res.status(500).json({ error: "Failed to fetch item" });
  }
};

// Update clothing item
export const updateClothingItem: RequestHandler = async (req, res) => {
  try {
    const { itemId } = req.params;
    const updateData = req.body;

    const item = await ClothingItem.findByIdAndUpdate(itemId, updateData, {
      new: true,
    });

    if (!item) {
      res.status(404).json({ error: "Item not found" });
      return;
    }

    res.json({
      success: true,
      data: item,
    });
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ error: "Failed to update item" });
  }
};

// Delete clothing item
export const deleteClothingItem: RequestHandler = async (req, res) => {
  try {
    const { itemId } = req.params;

    const item = await ClothingItem.findByIdAndDelete(itemId);

    if (!item) {
      res.status(404).json({ error: "Item not found" });
      return;
    }

    res.json({
      success: true,
      message: "Item deleted successfully",
    });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ error: "Failed to delete item" });
  }
};

// Get eco score for item
export const getEcoScore: RequestHandler = async (req, res) => {
  try {
    const { itemId } = req.params;

    const item = await ClothingItem.findById(itemId);

    if (!item) {
      res.status(404).json({ error: "Item not found" });
      return;
    }

    res.json({
      success: true,
      data: {
        score: item.ecoScore,
        sustainability: item.sustainability,
        description: getEcoScoreDescription(item.ecoScore),
      },
    });
  } catch (error) {
    console.error("Eco score error:", error);
    res.status(500).json({ error: "Failed to fetch eco score" });
  }
};
