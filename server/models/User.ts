import mongoose from "mongoose";

interface IUser {
  userId: string;
  email: string;
  name: string;
  profile: {
    avatar?: string;
    bio?: string;
    stylePreferences: string[];
    bodyType?: string;
    favoriteColors: string[];
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
    email: { type: String, required: true },
    name: { type: String, required: true },
    profile: {
      avatar: String,
      bio: String,
      stylePreferences: [String],
      bodyType: String,
      favoriteColors: [String],
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

export const User = mongoose.model<IUser>("User", userSchema);

export type { IUser };
