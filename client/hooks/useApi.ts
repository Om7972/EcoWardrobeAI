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
