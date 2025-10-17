import { useMutation, useQuery } from "@tanstack/react-query";
import { useState } from "react";

const API_BASE = "/api";

// User API hooks
export function useGetOrCreateUser() {
  return useMutation({
    mutationFn: async (data: {
      userId: string;
      email?: string;
      name?: string;
    }) => {
      const res = await fetch(`${API_BASE}/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to get/create user");
      return res.json();
    },
  });
}

export function useGetUserProfile(userId: string) {
  return useQuery({
    queryKey: ["user", userId],
    queryFn: async () => {
      const res = await fetch(`${API_BASE}/users/${userId}`);
      if (!res.ok) throw new Error("Failed to fetch user");
      return res.json();
    },
    enabled: !!userId,
  });
}

// Clothing/Closet API hooks
export function useUploadClothingItem() {
  return useMutation({
    mutationFn: async (data: {
      userId: string;
      title: string;
      category: string;
      color?: string[];
      brand?: string;
      material?: string[];
      description?: string;
      imageUrl?: string;
    }) => {
      const res = await fetch(`${API_BASE}/clothing`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to upload item");
      return res.json();
    },
  });
}

export function useGetUserCloset(userId: string) {
  return useQuery({
    queryKey: ["closet", userId],
    queryFn: async () => {
      const res = await fetch(`${API_BASE}/clothing/user/${userId}`);
      if (!res.ok) throw new Error("Failed to fetch closet");
      return res.json();
    },
    enabled: !!userId,
  });
}

export function useGetClothingItem(itemId: string) {
  return useQuery({
    queryKey: ["clothing", itemId],
    queryFn: async () => {
      const res = await fetch(`${API_BASE}/clothing/${itemId}`);
      if (!res.ok) throw new Error("Failed to fetch item");
      return res.json();
    },
    enabled: !!itemId,
  });
}

export function useDeleteClothingItem() {
  return useMutation({
    mutationFn: async (itemId: string) => {
      const res = await fetch(`${API_BASE}/clothing/${itemId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete item");
      return res.json();
    },
  });
}

export function useGetEcoScore(itemId: string) {
  return useQuery({
    queryKey: ["ecoScore", itemId],
    queryFn: async () => {
      const res = await fetch(`${API_BASE}/clothing/${itemId}/eco-score`);
      if (!res.ok) throw new Error("Failed to fetch eco score");
      return res.json();
    },
    enabled: !!itemId,
  });
}

// Outfit generation API hooks
export function useGenerateOutfit() {
  return useMutation({
    mutationFn: async (data: {
      userId: string;
      occasion: "casual" | "work" | "formal" | "party" | "weekend";
      weather?: string;
      stylePreferences?: string[];
      lat?: number;
      lon?: number;
    }) => {
      const res = await fetch(`${API_BASE}/outfits/generate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to generate outfit");
      return res.json();
    },
  });
}

export function useGetUserOutfits(userId: string) {
  return useQuery({
    queryKey: ["outfits", userId],
    queryFn: async () => {
      const res = await fetch(`${API_BASE}/outfits/user/${userId}`);
      if (!res.ok) throw new Error("Failed to fetch outfits");
      return res.json();
    },
    enabled: !!userId,
  });
}

export function useToggleSaveOutfit() {
  return useMutation({
    mutationFn: async (outfitId: string) => {
      const res = await fetch(`${API_BASE}/outfits/${outfitId}/save`, {
        method: "PUT",
      });
      if (!res.ok) throw new Error("Failed to save outfit");
      return res.json();
    },
  });
}

export function useRateOutfit() {
  return useMutation({
    mutationFn: async (data: { outfitId: string; rating: number }) => {
      const res = await fetch(`${API_BASE}/outfits/${data.outfitId}/rate`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating: data.rating }),
      });
      if (!res.ok) throw new Error("Failed to rate outfit");
      return res.json();
    },
  });
}

// Impact tracking API hooks
export function useGetImpactMetrics(userId: string) {
  return useQuery({
    queryKey: ["impact", userId],
    queryFn: async () => {
      const res = await fetch(`${API_BASE}/impact/${userId}/metrics`);
      if (!res.ok) throw new Error("Failed to fetch impact metrics");
      return res.json();
    },
    enabled: !!userId,
  });
}

export function useGetImpactHistory(userId: string) {
  return useQuery({
    queryKey: ["impactHistory", userId],
    queryFn: async () => {
      const res = await fetch(`${API_BASE}/impact/${userId}/history`);
      if (!res.ok) throw new Error("Failed to fetch impact history");
      return res.json();
    },
    enabled: !!userId,
  });
}

export function useGetAchievements(userId: string) {
  return useQuery({
    queryKey: ["achievements", userId],
    queryFn: async () => {
      const res = await fetch(`${API_BASE}/impact/${userId}/achievements`);
      if (!res.ok) throw new Error("Failed to fetch achievements");
      return res.json();
    },
    enabled: !!userId,
  });
}

// Marketplace/Thrift Swap API hooks
export function useCreateSwapListing() {
  return useMutation({
    mutationFn: async (data: {
      userId: string;
      itemId: string;
      title: string;
      description?: string;
      condition: "like-new" | "excellent" | "good" | "fair";
      size?: string;
      brand?: string;
      category?: string;
      imageUrl: string;
      desiredItems?: string[];
    }) => {
      const res = await fetch(`${API_BASE}/marketplace/listings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to create listing");
      return res.json();
    },
  });
}

export function useGetAllListings() {
  return useQuery({
    queryKey: ["marketplace-listings"],
    queryFn: async () => {
      const res = await fetch(`${API_BASE}/marketplace/listings`);
      if (!res.ok) throw new Error("Failed to fetch listings");
      return res.json();
    },
  });
}

export function useGetUserListings(userId: string) {
  return useQuery({
    queryKey: ["user-listings", userId],
    queryFn: async () => {
      const res = await fetch(`${API_BASE}/marketplace/user/${userId}/listings`);
      if (!res.ok) throw new Error("Failed to fetch listings");
      return res.json();
    },
    enabled: !!userId,
  });
}

export function useCreateSwapRequest() {
  return useMutation({
    mutationFn: async (data: {
      listingId: string;
      fromUserId: string;
      offeredItemId: string;
      desiredItemId: string;
      message?: string;
    }) => {
      const res = await fetch(`${API_BASE}/marketplace/requests`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to create swap request");
      return res.json();
    },
  });
}

export function useGetUserSwapRequests(userId: string) {
  return useQuery({
    queryKey: ["swap-requests", userId],
    queryFn: async () => {
      const res = await fetch(`${API_BASE}/marketplace/user/${userId}/requests`);
      if (!res.ok) throw new Error("Failed to fetch requests");
      return res.json();
    },
    enabled: !!userId,
  });
}

export function useAcceptSwapRequest() {
  return useMutation({
    mutationFn: async (requestId: string) => {
      const res = await fetch(
        `${API_BASE}/marketplace/requests/${requestId}/accept`,
        { method: "PUT" }
      );
      if (!res.ok) throw new Error("Failed to accept request");
      return res.json();
    },
  });
}

export function useRejectSwapRequest() {
  return useMutation({
    mutationFn: async (requestId: string) => {
      const res = await fetch(
        `${API_BASE}/marketplace/requests/${requestId}/reject`,
        { method: "PUT" }
      );
      if (!res.ok) throw new Error("Failed to reject request");
      return res.json();
    },
  });
}

export function useRateMarketplaceListing() {
  return useMutation({
    mutationFn: async (data: {
      listingId: string;
      rating: number;
      review?: string;
    }) => {
      const res = await fetch(
        `${API_BASE}/marketplace/listings/${data.listingId}/rate`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ rating: data.rating, review: data.review }),
        }
      );
      if (!res.ok) throw new Error("Failed to rate listing");
      return res.json();
    },
  });
}

// AI Style Coach API hooks
export function useGetDailySuggestions(date: "today" | "tomorrow" = "today") {
  return useQuery({
    queryKey: ["daily-suggestions", date],
    queryFn: async () => {
      const res = await fetch(`${API_BASE}/style-coach/daily-suggestions?date=${date}`);
      if (!res.ok) throw new Error("Failed to fetch suggestions");
      return res.json();
    },
  });
}

export function useGetOutfitAdvice() {
  return useMutation({
    mutationFn: async (data: {
      colorPalette: string[];
      stylePreferences: string[];
      occasion: string;
      bodyType?: string;
    }) => {
      const res = await fetch(`${API_BASE}/style-coach/outfit-advice`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to get outfit advice");
      return res.json();
    },
  });
}

export function useGetWeeklyInsights() {
  return useQuery({
    queryKey: ["weekly-insights"],
    queryFn: async () => {
      const res = await fetch(`${API_BASE}/style-coach/weekly-insights`);
      if (!res.ok) throw new Error("Failed to fetch insights");
      return res.json();
    },
  });
}

export function useGetSeasonalGuidance(season: "spring" | "summer" | "fall" | "winter") {
  return useQuery({
    queryKey: ["seasonal-guidance", season],
    queryFn: async () => {
      const res = await fetch(`${API_BASE}/style-coach/seasonal/${season}`);
      if (!res.ok) throw new Error("Failed to fetch guidance");
      return res.json();
    },
    enabled: !!season,
  });
}

export function useGetStyleTips() {
  return useQuery({
    queryKey: ["style-tips"],
    queryFn: async () => {
      const res = await fetch(`${API_BASE}/style-coach/tips`);
      if (!res.ok) throw new Error("Failed to fetch tips");
      return res.json();
    },
  });
}
