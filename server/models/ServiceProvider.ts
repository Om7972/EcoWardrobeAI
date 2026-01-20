import mongoose from "mongoose";

interface IServiceProvider {
  name: string;
  type: "tailor" | "cobbler" | "cleaner" | "other";
  address: string;
  latitude: number;
  longitude: number;
  phone?: string;
  website?: string;
  rating: number;
  reviews: number;
  specialties: string[];
  createdAt: Date;
  updatedAt: Date;
}

const serviceProviderSchema = new mongoose.Schema<IServiceProvider>(
  {
    name: { type: String, required: true },
    type: { 
      type: String, 
      enum: ["tailor", "cobbler", "cleaner", "other"],
      required: true 
    },
    address: { type: String, required: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    phone: { type: String },
    website: { type: String },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviews: { type: Number, default: 0 },
    specialties: [{ type: String }],
  },
  { timestamps: true }
);

// Use singleton pattern to prevent re-compilation during hot reload
let ServiceProviderModel: mongoose.Model<IServiceProvider>;

try {
  ServiceProviderModel = mongoose.model<IServiceProvider>("ServiceProvider");
} catch {
  ServiceProviderModel = mongoose.model<IServiceProvider>("ServiceProvider", serviceProviderSchema);
}

export { ServiceProviderModel as ServiceProvider };
export type { IServiceProvider };