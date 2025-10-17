const ANDORAITOOLS_API_KEY =
  process.env.ANDORAITOOLS_API_KEY ||
  "a622393171d24de5a8a9f7ce56d6016a_2066776b58024445baace2aad566c1a7_andoraitools";
const ANDORAITOOLS_API_URL = "https://api.andoraitools.com/v1/generate-outfit";

interface OutfitGenerationParams {
  occasion: "casual" | "work" | "formal" | "party" | "weekend";
  weather?: string;
  stylePreferences?: string[];
  items?: string[]; // Item IDs from user's closet
}

export async function generateOutfitWithAI(
  params: OutfitGenerationParams
): Promise<{
  outfitDescription: string;
  imageUrl?: string;
  suggestions: string[];
  confidence: number;
}> {
  try {
    const prompt = buildPrompt(params);

    const response = await fetch(ANDORAITOOLS_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${ANDORAITOOLS_API_KEY}`,
      },
      body: JSON.stringify({
        prompt,
        model: "outfit-generator-v1",
        style: "professional",
      }),
    });

    if (!response.ok) {
      throw new Error(
        `API Error: ${response.status} - ${response.statusText}`
      );
    }

    const data = await response.json();

    return {
      outfitDescription: data.description || generateMockOutfitDescription(params),
      imageUrl: data.imageUrl,
      suggestions: data.suggestions || generateMockSuggestions(params),
      confidence: data.confidence || 0.85,
    };
  } catch (error) {
    console.error("AI Service Error:", error);
    // Fallback to mock data
    return generateMockOutfitResponse(params);
  }
}

function buildPrompt(params: OutfitGenerationParams): string {
  return `Generate a ${params.occasion} outfit${
    params.weather ? ` suitable for ${params.weather} weather` : ""
  }. ${
    params.stylePreferences?.length
      ? `Style preferences: ${params.stylePreferences.join(", ")}.`
      : ""
  } Provide outfit description and styling tips.`;
}

function generateMockOutfitDescription(params: OutfitGenerationParams): string {
  const descriptions: Record<string, string> = {
    casual:
      "Pair your favorite jeans with a comfortable t-shirt and sneakers. Layer with a lightweight jacket for versatility.",
    work: "Combine a crisp white shirt with tailored trousers and a blazer. Add neutral shoes and minimal accessories.",
    formal:
      "Elegant evening look: Consider a dress or suit with dress shoes. Add a statement piece of jewelry for sophistication.",
    party:
      "Make a statement with bold colors or patterns. Pair with heels or dress shoes and a statement accessory.",
    weekend:
      "Relaxed and comfortable: Pair comfortable jeans or shorts with your favorite casual top and sneakers.",
  };

  return descriptions[params.occasion] || descriptions.casual;
}

function generateMockSuggestions(params: OutfitGenerationParams): string[] {
  return [
    "Consider the fabric weight for the current weather",
    "Mix textures for visual interest",
    "Keep accessories minimal for a cohesive look",
    "Ensure color harmony between pieces",
    "Prioritize comfort and confidence",
  ];
}

function generateMockOutfitResponse(
  params: OutfitGenerationParams
): ReturnType<typeof generateOutfitWithAI> {
  return Promise.resolve({
    outfitDescription: generateMockOutfitDescription(params),
    suggestions: generateMockSuggestions(params),
    confidence: 0.78,
  });
}
