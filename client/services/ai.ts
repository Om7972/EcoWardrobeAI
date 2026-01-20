import apiClient from "@/lib/axios";

const API_BASE_URL = "/ai";

export interface AIMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export type AIProvider = "gemini" | "openai" | "groq" | "anthropic";

export interface AIServiceOptions {
  provider?: AIProvider;
}

export const aiService = {
  async chat(messages: AIMessage[], options?: AIServiceOptions): Promise<string> {
    try {
      const response = await apiClient.post(`${API_BASE_URL}/chat`, { 
        messages,
        provider: options?.provider
      });
      return response.data.response;
    } catch (error: any) {
      console.error("AI Chat Error:", error);
      throw new Error(error.response?.data?.error || "Failed to get AI response");
    }
  },

  async getOutfitSuggestion(
    occasion: string,
    weather: string,
    style: string,
    items: string[],
    options?: AIServiceOptions
  ): Promise<string> {
    try {
      const response = await apiClient.post(`${API_BASE_URL}/outfit-suggestion`, {
        occasion,
        weather,
        style,
        items,
        provider: options?.provider
      });
      return response.data.suggestion;
    } catch (error: any) {
      console.error("Outfit Suggestion Error:", error);
      throw new Error(error.response?.data?.error || "Failed to get outfit suggestion");
    }
  },

  async getStyleAdvice(query: string, context?: string, options?: AIServiceOptions): Promise<string> {
    try {
      const response = await apiClient.post(`${API_BASE_URL}/style-advice`, {
        query,
        context,
        provider: options?.provider
      });
      return response.data.advice;
    } catch (error: any) {
      console.error("Style Advice Error:", error);
      throw new Error(error.response?.data?.error || "Failed to get style advice");
    }
  },

  async analyzeFabric(fabricDescription: string, imageData?: string, options?: AIServiceOptions): Promise<string> {
    try {
      const response = await apiClient.post(`${API_BASE_URL}/fabric-analysis`, {
        fabricDescription,
        imageData,
        provider: options?.provider
      });
      return response.data.analysis;
    } catch (error: any) {
      console.error("Fabric Analysis Error:", error);
      throw new Error(error.response?.data?.error || "Failed to analyze fabric");
    }
  },

  async getSustainabilityTips(userProfile: any, options?: AIServiceOptions): Promise<string> {
    try {
      const response = await apiClient.post(`${API_BASE_URL}/sustainability-tips`, {
        userProfile,
        provider: options?.provider
      });
      return response.data.tips;
    } catch (error: any) {
      console.error("Sustainability Tips Error:", error);
      throw new Error(error.response?.data?.error || "Failed to get sustainability tips");
    }
  },

  // New weather-based outfit suggestions
  async getWeatherBasedOutfit(
    location: string,
    userPreferences?: any,
    options?: AIServiceOptions
  ): Promise<{ outfit: string; weather: any; recommendations: string[] }> {
    try {
      const response = await apiClient.post(`${API_BASE_URL}/weather-outfit`, {
        location,
        userPreferences,
        provider: options?.provider
      });
      return response.data;
    } catch (error: any) {
      console.error("Weather-based Outfit Error:", error);
      throw new Error(error.response?.data?.error || "Failed to get weather-based outfit");
    }
  },

  // New event-based styling
  async getEventBasedStyling(
    eventDetails: any,
    userWardrobe?: any,
    options?: AIServiceOptions
  ): Promise<string> {
    try {
      const response = await apiClient.post(`${API_BASE_URL}/event-styling`, {
        eventDetails,
        userWardrobe,
        provider: options?.provider
      });
      return response.data.styling;
    } catch (error: any) {
      console.error("Event-based Styling Error:", error);
      throw new Error(error.response?.data?.error || "Failed to get event-based styling");
    }
  },

  // Get weather forecast
  async getWeatherForecast(location: string): Promise<any> {
    try {
      const response = await apiClient.get(`${API_BASE_URL}/weather-forecast`, {
        params: { location }
      });
      return response.data.forecast;
    } catch (error: any) {
      console.error("Weather Forecast Error:", error);
      throw new Error(error.response?.data?.error || "Failed to get weather forecast");
    }
  },

  // Get calendar styling suggestions
  async getCalendarStyling(calendarId?: string, days?: number): Promise<any> {
    try {
      const response = await apiClient.get(`${API_BASE_URL}/calendar-styling`, {
        params: { calendarId, days }
      });
      return response.data.suggestions;
    } catch (error: any) {
      console.error("Calendar Styling Error:", error);
      throw new Error(error.response?.data?.error || "Failed to get calendar styling suggestions");
    }
  },
};
