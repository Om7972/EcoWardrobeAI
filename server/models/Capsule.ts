import mongoose from "mongoose";

interface ICapsuleItem {
  clothingItemId: string;
  category: string;
  isEssential: boolean;
  notes: string;
}

interface ICapsule {
  userId: string;
  title: string;
  description: string;
  purpose: "travel" | "seasonal" | "minimalist" | "professional" | "casual";
  items: ICapsuleItem[];
  startDate: Date;
  endDate: Date;
  isPublic: boolean;
  likes: number;
  createdAt: Date;
  updatedAt: Date;
}

const capsuleItemSchema = new mongoose.Schema<ICapsuleItem>({
  clothingItemId: { type: String, required: true },
  category: { type: String, required: true },
  isEssential: { type: Boolean, default: false },
  notes: { type: String, default: "" }
});

const capsuleSchema = new mongoose.Schema<ICapsule>(
  {
    userId: { type: String, required: true, index: true },
    title: { type: String, required: true },
    description: { type: String, default: "" },
    purpose: { 
      type: String, 
      enum: ["travel", "seasonal", "minimalist", "professional", "casual"],
      required: true 
    },
    items: [capsuleItemSchema],
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    isPublic: { type: Boolean, default: false },
    likes: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const CapsuleModel = mongoose.model<ICapsule>("Capsule", capsuleSchema);

export { CapsuleModel as Capsule };
export type { ICapsule, ICapsuleItem };