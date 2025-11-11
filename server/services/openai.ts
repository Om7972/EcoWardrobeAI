import axios from "axios";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";

export interface OpenAIMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export async function generateAIResponse(
  messages: OpenAIMessage[],
  temperature: number = 0.7,
  maxTokens: number = 500
): Promise<string> {
  try {
    if (!OPENAI_API_KEY) {
      throw new Error("OpenAI API key is not configured");
    }

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

    return response.data.choices[0].message.content;
  } catch (error: any) {
    console.error("OpenAI API Error:", error.response?.data || error.message);
    throw new Error("Failed to generate AI response");
  }
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

  return generateAIResponse(messages, 0.8, 400);
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

  return generateAIResponse(messages, 0.7, 500);
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
      
Provide:
1. Likely fabric composition
2. Care instructions
3. Sustainability rating (1-10)
4. Environmental impact
5. Durability assessment`,
    },
  ];

  return generateAIResponse(messages, 0.6, 600);
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

  return generateAIResponse(messages, 0.7, 500);
}
