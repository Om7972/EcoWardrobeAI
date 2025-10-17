import mongoose from "mongoose";

interface ISwapRequest {
  listingId: string;
  fromUserId: string;
  toUserId: string;
  offeredItemId: string;
  desiredItemId: string;
  message?: string;
  status: "pending" | "accepted" | "rejected" | "completed";
  createdAt: Date;
  updatedAt: Date;
}

const swapRequestSchema = new mongoose.Schema<ISwapRequest>(
  {
    listingId: { type: String, required: true, index: true },
    fromUserId: { type: String, required: true, index: true },
    toUserId: { type: String, required: true, index: true },
    offeredItemId: { type: String, required: true },
    desiredItemId: { type: String, required: true },
    message: String,
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected", "completed"],
      default: "pending",
      index: true,
    },
  },
  { timestamps: true }
);

export const SwapRequest = mongoose.model<ISwapRequest>(
  "SwapRequest",
  swapRequestSchema
);

export type { ISwapRequest };
