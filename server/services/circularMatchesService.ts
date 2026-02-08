// Mock user database for matching
const mockUsers: Record<string, { name: string; style: string[] }> = {
  "user-002": { name: "Emma", style: ["minimalist", "monochrome"] },
  "user-003": { name: "Sarah", style: ["bohemian", "earthy"] },
  "user-004": { name: "Maya", style: ["vintage", "retro"] },
  "user-005": { name: "Alex", style: ["sporty", "casual"] },
};

interface CircularMatch {
  id: string;
  garmentName: string;
  garmentImage: string;
  matchedUser: string;
  matchedUserId: string;
  matchScore: number;
  reason: string;
  sizeMatch: string;
  styleScore: number;
  condition: "like-new" | "excellent" | "good";
}

function calculateStyleMatch(userStyles: string[], targetStyles: string[]): number {
  const matches = userStyles.filter((style) =>
    targetStyles.some((s) => s.toLowerCase().includes(style.toLowerCase()))
  );
  return Math.round((matches.length / userStyles.length) * 100);
}

function generateMatchReason(styleScore: number): string {
  if (styleScore >= 80) {
    return "Excellent style compatibility! Your aesthetic aligns perfectly.";
  }
  if (styleScore >= 60) {
    return "Great match! Similar style preferences.";
  }
  return "Good potential match with complementary styles.";
}

export function generateCircularMatches(
  userStyles: string[]
): CircularMatch[] {
  const mockGarments: Array<{
    name: string;
    image: string;
    condition: "like-new" | "excellent" | "good";
    targetUserId: string;
  }> = [
    {
      name: "Vintage Denim Jacket",
      image: "https://via.placeholder.com/300?text=Denim+Jacket",
      condition: "excellent",
      targetUserId: "user-002",
    },
    {
      name: "Linen Summer Dress",
      image: "https://via.placeholder.com/300?text=Summer+Dress",
      condition: "like-new",
      targetUserId: "user-003",
    },
    {
      name: "Cashmere Sweater",
      image: "https://via.placeholder.com/300?text=Sweater",
      condition: "excellent",
      targetUserId: "user-004",
    },
    {
      name: "Athletic Leggings",
      image: "https://via.placeholder.com/300?text=Leggings",
      condition: "good",
      targetUserId: "user-005",
    },
    {
      name: "Silk Blouse",
      image: "https://via.placeholder.com/300?text=Silk+Blouse",
      condition: "excellent",
      targetUserId: "user-002",
    },
  ];

  return mockGarments.map((garment, index) => {
    const targetUser = mockUsers[garment.targetUserId];
    const styleScore = calculateStyleMatch(userStyles, targetUser.style);

    return {
      id: `match-${index + 1}`,
      garmentName: garment.name,
      garmentImage: garment.image,
      matchedUser: targetUser.name,
      matchedUserId: garment.targetUserId,
      matchScore: 60 + Math.floor(Math.random() * 40), // 60-100
      reason: generateMatchReason(styleScore),
      sizeMatch: ["XS-S", "M-L", "L-XL"][Math.floor(Math.random() * 3)],
      styleScore,
      condition: garment.condition,
    };
  });
}

export function getMatchDetails(matchId: string): CircularMatch | null {
  const matches = generateCircularMatches(["minimalist", "casual"]);
  return matches.find((m) => m.id === matchId) || null;
}
