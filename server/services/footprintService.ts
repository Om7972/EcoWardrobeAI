// Material database with environmental footprints
const materialFootprints: Record<string, {
  waterUsage: number; // liters per kg
  microplasticRisk: "Low" | "Medium" | "High";
  durabilityScore: number; // 1-10
  carboonFootprint: number; // kg CO2 per kg
  notes: string;
}> = {
  "organic cotton": {
    waterUsage: 1800,
    microplasticRisk: "Low",
    durabilityScore: 8,
    carboonFootprint: 1.2,
    notes: "Sustainable choice with lower environmental impact",
  },
  cotton: {
    waterUsage: 2700,
    microplasticRisk: "Low",
    durabilityScore: 8,
    carboonFootprint: 2.1,
    notes: "Common but water-intensive to produce",
  },
  polyester: {
    waterUsage: 300,
    microplasticRisk: "High",
    durabilityScore: 7,
    carboonFootprint: 6.0,
    notes: "Sheds microplastics when washed, high carbon footprint",
  },
  nylon: {
    waterUsage: 500,
    microplasticRisk: "High",
    durabilityScore: 9,
    carboonFootprint: 7.5,
    notes: "Durable but high microplastic shedding",
  },
  wool: {
    waterUsage: 800,
    microplasticRisk: "Low",
    durabilityScore: 9,
    carboonFootprint: 10.0,
    notes: "Biodegradable and durable, but high carbon footprint from livestock",
  },
  linen: {
    waterUsage: 600,
    microplasticRisk: "Low",
    durabilityScore: 8,
    carboonFootprint: 0.7,
    notes: "Eco-friendly with low water and carbon footprint",
  },
  hemp: {
    waterUsage: 400,
    microplasticRisk: "Low",
    durabilityScore: 8,
    carboonFootprint: 0.3,
    notes: "Highly sustainable with minimal environmental impact",
  },
  silk: {
    waterUsage: 200,
    microplasticRisk: "Low",
    durabilityScore: 6,
    carboonFootprint: 8.0,
    notes: "Luxury material with moderate environmental impact",
  },
  "recycled polyester": {
    waterUsage: 100,
    microplasticRisk: "Medium",
    durabilityScore: 6,
    carboonFootprint: 2.0,
    notes: "Better than virgin polyester but still sheds some microplastics",
  },
  "tencel/lyocell": {
    waterUsage: 700,
    microplasticRisk: "Low",
    durabilityScore: 7,
    carboonFootprint: 1.5,
    notes: "Eco-friendly with closed-loop production",
  },
  acrylic: {
    waterUsage: 200,
    microplasticRisk: "High",
    durabilityScore: 5,
    carboonFootprint: 8.0,
    notes: "High microplastic shedding and non-biodegradable",
  },
  "synthetic leather": {
    waterUsage: 150,
    microplasticRisk: "High",
    durabilityScore: 4,
    carboonFootprint: 4.5,
    notes: "Petroleum-based, sheds microplastics",
  },
  leather: {
    waterUsage: 17000,
    microplasticRisk: "Low",
    durabilityScore: 10,
    carboonFootprint: 14.0,
    notes: "Extremely water-intensive but very durable",
  },
};

interface FootprintAnalysisResult {
  materials: {
    name: string;
    percentage: number;
    waterUsage: number;
    microplasticRisk: string;
    durabilityScore: number;
  }[];
  totalWaterUsage: number;
  overallMicroplasticRisk: "Low" | "Medium" | "High";
  averageDurabilityScore: number;
  analysis: string;
  recommendations: string[];
  carbonFootprint: number;
}

function parseMaterialComposition(composition: string): { material: string; percentage: number }[] {
  // Parse formats like "100% Cotton", "50% Cotton, 50% Polyester", etc.
  const parts = composition.split(",").map((part) => part.trim());

  return parts.map((part) => {
    const match = part.match(/^(\d+(?:\.\d+)?)\%?\s*(.+)$/i);
    if (match) {
      return {
        percentage: parseFloat(match[1]),
        material: match[2].toLowerCase().trim(),
      };
    }
    return { percentage: 100, material: part.toLowerCase().trim() };
  });
}

function getMaterialFootprint(materialName: string) {
  const normalizedName = materialName.toLowerCase().trim();
  return (
    materialFootprints[normalizedName] || {
      waterUsage: 2000,
      microplasticRisk: "Medium",
      durabilityScore: 6,
      carboonFootprint: 4.0,
      notes: "Material not in database",
    }
  );
}

function getRiskLevel(risks: ("Low" | "Medium" | "High")[]): "Low" | "Medium" | "High" {
  if (risks.includes("High")) return "High";
  if (risks.includes("Medium")) return "Medium";
  return "Low";
}

export function analyzeFootprint(
  materialComposition: string
): FootprintAnalysisResult {
  const parsedMaterials = parseMaterialComposition(materialComposition);

  const materialAnalysis = parsedMaterials.map((item) => {
    const footprint = getMaterialFootprint(item.material);
    return {
      name: item.material,
      percentage: item.percentage,
      waterUsage: Math.round((footprint.waterUsage * item.percentage) / 100),
      microplasticRisk: footprint.microplasticRisk,
      durabilityScore: footprint.durabilityScore,
      carbonFootprint: (footprint.carboonFootprint * item.percentage) / 100,
    };
  });

  const totalWaterUsage = materialAnalysis.reduce(
    (sum, m) => sum + m.waterUsage,
    0
  );
  const averageDurabilityScore =
    materialAnalysis.reduce((sum, m) => sum + m.durabilityScore, 0) /
    materialAnalysis.length;
  const carbonFootprint = materialAnalysis.reduce(
    (sum, m) => sum + m.carbonFootprint,
    0
  );
  const overallMicroplasticRisk = getRiskLevel(
    materialAnalysis.map((m) => m.microplasticRisk)
  );

  // Generate analysis
  const analysis = generateAnalysis(
    materialAnalysis,
    totalWaterUsage,
    overallMicroplasticRisk,
    averageDurabilityScore
  );

  const recommendations = generateRecommendations(
    materialAnalysis,
    overallMicroplasticRisk
  );

  return {
    materials: materialAnalysis.map((m) => ({
      name: m.name,
      percentage: m.percentage,
      waterUsage: m.waterUsage,
      microplasticRisk: m.microplasticRisk,
      durabilityScore: m.durabilityScore,
    })),
    totalWaterUsage,
    overallMicroplasticRisk,
    averageDurabilityScore: Math.round(averageDurabilityScore * 10) / 10,
    analysis,
    recommendations,
    carbonFootprint: Math.round(carbonFootprint * 100) / 100,
  };
}

function generateAnalysis(
  materials: any[],
  waterUsage: number,
  microplasticRisk: string,
  durability: number
): string {
  if (materials.some((m) => m.name.includes("organic")) || durability >= 8) {
    return "This garment is made from sustainable materials with good durability. Excellent choice for long-term wear!";
  }

  if (microplasticRisk === "High") {
    return "⚠️ This garment sheds microplastics when washed. Consider using a microplastic filter and washing less frequently.";
  }

  if (waterUsage > 5000) {
    return "💧 This garment is water-intensive to produce. Wear it multiple times to maximize the investment.";
  }

  return "This garment has moderate environmental impact. Extend its life through proper care and maintenance.";
}

function generateRecommendations(materials: any[], risk: string): string[] {
  const recommendations: string[] = [];

  if (risk === "High") {
    recommendations.push(
      "Use a microplastic filter (Guppyfriend) when washing in a machine"
    );
    recommendations.push("Wash less frequently in cold water");
    recommendations.push("Consider hand-washing to reduce microplastic shedding");
  }

  if (materials.some((m) => m.name.includes("cotton"))) {
    recommendations.push("Air dry when possible to extend fabric lifespan");
  }

  if (materials.some((m) => m.name.includes("wool"))) {
    recommendations.push("Hand wash or use wool-specific cycle");
    recommendations.push("Lay flat to dry to prevent stretching");
  }

  if (materials.some((m) => m.microplasticRisk === "Medium")) {
    recommendations.push("Wash with like colors to prevent dye transfer");
  }

  recommendations.push("Repair small damages promptly to extend lifespan");
  recommendations.push("Donate or swap when no longer needed");

  return recommendations.slice(0, 4);
}
