import mongoose from "mongoose";

interface ICareInstruction {
  clothingItemId: string;
  fabricType: string;
  washingInstructions: string;
  dryingInstructions: string;
  ironingInstructions: string;
  specialCareNotes: string;
  createdAt: Date;
  updatedAt: Date;
}

const careInstructionSchema = new mongoose.Schema<ICareInstruction>(
  {
    clothingItemId: { type: String, required: true, index: true },
    fabricType: { type: String, required: true },
    washingInstructions: { type: String, required: true },
    dryingInstructions: { type: String, required: true },
    ironingInstructions: { type: String, required: true },
    specialCareNotes: { type: String, default: "" },
  },
  { timestamps: true }
);

// Use singleton pattern to prevent re-compilation during hot reload
let CareInstructionModel: mongoose.Model<ICareInstruction>;

try {
  CareInstructionModel = mongoose.model<ICareInstruction>("CareInstruction");
} catch {
  CareInstructionModel = mongoose.model<ICareInstruction>("CareInstruction", careInstructionSchema);
}

export { CareInstructionModel as CareInstruction };
export type { ICareInstruction };