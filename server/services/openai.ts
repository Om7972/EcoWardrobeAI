import axios from "axios";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";
const IS_OPENAI_CONFIGURED = Boolean(OPENAI_API_KEY);

export interface OpenAIMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

async function requestOpenAI(
  messages: OpenAIMessage[],
  temperature: number,
  maxTokens: number
): Promise<string> {
  const response = await axios.post(
    OPENAI_API_URL,
    {
      model: "gpt-3.5-turbo",
      messages,
      temperature,
      max_tokens: maxTokens,
    },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
    }
  );

  const content = response.data?.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error("OpenAI response missing content");
  }

  return content;
}

function getLatestUserMessage(messages: OpenAIMessage[]): string | undefined {
  for (let i = messages.length - 1; i >= 0; i -= 1) {
    if (messages[i].role === "user") {
      return messages[i].content;
    }
  }
  return undefined;
}

function buildDemoChatResponse(messages: OpenAIMessage[]): string {
  const userMessage = getLatestUserMessage(messages);
  return [
    "EcoWardrobe AI is currently running in demo mode.",
    userMessage
      ? `Here is a helpful summary of your request: "${userMessage}"`
      : "Ask me anything about sustainable style and I will provide guidance.",
    "",
    "Try focusing on versatile layers, eco-friendly fabrics, and mindful purchases.",
  ].join("\n");
}

function buildOutfitSuggestionFallback(
  occasion: string,
  weather: string,
  style: string,
  items: string[]
): string {
  const normalizedItems =
    items.length > 0
      ? items
      : [
          "a breathable top",
          "versatile bottoms",
          "comfortable footwear",
          "a purposeful accessory",
        ];

  const headline = `Demo outfit suggestion for a ${style.toLowerCase()} look at a ${occasion.toLowerCase()} occasion${
    weather ? ` in ${weather.toLowerCase()} weather` : ""
  }:`;

  const outfitDetails = [
    `- Anchor the look with ${normalizedItems[0]}.`,
    normalizedItems[1]
      ? `- Balance it with ${normalizedItems[1]} for structure.`
      : "- Choose neutral layers to keep the silhouette cohesive.",
    normalizedItems[2]
      ? `- Finish with ${normalizedItems[2]} to stay comfortable.`
      : "- Select footwear that matches both comfort and style.",
    normalizedItems[3]
      ? `- Add personality using ${normalizedItems[3]}.`
      : "- Introduce an accessory that reflects your personality.",
  ];

  const stylingTips = [
    "- Layer breathable fabrics so you can adapt to temperature changes.",
    "- Stick to a cohesive color palette with one accent tone.",
    "- Incorporate at least one sustainable or pre-loved piece.",
    "- Consider weather-appropriate outerwear that can be removed easily.",
  ];

  return [headline, "", "Main look:", ...outfitDetails, "", "Styling tips:", ...stylingTips].join(
    "\n"
  );
}

function buildStyleAdviceFallback(query: string, context?: string): string {
  const contextLine = context ? `Context considered: ${context}` : undefined;
  const advice = [
    "- Start with a strong base of quality essentials that fit well.",
    "- Introduce texture or pattern through a hero piece to add interest.",
    "- Keep accessories intentional; one bold item is often enough.",
    "- Align colors with your skin tone and existing wardrobe for versatility.",
    "- Prioritize comfort and confidence over trends.",
  ];

  return [
    "Here’s a quick sustainable style playbook:",
    contextLine,
    query ? `Focus area: ${query}` : undefined,
    "",
    ...advice,
  ]
    .filter(Boolean)
    .join("\n");
}

function buildFabricAnalysisFallback(fabricDescription: string): string {
  return [
    `Fabric analysis demo for: ${fabricDescription}`,
    "",
    "Likely composition:",
    "- Expect a blend of natural fibers (cotton, linen) with possible recycled synthetics for durability.",
    "",
    "Care guidance:",
    "- Wash on cold, gentle cycles and air dry when possible.",
    "- Store away from direct sunlight to preserve fiber strength.",
    "",
    "Sustainability snapshot:",
    "- Rating: 7/10 (prioritizes longevity and lower-impact care).",
    "- Recommend spot cleaning to extend garment life.",
  ].join("\n");
}

function buildSustainabilityTipsFallback(userProfile: any): string {
  return [
    "Personalized sustainability checklist (demo mode):",
    "",
    `- Audit your wardrobe and donate or swap pieces you no longer use${
      userProfile?.lifestyle ? ` (considering your ${userProfile.lifestyle} lifestyle)` : ""
    }.`,
    "- Prioritize natural or recycled fibers when making new purchases.",
    "- Rotate outfits seasonally to keep garments in use longer.",
    "- Maintain garments with mindful washing, mending, and proper storage.",
    "- Track your impact; small changes like air drying can save energy and extend garment life.",
  ].join("\n");
}

async function generateWithFallback(
  messages: OpenAIMessage[],
  temperature: number,
  maxTokens: number,
  fallback: () => string
): Promise<string> {
  if (!IS_OPENAI_CONFIGURED) {
    console.warn("OpenAI API key not configured. Returning fallback response.");
    return fallback();
  }

  try {
    return await requestOpenAI(messages, temperature, maxTokens);
  } catch (error: any) {
    console.error("OpenAI API Error:", error.response?.data || error.message);
    return fallback();
  }
}

export async function generateAIResponse(
  messages: OpenAIMessage[],
  temperature: number = 0.7,
  maxTokens: number = 500
): Promise<string> {
  return generateWithFallback(messages, temperature, maxTokens, () =>
    buildDemoChatResponse(messages)
  );
}

export async function generateOutfitSuggestion(
  occasion: string,
  weather: string,
  style: string,
  items: string[]
): Promise<string> {
  const messages: OpenAIMessage[] = [
    {
      role: "system",
      content:
        "You are an expert fashion stylist specializing in sustainable fashion. Provide creative, practical outfit suggestions.",
    },
    {
      role: "user",
      content: `Create an outfit suggestion for:
Occasion: ${occasion}
Weather: ${weather}
Style preference: ${style}
Available items: ${items.join(", ")}

Provide a detailed outfit combination with styling tips.`,
    },
  ];

  return generateWithFallback(messages, 0.8, 400, () =>
    buildOutfitSuggestionFallback(occasion, weather, style, items)
  );
}

export async function generateStyleAdvice(
  userQuery: string,
  context?: string
): Promise<string> {
  const messages: OpenAIMessage[] = [
    {
      role: "system",
      content:
        "You are a friendly AI fashion stylist focused on sustainable fashion. Provide helpful, eco-conscious style advice.",
    },
    {
      role: "user",
      content: context
        ? `Context: ${context}\n\nQuestion: ${userQuery}`
        : userQuery,
    },
  ];

  return generateWithFallback(messages, 0.7, 500, () =>
    buildStyleAdviceFallback(userQuery, context)
  );
}

export async function analyzeFabric(
  fabricDescription: string,
  imageData?: string
): Promise<string> {
  const messages: OpenAIMessage[] = [
    {
      role: "system",
      content:
        "You are a textile expert. Analyze fabric composition, care instructions, and sustainability impact.",
    },
    {
      role: "user",
      content: `Analyze this fabric: ${fabricDescription}
${imageData ? "Sample includes reference imagery for additional context.\n" : ""}
Provide:
1. Likely fabric composition
2. Care instructions
3. Sustainability rating (1-10)
4. Environmental impact
5. Durability assessment`,
    },
  ];

  return generateWithFallback(messages, 0.6, 600, () =>
    buildFabricAnalysisFallback(fabricDescription)
  );
}

export async function generateSustainabilityTips(
  userProfile: any
): Promise<string> {
  const messages: OpenAIMessage[] = [
    {
      role: "system",
      content:
        "You are an eco-fashion expert. Provide personalized sustainability tips for fashion choices.",
    },
    {
      role: "user",
      content: `Generate 5 personalized sustainability tips for a user with this profile:
${JSON.stringify(userProfile, null, 2)}

Focus on practical, actionable advice.`,
    },
  ];

  return generateWithFallback(messages, 0.7, 500, () =>
    buildSustainabilityTipsFallback(userProfile)
  );
}
