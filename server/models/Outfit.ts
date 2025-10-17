import mongoose from "mongoose";

interface IOutfit {
  userId: string;
  title: string;
  description?: string;
  items: string[]; // Array of ClothingItem IDs
  occasion: "casual" | "work" | "formal" | "party" | "weekend";
  weather: string;
  imageUrl?: string;
  rating?: number; // 1-5
  saved: boolean;
  generatedAt: Date;
  aiSuggestion?: {
    explanation: string;
    confidence: number;
  };
}

const outfitSchema = new mongoose.Schema<IOutfit>(
  {
    userId: { type: String, required: true, index: true },
    title: { type: String, required: true },
    description: String,
    items: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "ClothingItem",
      },
    ],
    occasion: {
      type: String,
      enum: ["casual", "work", "formal", "party", "weekend"],
      required: true,
    },
    weather: String,
    imageUrl: String,
    rating: { type: Number, min: 1, max: 5 },
    saved: { type: Boolean, default: false },
    generatedAt: { type: Date, default: Date.now },
    aiSuggestion: {
      explanation: String,
      confidence: Number,
    },
  },
  { timestamps: true }
);

export const Outfit = mongoose.model<IOutfit>("Outfit", outfitSchema);

export type { IOutfit };
