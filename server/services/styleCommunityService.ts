interface StyleCircle {
  id: string;
  name: string;
  description: string;
  category: string;
  memberCount: number;
  image: string;
  eco_leaders: string[];
  badges: string[];
  createdAt: string;
}

interface CommunityPost {
  id: string;
  circleId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  image?: string;
  likes: number;
  comments: number;
  timestamp: string;
  type: "outfit" | "swap" | "discussion" | "challenge";
}

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  requirement: string;
  color: string;
}

const styleCircles: StyleCircle[] = [
  {
    id: "circle-1",
    name: "Minimalist Moms",
    description: "Simple, functional wardrobe for busy parents",
    category: "lifestyle",
    memberCount: 2345,
    image: "👩‍👧‍👦",
    eco_leaders: ["Sarah M.", "Jessica L."],
    badges: ["eco-champion", "style-setter"],
    createdAt: "2024-01-15",
  },
  {
    id: "circle-2",
    name: "Streetwear Swappers",
    description: "Urban style and sustainable swapping culture",
    category: "fashion",
    memberCount: 3421,
    image: "🎨",
    eco_leaders: ["Alex T.", "Marcus J."],
    badges: ["community-star", "trend-maker"],
    createdAt: "2024-02-20",
  },
  {
    id: "circle-3",
    name: "Vintage Lovers",
    description: "Celebrating timeless pieces and retro fashion",
    category: "style",
    memberCount: 1876,
    image: "🕰️",
    eco_leaders: ["Elena R.", "Thomas W."],
    badges: ["heritage-keeper", "style-expert"],
    createdAt: "2024-01-05",
  },
  {
    id: "circle-4",
    name: "Workwear Warriors",
    description: "Professional, sustainable office fashion",
    category: "professional",
    memberCount: 4562,
    image: "👔",
    eco_leaders: ["Catherine B.", "David K."],
    badges: ["professionalism-master", "eco-warrior"],
    createdAt: "2024-03-10",
  },
  {
    id: "circle-5",
    name: "Boho Wanderers",
    description: "Free-spirited fashion for adventurers",
    category: "lifestyle",
    memberCount: 2198,
    image: "🌸",
    eco_leaders: ["Luna G.", "Ocean M."],
    badges: ["wanderer-spirit", "nature-lover"],
    createdAt: "2024-02-01",
  },
  {
    id: "circle-6",
    name: "Sustainable Students",
    description: "Budget-friendly, eco-conscious fashion for students",
    category: "student",
    memberCount: 5678,
    image: "🎓",
    eco_leaders: ["Sophie C.", "Jake H."],
    badges: ["future-leader", "eco-pioneer"],
    createdAt: "2024-01-20",
  },
];

const badges: Badge[] = [
  {
    id: "eco-champion",
    name: "Eco Champion",
    description: "Achieved 90+ eco score",
    icon: "🏆",
    requirement: "90+ average eco score",
    color: "green",
  },
  {
    id: "style-setter",
    name: "Style Setter",
    description: "Created 50+ outfit combinations",
    icon: "✨",
    requirement: "50+ outfits created",
    color: "purple",
  },
  {
    id: "community-star",
    name: "Community Star",
    description: "500+ community interactions",
    icon: "⭐",
    requirement: "500+ posts/comments",
    color: "yellow",
  },
  {
    id: "trend-maker",
    name: "Trend Maker",
    description: "Trending post in community",
    icon: "🔥",
    requirement: "1000+ likes on a post",
    color: "orange",
  },
  {
    id: "swap-master",
    name: "Swap Master",
    description: "Completed 20+ swaps",
    icon: "🔄",
    requirement: "20+ successful swaps",
    color: "blue",
  },
  {
    id: "heritage-keeper",
    name: "Heritage Keeper",
    description: "Preserved vintage pieces",
    icon: "📚",
    requirement: "10+ vintage items preserved",
    color: "brown",
  },
  {
    id: "style-expert",
    name: "Style Expert",
    description: "Fashion advice given",
    icon: "👗",
    requirement: "50+ helpful comments",
    color: "pink",
  },
  {
    id: "professionalism-master",
    name: "Professionalism Master",
    description: "Perfect workwear combinations",
    icon: "💼",
    requirement: "30+ professional outfits",
    color: "darkblue",
  },
];

const mockPosts: CommunityPost[] = [
  {
    id: "post-1",
    circleId: "circle-1",
    userId: "user-1",
    userName: "Sarah M.",
    userAvatar: "👩",
    content:
      "Just created a 10-piece capsule wardrobe for this season! All sustainable materials and timeless pieces. Best decision ever! 🌿",
    image: "👕👖👗",
    likes: 234,
    comments: 45,
    timestamp: "2 hours ago",
    type: "outfit",
  },
  {
    id: "post-2",
    circleId: "circle-2",
    userId: "user-2",
    userName: "Alex T.",
    userAvatar: "👨",
    content:
      "Swapped my vintage Carhartt jacket for a perfect oversized blazer! Community is amazing 🎨",
    image: "🧥",
    likes: 567,
    comments: 89,
    timestamp: "5 hours ago",
    type: "swap",
  },
  {
    id: "post-3",
    circleId: "circle-4",
    userId: "user-3",
    userName: "Catherine B.",
    userAvatar: "👩‍💼",
    content:
      "Loving this sustainable professional style! Who else rocks eco-friendly workwear? Share your tips! 💼",
    image: "👔",
    likes: 156,
    comments: 32,
    timestamp: "8 hours ago",
    type: "discussion",
  },
  {
    id: "post-4",
    circleId: "circle-3",
    userId: "user-4",
    userName: "Elena R.",
    userAvatar: "👩‍🦰",
    content:
      "Found an incredible 1970s Chanel bag at a thrift store. Here's how I restored it ✨",
    image: "👜",
    likes: 892,
    comments: 156,
    timestamp: "1 day ago",
    type: "outfit",
  },
  {
    id: "post-5",
    circleId: "circle-5",
    userId: "user-5",
    userName: "Luna G.",
    userAvatar: "👩‍🎨",
    content:
      "New week challenge: Style one outfit using only boho pieces from your closet! Show us your creations 🌸",
    image: "🌺",
    likes: 445,
    comments: 78,
    timestamp: "12 hours ago",
    type: "challenge",
  },
];

export function getStyleCircles(): StyleCircle[] {
  return styleCircles;
}

export function getStyleCircleById(id: string): StyleCircle | undefined {
  return styleCircles.find((circle) => circle.id === id);
}

export function getCirclePosts(circleId: string): CommunityPost[] {
  return mockPosts.filter((post) => post.circleId === circleId);
}

export function getAllPosts(): CommunityPost[] {
  return mockPosts;
}

export function getBadges(): Badge[] {
  return badges;
}

export function getUserBadges(userId: string): Badge[] {
  // Mock: return some random badges
  return badges.slice(0, Math.floor(Math.random() * badges.length) + 1);
}

export function joinStyleCircle(userId: string, circleId: string): boolean {
  // Mock implementation
  return true;
}

export function createPost(
  circleId: string,
  userId: string,
  content: string,
  type: "outfit" | "swap" | "discussion" | "challenge",
): CommunityPost {
  return {
    id: `post-${Date.now()}`,
    circleId,
    userId,
    userName: "Current User",
    userAvatar: "👤",
    content,
    likes: 0,
    comments: 0,
    timestamp: "just now",
    type,
  };
}
