// Mock sustainable brand database
const sustainableBrands: Record<string, number> = {
  "patagonia": 5,
  "everlane": 4,
  "reformation": 5,
  "allbirds": 4,
  "veja": 4,
  "armedangels": 4,
  "organic": 4,
  "organic basics": 5,
  "pangaia": 5,
  "boyish": 4,
  "nobody's child": 3,
  "asos": 2,
  "h&m": 1,
  "fast fashion": 1,
};

const materialScores: Record<string, number> = {
  "organic cotton": 5,
  "linen": 5,
  "hemp": 5,
  "recycled polyester": 4,
  "tencel": 4,
  "modal": 4,
  "cotton": 3,
  "wool": 4,
  "silk": 2,
  "polyester": 2,
  "nylon": 1,
  "acrylic": 1,
  "leather": 2,
  "faux leather": 2,
};

interface EcoScoreInput {
  brand?: string;
  materials: string[];
  usageFrequency: number; // 0-100
  age?: number; // years owned
}

export function calculateEcoScore(input: EcoScoreInput): {
  score: number;
  breakdown: {
    brandScore: number;
    materialScore: number;
    usageScore: number;
  };
} {
  // Brand score (30% weight)
  let brandScore = 2;
  if (input.brand) {
    const brandKey = input.brand.toLowerCase();
    brandScore = sustainableBrands[brandKey] || 2;
  }

  // Material score (40% weight)
  let totalMaterialScore = 0;
  if (input.materials.length > 0) {
    totalMaterialScore = input.materials.reduce((sum, material) => {
      const matKey = material.toLowerCase();
      return sum + (materialScores[matKey] || 2);
    }, 0);
    totalMaterialScore = totalMaterialScore / input.materials.length;
  } else {
    totalMaterialScore = 2;
  }

  // Usage score (30% weight) - higher usage frequency = higher score
  const usageScore = Math.min(5, (input.usageFrequency / 20) + 1);

  // Calculate weighted score
  const score = Math.round(
    (brandScore * 0.3 + totalMaterialScore * 0.4 + usageScore * 0.3) * 20
  );

  return {
    score: Math.min(100, Math.max(0, score)),
    breakdown: {
      brandScore: brandScore * 20,
      materialScore: totalMaterialScore * 20,
      usageScore: usageScore * 20,
    },
  };
}

export function getEcoScoreDescription(score: number): string {
  if (score >= 80) return "Excellent - Very sustainable choice!";
  if (score >= 60) return "Good - Decent sustainability";
  if (score >= 40) return "Fair - Consider more sustainable alternatives";
  return "Poor - Look for more eco-friendly options";
}

export function getEcoCertifications(brand: string, materials: string[]): string[] {
  const certs: string[] = [];

  const brandLower = brand.toLowerCase();
  if (
    ["patagonia", "reformation", "organic basics", "pangaia"].includes(brandLower)
  ) {
    certs.push("B-Corp Certified");
  }

  if (
    materials.some((m) =>
      ["organic cotton", "organic"].some((org) =>
        m.toLowerCase().includes(org)
      )
    )
  ) {
    certs.push("GOTS Certified");
  }

  if (materials.some((m) => m.toLowerCase().includes("recycled"))) {
    certs.push("Recycled Material");
  }

  return certs;
}
