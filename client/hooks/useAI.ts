import { useState } from "react";
import { aiService, AIMessage } from "@/services/ai";
import { toast } from "sonner";

export function useAI() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const chat = async (messages: AIMessage[]): Promise<string | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await aiService.chat(messages);
      return response;
    } catch (err: any) {
      const errorMessage = err.message || "Failed to get AI response";
      setError(errorMessage);
      toast.error(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const getOutfitSuggestion = async (
    occasion: string,
    weather: string,
    style: string,
    items: string[]
  ): Promise<string | null> => {
    setLoading(true);
    setError(null);
    try {
      const suggestion = await aiService.getOutfitSuggestion(occasion, weather, style, items);
      toast.success("Outfit suggestion generated!");
      return suggestion;
    } catch (err: any) {
      const errorMessage = err.message || "Failed to get outfit suggestion";
      setError(errorMessage);
      toast.error(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const getStyleAdvice = async (query: string, context?: string): Promise<string | null> => {
    setLoading(true);
    setError(null);
    try {
      const advice = await aiService.getStyleAdvice(query, context);
      return advice;
    } catch (err: any) {
      const errorMessage = err.message || "Failed to get style advice";
      setError(errorMessage);
      toast.error(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const analyzeFabric = async (fabricDescription: string, imageData?: string): Promise<string | null> => {
    setLoading(true);
    setError(null);
    try {
      const analysis = await aiService.analyzeFabric(fabricDescription, imageData);
      toast.success("Fabric analysis complete!");
      return analysis;
    } catch (err: any) {
      const errorMessage = err.message || "Failed to analyze fabric";
      setError(errorMessage);
      toast.error(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const getSustainabilityTips = async (userProfile: any): Promise<string | null> => {
    setLoading(true);
    setError(null);
    try {
      const tips = await aiService.getSustainabilityTips(userProfile);
      toast.success("Sustainability tips generated!");
      return tips;
    } catch (err: any) {
      const errorMessage = err.message || "Failed to get sustainability tips";
      setError(errorMessage);
      toast.error(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    chat,
    getOutfitSuggestion,
    getStyleAdvice,
    analyzeFabric,
    getSustainabilityTips,
  };
}
