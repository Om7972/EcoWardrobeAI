import mongoose from "mongoose";

interface IRepairLog {
  userId: string;
  clothingItemId: string;
  repairType: "repair" | "alteration" | "upcycling";
  description: string;
  date: Date;
  cost: number;
  serviceProvider?: string;
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}

const repairLogSchema = new mongoose.Schema<IRepairLog>(
  {
    userId: { type: String, required: true, index: true },
    clothingItemId: { type: String, required: true, index: true },
    repairType: { 
      type: String, 
      enum: ["repair", "alteration", "upcycling"],
      required: true 
    },
    description: { type: String, required: true },
    date: { type: Date, required: true },
    cost: { type: Number, default: 0 },
    serviceProvider: { type: String, default: "" },
    notes: { type: String, default: "" },
  },
  { timestamps: true }
);

const RepairLogModel = mongoose.model<IRepairLog>("RepairLog", repairLogSchema);

export { RepairLogModel as RepairLog };
export type { IRepairLog };