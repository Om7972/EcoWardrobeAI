import { useState } from "react";
import { aiService, AIMessage, AIProvider, AIServiceOptions } from "@/services/ai";
import { toast } from "sonner";

export function useAI() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const chat = async (messages: AIMessage[], options?: AIServiceOptions): Promise<string | null> => {
    setLoading(true);
    setError(null);
    try {
      const response = await aiService.chat(messages, options);
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
    items: string[],
    options?: AIServiceOptions
  ): Promise<string | null> => {
    setLoading(true);
    setError(null);
    try {
      const suggestion = await aiService.getOutfitSuggestion(occasion, weather, style, items, options);
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

  const getStyleAdvice = async (query: string, context?: string, options?: AIServiceOptions): Promise<string | null> => {
    setLoading(true);
    setError(null);
    try {
      const advice = await aiService.getStyleAdvice(query, context, options);
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

  const analyzeFabric = async (fabricDescription: string, imageData?: string, options?: AIServiceOptions): Promise<string | null> => {
    setLoading(true);
    setError(null);
    try {
      const analysis = await aiService.analyzeFabric(fabricDescription, imageData, options);
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

  const getSustainabilityTips = async (userProfile: any, options?: AIServiceOptions): Promise<string | null> => {
    setLoading(true);
    setError(null);
    try {
      const tips = await aiService.getSustainabilityTips(userProfile, options);
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

  // New weather-based outfit suggestions
  const getWeatherBasedOutfit = async (
    location: string,
    userPreferences?: any,
    options?: AIServiceOptions
  ): Promise<{ outfit: string; weather: any; recommendations: string[] } | null> => {
    setLoading(true);
    setError(null);
    try {
      const result = await aiService.getWeatherBasedOutfit(location, userPreferences, options);
      toast.success("Weather-based outfit generated!");
      return result;
    } catch (err: any) {
      const errorMessage = err.message || "Failed to get weather-based outfit";
      setError(errorMessage);
      toast.error(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // New event-based styling
  const getEventBasedStyling = async (
    eventDetails: any,
    userWardrobe?: any,
    options?: AIServiceOptions
  ): Promise<string | null> => {
    setLoading(true);
    setError(null);
    try {
      const styling = await aiService.getEventBasedStyling(eventDetails, userWardrobe, options);
      toast.success("Event styling suggestions generated!");
      return styling;
    } catch (err: any) {
      const errorMessage = err.message || "Failed to get event styling";
      setError(errorMessage);
      toast.error(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Get weather forecast
  const getWeatherForecast = async (location: string): Promise<any | null> => {
    setLoading(true);
    setError(null);
    try {
      const forecast = await aiService.getWeatherForecast(location);
      return forecast;
    } catch (err: any) {
      const errorMessage = err.message || "Failed to get weather forecast";
      setError(errorMessage);
      toast.error(errorMessage);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Get calendar styling suggestions
  const getCalendarStyling = async (calendarId?: string, days?: number): Promise<any | null> => {
    setLoading(true);
    setError(null);
    try {
      const suggestions = await aiService.getCalendarStyling(calendarId, days);
      return suggestions;
    } catch (err: any) {
      const errorMessage = err.message || "Failed to get calendar styling";
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
    getWeatherBasedOutfit,
    getEventBasedStyling,
    getWeatherForecast,
    getCalendarStyling,
  };
}
