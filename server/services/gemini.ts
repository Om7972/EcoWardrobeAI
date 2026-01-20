import axios from "axios";

// Ensure dotenv is loaded
import dotenv from "dotenv";
dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
// Use v1 API with gemini-1.5-flash (stable and widely available)
// Fallback to gemini-pro if 1.5-flash doesn't work
const GEMINI_BASE_URL = "https://generativelanguage.googleapis.com/v1";
const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-1.5-flash";
const GEMINI_API_URL = `${GEMINI_BASE_URL}/models/${GEMINI_MODEL}:generateContent`;
const IS_GEMINI_CONFIGURED = Boolean(GEMINI_API_KEY);

export interface GeminiMessage {
  role: "user" | "model";
  parts: { text: string }[];
}

function buildDemoResponse(prompt: string): string {
  return [
    "EcoWardrobe AI is currently running in demo mode.",
    `Here's a helpful response to your request: "${prompt}"`,
    "",
    "Try focusing on versatile layers, eco-friendly fabrics, and mindful purchases.",
  ].join("\n");
}

export async function generateGeminiResponse(
  prompt: string,
  conversationHistory?: GeminiMessage[]
): Promise<string> {
  if (!IS_GEMINI_CONFIGURED) {
    console.warn("Gemini API key not configured. Returning fallback response.");
    return buildDemoResponse(prompt);
  }

  try {
    const contents = conversationHistory || [
      {
        role: "user",
        parts: [{ text: prompt }]
      }
    ];

    const response = await axios.post(
      `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
      {
        contents,
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    // Handle response structure
    if (response.data?.candidates?.[0]?.content?.parts?.[0]?.text) {
      return response.data.candidates[0].content.parts[0].text;
    }
    
    // If response structure is different, try alternative paths
    if (response.data?.text) {
      return response.data.text;
    }
    
    throw new Error("Unexpected response format from Gemini API");
  } catch (error: any) {
    console.error("Gemini API Error:", error.response?.data || error.message);
    
    // If model not found, try fallback to gemini-1.5-pro
    if (error.response?.status === 404 && GEMINI_MODEL !== "gemini-1.5-pro") {
      console.warn("Model not found, trying gemini-1.5-pro as fallback");
      try {
        const contents = conversationHistory || [
          {
            role: "user",
            parts: [{ text: prompt }]
          }
        ];
        
        const fallbackUrl = `${GEMINI_BASE_URL}/models/gemini-1.5-pro:generateContent?key=${GEMINI_API_KEY}`;
        const fallbackResponse = await axios.post(
          fallbackUrl,
          {
            contents,
            generationConfig: {
              temperature: 0.7,
              topK: 40,
              topP: 0.95,
              maxOutputTokens: 1024,
            },
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        
        if (fallbackResponse.data?.candidates?.[0]?.content?.parts?.[0]?.text) {
          return fallbackResponse.data.candidates[0].content.parts[0].text;
        }
      } catch (fallbackError) {
        console.error("Fallback model also failed:", fallbackError);
      }
    }
    
    console.warn("Falling back to demo response");
    return buildDemoResponse(prompt);
  }
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

export async function generateOutfitSuggestion(
  occasion: string,
  weather: string,
  style: string,
  items: string[]
): Promise<string> {
  if (!IS_GEMINI_CONFIGURED) {
    return buildOutfitSuggestionFallback(occasion, weather, style, items);
  }

  const prompt = `You are an expert fashion stylist specializing in sustainable fashion. Create an outfit suggestion for:

Occasion: ${occasion}
Weather: ${weather}
Style preference: ${style}
Available items: ${items.join(", ")}

Provide a detailed outfit combination with styling tips. Be creative and practical.`;

  try {
    return await generateGeminiResponse(prompt);
  } catch (error) {
    return buildOutfitSuggestionFallback(occasion, weather, style, items);
  }
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
    "Here's a quick sustainable style playbook:",
    contextLine,
    query ? `Focus area: ${query}` : undefined,
    "",
    ...advice,
  ]
    .filter(Boolean)
    .join("\n");
}

export async function generateStyleAdvice(
  userQuery: string,
  context?: string
): Promise<string> {
  if (!IS_GEMINI_CONFIGURED) {
    return buildStyleAdviceFallback(userQuery, context);
  }

  const prompt = context
    ? `You are a friendly AI fashion stylist focused on sustainable fashion. 

Context: ${context}

Question: ${userQuery}

Provide helpful, eco-conscious style advice.`
    : `You are a friendly AI fashion stylist focused on sustainable fashion. 

Question: ${userQuery}

Provide helpful, eco-conscious style advice.`;

  try {
    return await generateGeminiResponse(prompt);
  } catch (error) {
    return buildStyleAdviceFallback(userQuery, context);
  }
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

export async function analyzeFabric(
  fabricDescription: string
): Promise<string> {
  if (!IS_GEMINI_CONFIGURED) {
    return buildFabricAnalysisFallback(fabricDescription);
  }

  const prompt = `You are a textile expert. Analyze this fabric: ${fabricDescription}

Provide:
1. Likely fabric composition
2. Care instructions
3. Sustainability rating (1-10)
4. Environmental impact
5. Durability assessment`;

  try {
    return await generateGeminiResponse(prompt);
  } catch (error) {
    return buildFabricAnalysisFallback(fabricDescription);
  }
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

export async function generateSustainabilityTips(
  userProfile: any
): Promise<string> {
  if (!IS_GEMINI_CONFIGURED) {
    return buildSustainabilityTipsFallback(userProfile);
  }

  const prompt = `You are an eco-fashion expert. Generate 5 personalized sustainability tips for a user with this profile:
${JSON.stringify(userProfile, null, 2)}

Focus on practical, actionable advice.`;

  try {
    return await generateGeminiResponse(prompt);
  } catch (error) {
    return buildSustainabilityTipsFallback(userProfile);
  }
}

function buildDemoChatResponse(messages: Array<{ role: string; content: string }>): string {
  const userMessage = messages.find(msg => msg.role === "user")?.content || "";
  return [
    "EcoWardrobe AI is currently running in demo mode.",
    userMessage
      ? `Here is a helpful summary of your request: "${userMessage}"`
      : "Ask me anything about sustainable style and I will provide guidance.",
    "",
    "Try focusing on versatile layers, eco-friendly fabrics, and mindful purchases.",
  ].join("\n");
}

export async function chatWithGemini(
  messages: Array<{ role: string; content: string }>
): Promise<string> {
  if (!IS_GEMINI_CONFIGURED) {
    console.warn("Gemini API key not configured. Returning fallback response.");
    return buildDemoChatResponse(messages);
  }

  try {
    // Convert messages to Gemini format
    const geminiMessages: GeminiMessage[] = messages
      .filter(msg => msg.role !== "system")
      .map(msg => ({
        role: msg.role === "user" ? "user" : "model",
        parts: [{ text: msg.content }]
      }));

    // Add system message as first user message if exists
    const systemMessage = messages.find(msg => msg.role === "system");
    if (systemMessage && geminiMessages.length > 0) {
      geminiMessages[0].parts[0].text = `${systemMessage.content}\n\n${geminiMessages[0].parts[0].text}`;
    }

    const response = await axios.post(
      `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`,
      {
        contents: geminiMessages,
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    // Handle response structure
    if (response.data?.candidates?.[0]?.content?.parts?.[0]?.text) {
      return response.data.candidates[0].content.parts[0].text;
    }
    
    if (response.data?.text) {
      return response.data.text;
    }
    
    throw new Error("Unexpected response format from Gemini API");
  } catch (error: any) {
    console.error("Gemini API Error:", error.response?.data || error.message);
    
    // If model not found, try fallback to gemini-1.5-pro
    if (error.response?.status === 404 && GEMINI_MODEL !== "gemini-1.5-pro") {
      console.warn("Model not found, trying gemini-1.5-pro as fallback");
      try {
        // Convert messages to Gemini format for fallback
        const geminiMessages: GeminiMessage[] = messages
          .filter(msg => msg.role !== "system")
          .map(msg => ({
            role: msg.role === "user" ? "user" : "model",
            parts: [{ text: msg.content }]
          }));

        // Add system message as first user message if exists
        const systemMessage = messages.find(msg => msg.role === "system");
        if (systemMessage && geminiMessages.length > 0) {
          geminiMessages[0].parts[0].text = `${systemMessage.content}\n\n${geminiMessages[0].parts[0].text}`;
        }

        const fallbackUrl = `${GEMINI_BASE_URL}/models/gemini-1.5-pro:generateContent?key=${GEMINI_API_KEY}`;
        const fallbackResponse = await axios.post(
          fallbackUrl,
          {
            contents: geminiMessages,
            generationConfig: {
              temperature: 0.7,
              topK: 40,
              topP: 0.95,
              maxOutputTokens: 1024,
            },
          },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        
        if (fallbackResponse.data?.candidates?.[0]?.content?.parts?.[0]?.text) {
          return fallbackResponse.data.candidates[0].content.parts[0].text;
        }
      } catch (fallbackError) {
        console.error("Fallback model also failed:", fallbackError);
      }
    }
    
    console.warn("Falling back to demo response");
    return buildDemoChatResponse(messages);
  }
}
