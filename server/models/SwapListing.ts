import mongoose from "mongoose";

interface ISwapListing {
  userId: string;
  itemId: string; // Reference to ClothingItem
  title: string;
  description: string;
  condition: "like-new" | "excellent" | "good" | "fair";
  size: string;
  brand: string;
  category: string;
  imageUrl: string;
  desiredItems: string[]; // What they're looking for
  wishlistItems: string[]; // Specific items they want
  status: "active" | "swapped" | "removed";
  swapRequests: mongoose.Schema.Types.ObjectId[];
  rating: number;
  reviews: string[];
  createdAt: Date;
  updatedAt: Date;
}

const swapListingSchema = new mongoose.Schema<ISwapListing>(
  {
    userId: { type: String, required: true, index: true },
    itemId: { type: String, required: true },
    title: { type: String, required: true },
    description: String,
    condition: {
      type: String,
      enum: ["like-new", "excellent", "good", "fair"],
      required: true,
    },
    size: String,
    brand: String,
    category: String,
    imageUrl: { type: String, required: true },
    desiredItems: [String],
    wishlistItems: [String],
    status: {
      type: String,
      enum: ["active", "swapped", "removed"],
      default: "active",
      index: true,
    },
    swapRequests: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SwapRequest",
      },
    ],
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviews: [String],
  },
  { timestamps: true }
);

export const SwapListing =
  mongoose.models.SwapListing ||
  mongoose.model<ISwapListing>("SwapListing", swapListingSchema);

export type { ISwapListing };
