import mongoose from "mongoose";
import bcrypt from "bcrypt";

interface IUser {
  userId: string;
  email: string;
  name: string;
  password?: string;
  bio?: string;
  avatar?: string;
  phone?: string;
  location?: string;
  profile: {
    avatar?: string;
    bio?: string;
    stylePreferences: string[];
    bodyType?: string;
    favoriteColors: string[];
  };
  preferences?: {
    topSize?: string;
    bottomSize?: string;
    shoeSize?: string;
    preferredMaterials?: string[];
    avoidMaterials?: string[];
    favoriteColors?: string[];
    stylePreferences?: string[];
    sustainabilityGoals?: string[];
  };
  notifications?: {
    emailNotifications?: boolean;
    outfitSuggestions?: boolean;
    communityUpdates?: boolean;
    sustainabilityTips?: boolean;
    marketplaceAlerts?: boolean;
  };
  sustainability: {
    totalWaterSaved: number;
    totalCO2Reduced: number;
    totalGarmentsDonated: number;
    cardsEarned: number;
    points: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new mongoose.Schema<IUser>(
  {
    userId: { type: String, required: true, unique: true, index: true },
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    password: { type: String, required: false },
    bio: String,
    avatar: String,
    phone: String,
    location: String,
    profile: {
      avatar: String,
      bio: String,
      stylePreferences: [String],
      bodyType: String,
      favoriteColors: [String],
    },
    preferences: {
      topSize: String,
      bottomSize: String,
      shoeSize: String,
      preferredMaterials: [String],
      avoidMaterials: [String],
      favoriteColors: [String],
      stylePreferences: [String],
      sustainabilityGoals: [String],
    },
    notifications: {
      emailNotifications: { type: Boolean, default: true },
      outfitSuggestions: { type: Boolean, default: true },
      communityUpdates: { type: Boolean, default: true },
      sustainabilityTips: { type: Boolean, default: true },
      marketplaceAlerts: { type: Boolean, default: false },
    },
    sustainability: {
      totalWaterSaved: { type: Number, default: 0 },
      totalCO2Reduced: { type: Number, default: 0 },
      totalGarmentsDonated: { type: Number, default: 0 },
      cardsEarned: { type: Number, default: 0 },
      points: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  if (this.password) {
    this.password = await bcrypt.hash(this.password, 12);
  }
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword: string) {
  if (!this.password) return false;
  return bcrypt.compare(candidatePassword, this.password);
};

export const User =
  mongoose.models.User ||
  mongoose.model<IUser>("User", userSchema);

export type { IUser };