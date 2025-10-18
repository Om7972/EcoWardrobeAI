import mongoose from "mongoose";

interface IClothingItem {
  userId: string;
  title: string;
  description?: string;
  imageUrl: string;
  category: "tops" | "bottoms" | "dresses" | "shoes" | "accessories" | "outerwear";
  color: string[];
  size?: string;
  brand?: string;
  material: string[];
  ecoScore: number;
  sustainability: {
    rating: number; // 1-5
    certifications: string[];
    notes: string;
  };
  usageFrequency: number; // 0-100
  purchaseDate?: Date;
  uploadedAt: Date;
  tags: string[];
}

const clothingItemSchema = new mongoose.Schema<IClothingItem>(
  {
    userId: { type: String, required: true, index: true },
    title: { type: String, required: true },
    description: String,
    imageUrl: { type: String, required: true },
    category: {
      type: String,
      enum: ["tops", "bottoms", "dresses", "shoes", "accessories", "outerwear"],
      required: true,
    },
    color: [String],
    size: String,
    brand: String,
    material: [String],
    ecoScore: { type: Number, default: 50, min: 0, max: 100 },
    sustainability: {
      rating: { type: Number, default: 3, min: 1, max: 5 },
      certifications: [String],
      notes: String,
    },
    usageFrequency: { type: Number, default: 50, min: 0, max: 100 },
    purchaseDate: Date,
    uploadedAt: { type: Date, default: Date.now },
    tags: [String],
  },
  { timestamps: true }
);

export const ClothingItem =
  mongoose.models.ClothingItem ||
  mongoose.model<IClothingItem>("ClothingItem", clothingItemSchema);

export type { IClothingItem };
