import mongoose from "mongoose";

interface IMoodboardItem {
  clothingItemId: string;
  position: {
    x: number;
    y: number;
  };
  rotation: number;
  scale: number;
}

interface IMoodboard {
  userId: string;
  title: string;
  mood: string;
  description: string;
  items: IMoodboardItem[];
  tags: string[];
  isPublic: boolean;
  likes: number;
  createdAt: Date;
  updatedAt: Date;
}

const moodboardItemSchema = new mongoose.Schema<IMoodboardItem>({
  clothingItemId: { type: String, required: true },
  position: {
    x: { type: Number, required: true },
    y: { type: Number, required: true }
  },
  rotation: { type: Number, default: 0 },
  scale: { type: Number, default: 1 }
});

const moodboardSchema = new mongoose.Schema<IMoodboard>(
  {
    userId: { type: String, required: true, index: true },
    title: { type: String, required: true },
    mood: { type: String, required: true },
    description: { type: String, default: "" },
    items: [moodboardItemSchema],
    tags: [{ type: String }],
    isPublic: { type: Boolean, default: false },
    likes: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const MoodboardModel = mongoose.model<IMoodboard>("Moodboard", moodboardSchema);

export { MoodboardModel as Moodboard };
export type { IMoodboard, IMoodboardItem };