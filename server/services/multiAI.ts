import axios from "axios";
import { chatWithGemini, GeminiMessage } from "./gemini";

// Ensure dotenv is loaded
import dotenv from "dotenv";
dotenv.config();

// API Configuration
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const GROQ_API_KEY = process.env.GROQ_API_KEY;
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// API URLs
const OPENAI_BASE_URL = "https://api.openai.com/v1";
const GROQ_BASE_URL = "https://api.groq.com/openai/v1";
const ANTHROPIC_BASE_URL = "https://api.anthropic.com/v1";

export type AIProvider = "gemini" | "openai" | "groq" | "anthropic";

export interface AIMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface AIServiceConfig {
  provider: AIProvider;
  fallbackProviders?: AIProvider[];
  temperature?: number;
  maxTokens?: number;
}

class MultiAIService {
  private defaultConfig: AIServiceConfig = {
    provider: "gemini",
    fallbackProviders: ["groq"],
    temperature: 0.7,
    maxTokens: 1024
  };

  private isProviderConfigured(provider: AIProvider): boolean {
    switch (provider) {
      case "gemini":
        return Boolean(GEMINI_API_KEY);
      case "openai":
        return Boolean(OPENAI_API_KEY);
      case "groq":
        return Boolean(GROQ_API_KEY);
      case "anthropic":
        return Boolean(ANTHROPIC_API_KEY);
      default:
        return false;
    }
  }

  private async callOpenAI(messages: AIMessage[], config: AIServiceConfig): Promise<string> {
    if (!OPENAI_API_KEY) {
      throw new Error("OpenAI API key not configured");
    }

    const response = await axios.post(
      `${OPENAI_BASE_URL}/chat/completions`,
      {
        model: "gpt-3.5-turbo",
        messages: messages.map(msg => ({
          role: msg.role,
          content: msg.content
        })),
        temperature: config.temperature || 0.7,
        max_tokens: config.maxTokens || 1024
      },
      {
        headers: {
          "Authorization": `Bearer ${OPENAI_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    return response.data.choices[0].message.content;
  }

  private async callGroq(messages: AIMessage[], config: AIServiceConfig): Promise<string> {
    if (!GROQ_API_KEY) {
      throw new Error("Groq API key not configured");
    }

    const response = await axios.post(
      `${GROQ_BASE_URL}/chat/completions`,
      {
        model: "llama-3.3-70b-versatile",
        messages: messages.map(msg => ({
          role: msg.role,
          content: msg.content
        })),
        temperature: config.temperature || 0.7,
        max_tokens: config.maxTokens || 1024
      },
      {
        headers: {
          "Authorization": `Bearer ${GROQ_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    return response.data.choices[0].message.content;
  }

  private async callAnthropic(messages: AIMessage[], config: AIServiceConfig): Promise<string> {
    if (!ANTHROPIC_API_KEY) {
      throw new Error("Anthropic API key not configured");
    }

    // Convert messages to Anthropic format
    const systemMessage = messages.find(msg => msg.role === "system");
    const conversationMessages = messages.filter(msg => msg.role !== "system");

    const response = await axios.post(
      `${ANTHROPIC_BASE_URL}/messages`,
      {
        model: "claude-3-haiku-20240307",
        max_tokens: config.maxTokens || 1024,
        system: systemMessage?.content || "You are a helpful AI assistant specializing in sustainable fashion.",
        messages: conversationMessages.map(msg => ({
          role: msg.role === "assistant" ? "assistant" : "user",
          content: msg.content
        }))
      },
      {
        headers: {
          "x-api-key": ANTHROPIC_API_KEY,
          "Content-Type": "application/json",
          "anthropic-version": "2023-06-01"
        }
      }
    );

    return response.data.content[0].text;
  }

  private async callGemini(messages: AIMessage[], config: AIServiceConfig): Promise<string> {
    // Convert to format expected by chatWithGemini
    const geminiCompatibleMessages = messages.map(msg => ({
      role: msg.role,
      content: msg.content
    }));

    return await chatWithGemini(geminiCompatibleMessages);
  }

  private async callProvider(provider: AIProvider, messages: AIMessage[], config: AIServiceConfig): Promise<string> {
    switch (provider) {
      case "gemini":
        return await this.callGemini(messages, config);
      case "openai":
        return await this.callOpenAI(messages, config);
      case "groq":
        return await this.callGroq(messages, config);
      case "anthropic":
        return await this.callAnthropic(messages, config);
      default:
        throw new Error(`Unsupported provider: ${provider}`);
    }
  }

  private buildFallbackResponse(messages: AIMessage[]): string {
    const userMessage = messages.find(msg => msg.role === "user")?.content || "";
    return [
      "EcoWardrobe AI is currently running in demo mode.",
      userMessage ? `Here's a helpful response to your request: "${userMessage}"` : "How can I help you with sustainable fashion today?",
      "",
      "Try focusing on versatile layers, eco-friendly fabrics, and mindful purchases."
    ].join("\n");
  }

  async chat(messages: AIMessage[], config?: Partial<AIServiceConfig>): Promise<string> {
    const finalConfig = { ...this.defaultConfig, ...config };
    const providersToTry = [finalConfig.provider, ...(finalConfig.fallbackProviders || [])];

    console.log(`🤖 Multi-AI Service: Starting chat with ${providersToTry.length} providers to try`);

    for (const provider of providersToTry) {
      if (!this.isProviderConfigured(provider)) {
        console.warn(`⚠️ Provider ${provider} not configured, skipping...`);
        continue;
      }

      try {
        console.log(`🔄 Attempting to use provider: ${provider}`);
        const response = await this.callProvider(provider, messages, finalConfig);
        console.log(`✅ Successfully got response from provider: ${provider}`);
        return response;
      } catch (error: any) {
        console.error(`❌ Provider ${provider} failed:`, error.message);
        
        // Check for specific quota/billing errors
        if (error.response?.data?.error?.code === "insufficient_quota" || 
            error.message?.includes("quota") || 
            error.message?.includes("billing")) {
          console.warn(`💳 Provider ${provider} has quota/billing issues, trying next provider...`);
          continue;
        }
        
        // Check for model not found errors
        if (error.response?.status === 404 || error.message?.includes("not found")) {
          console.warn(`🔍 Provider ${provider} model not found, trying next provider...`);
          continue;
        }
        
        // For other errors, also try next provider
        console.warn(`🔄 Provider ${provider} failed with error, trying next provider...`);
        continue;
      }
    }

    console.warn("⚠️ All AI providers failed, returning fallback response");
    return this.buildFallbackResponse(messages);
  }

  async generateOutfitSuggestion(
    occasion: string,
    weather: string,
    style: string,
    items: string[],
    config?: Partial<AIServiceConfig>
  ): Promise<string> {
    const prompt = `You are an expert fashion stylist specializing in sustainable fashion. Create an outfit suggestion for:

Occasion: ${occasion}
Weather: ${weather}
Style preference: ${style}
Available items: ${items.join(", ")}

Provide a detailed outfit combination with styling tips. Be creative and practical.`;

    const messages: AIMessage[] = [
      {
        role: "system",
        content: "You are a helpful AI fashion stylist specializing in sustainable fashion. Provide practical, eco-conscious advice."
      },
      {
        role: "user",
        content: prompt
      }
    ];

    return await this.chat(messages, config);
  }

  async generateStyleAdvice(
    userQuery: string,
    context?: string,
    config?: Partial<AIServiceConfig>
  ): Promise<string> {
    const prompt = context
      ? `You are a friendly AI fashion stylist focused on sustainable fashion. 

Context: ${context}

Question: ${userQuery}

Provide helpful, eco-conscious style advice.`
      : `You are a friendly AI fashion stylist focused on sustainable fashion. 

Question: ${userQuery}

Provide helpful, eco-conscious style advice.`;

    const messages: AIMessage[] = [
      {
        role: "system",
        content: "You are a helpful AI fashion stylist specializing in sustainable fashion. Provide practical, eco-conscious advice."
      },
      {
        role: "user",
        content: prompt
      }
    ];

    return await this.chat(messages, config);
  }

  async analyzeFabric(fabricDescription: string, config?: Partial<AIServiceConfig>): Promise<string> {
    const prompt = `You are a textile expert. Analyze this fabric: ${fabricDescription}

Provide:
1. Likely fabric composition
2. Care instructions
3. Sustainability rating (1-10)
4. Environmental impact
5. Durability assessment`;

    const messages: AIMessage[] = [
      {
        role: "system",
        content: "You are a textile expert specializing in sustainable fabrics and materials."
      },
      {
        role: "user",
        content: prompt
      }
    ];

    return await this.chat(messages, config);
  }

  async generateSustainabilityTips(
    userProfile: any,
    config?: Partial<AIServiceConfig>
  ): Promise<string> {
    const prompt = `You are an eco-fashion expert. Generate 5 personalized sustainability tips for a user with this profile:
${JSON.stringify(userProfile, null, 2)}

Focus on practical, actionable advice.`;

    const messages: AIMessage[] = [
      {
        role: "system",
        content: "You are an eco-fashion expert specializing in sustainable fashion practices."
      },
      {
        role: "user",
        content: prompt
      }
    ];

    return await this.chat(messages, config);
  }

  // Weather-based outfit suggestions
  async getWeatherBasedOutfit(
    location: string,
    weatherData: any,
    userPreferences: any,
    config?: Partial<AIServiceConfig>
  ): Promise<string> {
    const prompt = `Based on the weather data for ${location}, suggest an appropriate outfit:

Weather: ${JSON.stringify(weatherData, null, 2)}
User Preferences: ${JSON.stringify(userPreferences, null, 2)}

Provide practical outfit suggestions considering the weather conditions.`;

    const messages: AIMessage[] = [
      {
        role: "system",
        content: "You are a weather-aware fashion stylist who creates practical outfit suggestions based on weather conditions."
      },
      {
        role: "user",
        content: prompt
      }
    ];

    return await this.chat(messages, config);
  }

  // Event-based styling
  async getEventBasedStyling(
    eventDetails: any,
    userWardrobe: any,
    config?: Partial<AIServiceConfig>
  ): Promise<string> {
    const prompt = `Create outfit suggestions for this event:

Event Details: ${JSON.stringify(eventDetails, null, 2)}
Available Wardrobe: ${JSON.stringify(userWardrobe, null, 2)}

Provide appropriate styling suggestions for the event.`;

    const messages: AIMessage[] = [
      {
        role: "system",
        content: "You are an event styling expert who creates appropriate outfits for specific occasions."
      },
      {
        role: "user",
        content: prompt
      }
    ];

    return await this.chat(messages, config);
  }
}

export const multiAI = new MultiAIService();