import mongoose from "mongoose";

interface ISwapRequest {
  fromUserId: string;
  toUserId: string;
  fromListingId: string;
  toListingId?: string;
  message: string;
  status: "pending" | "accepted" | "rejected" | "completed";
  createdAt: Date;
  updatedAt: Date;
}

const swapRequestSchema = new mongoose.Schema<ISwapRequest>(
  {
    fromUserId: { type: String, required: true, index: true },
    toUserId: { type: String, required: true, index: true },
    fromListingId: { type: String, required: true, index: true },
    toListingId: { type: String, index: true },
    message: { type: String, required: true },
    status: { 
      type: String, 
      enum: ["pending", "accepted", "rejected", "completed"],
      default: "pending"
    },
  },
  { timestamps: true }
);

const SwapRequestModel = mongoose.model<ISwapRequest>("SwapRequest", swapRequestSchema);

export { SwapRequestModel as SwapRequest };
export type { ISwapRequest };