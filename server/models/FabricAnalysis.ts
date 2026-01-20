import mongoose from "mongoose";

interface IFabricComponent {
  material: string;
  percentage: number;
  sustainabilityScore: number; // 0-100
  environmentalImpact: string; // "low" | "medium" | "high"
}

interface IFabricAnalysis {
  userId: string;
  clothingItemId?: string;
  imageUrl: string;
  fabricType: string;
  components: IFabricComponent[];
  sustainabilityScore: number; // Overall score 0-100
  recommendations: string[];
  createdAt: Date;
  updatedAt: Date;
}

const fabricComponentSchema = new mongoose.Schema<IFabricComponent>({
  material: { type: String, required: true },
  percentage: { type: Number, required: true, min: 0, max: 100 },
  sustainabilityScore: { type: Number, required: true, min: 0, max: 100 },
  environmentalImpact: { 
    type: String, 
    enum: ["low", "medium", "high"],
    required: true 
  }
});

const fabricAnalysisSchema = new mongoose.Schema<IFabricAnalysis>(
  {
    userId: { type: String, required: true, index: true },
    clothingItemId: { type: String, index: true },
    imageUrl: { type: String, required: true },
    fabricType: { type: String, required: true },
    components: [fabricComponentSchema],
    sustainabilityScore: { type: Number, required: true, min: 0, max: 100 },
    recommendations: [{ type: String }],
  },
  { timestamps: true }
);

// Use singleton pattern to prevent re-compilation during hot reload
let FabricAnalysisModel: mongoose.Model<IFabricAnalysis>;

try {
  FabricAnalysisModel = mongoose.model<IFabricAnalysis>("FabricAnalysis");
} catch {
  FabricAnalysisModel = mongoose.model<IFabricAnalysis>("FabricAnalysis", fabricAnalysisSchema);
}

export { FabricAnalysisModel as FabricAnalysis };
export type { IFabricAnalysis, IFabricComponent };