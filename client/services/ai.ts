import axios from "axios";

const API_BASE_URL = "/api/ai";

export interface AIMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export const aiService = {
  async chat(messages: AIMessage[]): Promise<string> {
    try {
      const response = await axios.post(`${API_BASE_URL}/chat`, { messages });
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
    items: string[]
  ): Promise<string> {
    try {
      const response = await axios.post(`${API_BASE_URL}/outfit-suggestion`, {
        occasion,
        weather,
        style,
        items,
      });
      return response.data.suggestion;
    } catch (error: any) {
      console.error("Outfit Suggestion Error:", error);
      throw new Error(error.response?.data?.error || "Failed to get outfit suggestion");
    }
  },

  async getStyleAdvice(query: string, context?: string): Promise<string> {
    try {
      const response = await axios.post(`${API_BASE_URL}/style-advice`, {
        query,
        context,
      });
      return response.data.advice;
    } catch (error: any) {
      console.error("Style Advice Error:", error);
      throw new Error(error.response?.data?.error || "Failed to get style advice");
    }
  },

  async analyzeFabric(fabricDescription: string, imageData?: string): Promise<string> {
    try {
      const response = await axios.post(`${API_BASE_URL}/fabric-analysis`, {
        fabricDescription,
        imageData,
      });
      return response.data.analysis;
    } catch (error: any) {
      console.error("Fabric Analysis Error:", error);
      throw new Error(error.response?.data?.error || "Failed to analyze fabric");
    }
  },

  async getSustainabilityTips(userProfile: any): Promise<string> {
    try {
      const response = await axios.post(`${API_BASE_URL}/sustainability-tips`, {
        userProfile,
      });
      return response.data.tips;
    } catch (error: any) {
      console.error("Sustainability Tips Error:", error);
      throw new Error(error.response?.data?.error || "Failed to get sustainability tips");
    }
  },
};
