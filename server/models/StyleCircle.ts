import mongoose from "mongoose";

interface IStyleCircleMember {
  userId: string;
  role: "admin" | "moderator" | "member";
  joinedAt: Date;
}

interface IStyleCirclePost {
  userId: string;
  content: string;
  images: string[];
  likes: number;
  comments: number;
  createdAt: Date;
  updatedAt: Date;
}

interface IStyleCircle {
  name: string;
  description: string;
  category: string;
  members: IStyleCircleMember[];
  posts: IStyleCirclePost[];
  privacy: "public" | "private";
  tags: string[];
  memberCount: number;
  postCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const styleCircleMemberSchema = new mongoose.Schema<IStyleCircleMember>({
  userId: { type: String, required: true, index: true },
  role: { 
    type: String, 
    enum: ["admin", "moderator", "member"],
    default: "member"
  },
  joinedAt: { type: Date, default: Date.now }
});

const styleCirclePostSchema = new mongoose.Schema<IStyleCirclePost>({
  userId: { type: String, required: true, index: true },
  content: { type: String, required: true },
  images: [{ type: String }],
  likes: { type: Number, default: 0 },
  comments: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

const styleCircleSchema = new mongoose.Schema<IStyleCircle>(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    members: [styleCircleMemberSchema],
    posts: [styleCirclePostSchema],
    privacy: { 
      type: String, 
      enum: ["public", "private"],
      default: "public"
    },
    tags: [{ type: String }],
    memberCount: { type: Number, default: 0 },
    postCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Indexes for better query performance
styleCircleSchema.index({ category: 1 });
styleCircleSchema.index({ tags: 1 });
styleCircleSchema.index({ memberCount: -1 });
styleCircleSchema.index({ postCount: -1 });

const StyleCircleModel = mongoose.model<IStyleCircle>("StyleCircle", styleCircleSchema);

export { StyleCircleModel as StyleCircle };
export type { IStyleCircle, IStyleCircleMember, IStyleCirclePost };