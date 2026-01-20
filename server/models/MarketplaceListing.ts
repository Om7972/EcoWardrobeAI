import mongoose from "mongoose";

interface IMarketplaceListing {
  userId: string;
  clothingItemId: string;
  title: string;
  description: string;
  price: number;
  condition: "new" | "like-new" | "good" | "fair" | "poor";
  category: string;
  size: string;
  brand?: string;
  color?: string;
  material?: string;
  images: string[];
  listingType: "sale" | "swap" | "gift";
  status: "active" | "sold" | "swapped" | "gifted" | "inactive";
  ecoScore: number;
  views: number;
  likes: number;
  createdAt: Date;
  updatedAt: Date;
}

const marketplaceListingSchema = new mongoose.Schema<IMarketplaceListing>(
  {
    userId: { type: String, required: true, index: true },
    clothingItemId: { type: String, required: true, index: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    condition: { 
      type: String, 
      enum: ["new", "like-new", "good", "fair", "poor"],
      required: true 
    },
    category: { type: String, required: true },
    size: { type: String, required: true },
    brand: { type: String },
    color: { type: String },
    material: { type: String },
    images: [{ type: String }],
    listingType: { 
      type: String, 
      enum: ["sale", "swap", "gift"],
      required: true 
    },
    status: { 
      type: String, 
      enum: ["active", "sold", "swapped", "gifted", "inactive"],
      default: "active"
    },
    ecoScore: { type: Number, default: 0, min: 0, max: 100 },
    views: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Use singleton pattern to prevent re-compilation during hot reload
let MarketplaceListingModel: mongoose.Model<IMarketplaceListing>;

try {
  MarketplaceListingModel = mongoose.model<IMarketplaceListing>("MarketplaceListing");
} catch {
  MarketplaceListingModel = mongoose.model<IMarketplaceListing>("MarketplaceListing", marketplaceListingSchema);
}

export { MarketplaceListingModel as MarketplaceListing };
export type { IMarketplaceListing };