import { RequestHandler } from "express";
import { ClothingItem } from "../models/index";
import { executeWithFallback } from "../config/database";
import {
  calculateEcoScore,
  getEcoCertifications,
  getEcoScoreDescription,
} from "../services/ecoScoreService";

// Mock clothing data for fallback
const mockClothingItems = [
  {
    _id: "mock-item-1",
    userId: "demo-user",
    title: "Sustainable Cotton T-Shirt",
    description: "Comfortable organic cotton t-shirt",
    imageUrl: "https://via.placeholder.com/300?text=Cotton+T-Shirt",
    category: "tops",
    color: ["white"],
    brand: "EcoFashion",
    material: ["organic cotton"],
    ecoScore: 85,
    sustainability: {
      rating: 4,
      certifications: ["GOTS", "Fair Trade"],
      notes: "Excellent sustainability rating"
    },
    usageFrequency: 75,
    tags: ["tops", "white", "organic cotton"],
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    _id: "mock-item-2", 
    userId: "demo-user",
    title: "Recycled Denim Jeans",
    description: "Stylish jeans made from recycled materials",
    imageUrl: "https://via.placeholder.com/300?text=Denim+Jeans",
    category: "bottoms",
    color: ["blue"],
    brand: "GreenDenim",
    material: ["recycled cotton", "elastane"],
    ecoScore: 78,
    sustainability: {
      rating: 4,
      certifications: ["Cradle to Cradle"],
      notes: "Good sustainability with recycled materials"
    },
    usageFrequency: 60,
    tags: ["bottoms", "blue", "recycled cotton"],
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

// Upload clothing item
export const uploadClothingItem: RequestHandler = async (req, res) => {
  try {
    const {
      userId,
      title,
      category,
      color,
      brand,
      material,
      description,
      imageUrl,
    } = req.body;

    if (!userId || !title || !category) {
      res.status(400).json({
        error: "Missing required fields: userId, title, category",
      });
      return;
    }

    // Validate category
    const validCategories = [
      "tops",
      "bottoms",
      "dresses",
      "shoes",
      "accessories",
      "outerwear",
    ];
    if (!validCategories.includes(category)) {
      res.status(400).json({
        error: `Invalid category. Must be one of: ${validCategories.join(", ")}`,
      });
      return;
    }

    // Generate image URL
    const finalImageUrl =
      imageUrl ||
      `https://via.placeholder.com/300?text=${encodeURIComponent(title)}`;

    // Calculate eco score
    const ecoScoreData = calculateEcoScore({
      brand: brand || "unknown",
      materials: material || ["unknown"],
      usageFrequency: 50,
    });

    const item = new ClothingItem({
      userId,
      title: title.trim(),
      description: description?.trim() || "",
      imageUrl: finalImageUrl,
      category,
      color: Array.isArray(color) ? color : color ? [color] : [],
      brand: brand?.trim() || null,
      material: Array.isArray(material) ? material : material ? [material] : [],
      ecoScore: ecoScoreData.score,
      sustainability: {
        rating: Math.ceil(ecoScoreData.score / 20),
        certifications: getEcoCertifications(brand || "", material || []),
        notes: getEcoScoreDescription(ecoScoreData.score),
      },
      usageFrequency: 50,
      tags: [
        category,
        ...(Array.isArray(color) ? color : color ? [color] : []),
        ...(Array.isArray(material) ? material : material ? [material] : []),
      ],
    });

    await item.save();

    res.status(201).json({
      success: true,
      message: "Item added to closet successfully",
      data: item,
    });
  } catch (error: any) {
    console.error("Upload error:", error);

    // Handle specific validation errors
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors)
        .map((e: any) => e.message)
        .join(", ");
      res.status(400).json({ error: messages });
      return;
    }

    res.status(500).json({ error: "Failed to upload clothing item" });
  }
};

// Get user's closet
export const getUserCloset: RequestHandler = async (req, res) => {
  try {
    const { userId } = req.params;
    const { category, color, brand } = req.query;

    const result = await executeWithFallback(
      async () => {
        const query: Record<string, any> = { userId };

        if (category) query.category = category;
        if (color) query.color = { $in: [color] };
        if (brand) query.brand = brand;

        const items = await ClothingItem.find(query).sort({ uploadedAt: -1 });
        return items;
      },
      () => {
        // Fallback: return mock clothing items
        let filteredItems = mockClothingItems.filter(item => 
          item.userId === userId || item.userId === "demo-user"
        );

        // Apply filters
        if (category) {
          filteredItems = filteredItems.filter(item => item.category === category);
        }
        if (color) {
          filteredItems = filteredItems.filter(item => 
            item.color.includes(color as string)
          );
        }
        if (brand) {
          filteredItems = filteredItems.filter(item => item.brand === brand);
        }

        return filteredItems;
      },
      "Fetch user closet"
    );

    res.json({
      success: true,
      count: result.length,
      data: result,
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
