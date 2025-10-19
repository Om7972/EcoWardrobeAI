import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import {
  Users,
  Heart,
  MessageCircle,
  Flame,
  Star,
  Trophy,
  Share2,
  Plus,
  Filter,
  Search,
} from "lucide-react";
import { toast } from "sonner";

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

interface Post {
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

export default function StyleCircles() {
  const [circles, setCircles] = useState<StyleCircle[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCircle, setSelectedCircle] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [circlesRes, feedRes, badgesRes] = await Promise.all([
        fetch("/api/community/circles"),
        fetch("/api/community/feed"),
        fetch("/api/community/badges"),
      ]);

      if (!circlesRes.ok || !feedRes.ok || !badgesRes.ok)
        throw new Error("Failed to fetch");

      const circlesData = await circlesRes.json();
      const feedData = await feedRes.json();
      const badgesData = await badgesRes.json();

      setCircles(circlesData.data);
      setPosts(feedData.data);
      setBadges(badgesData.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load community data");
    } finally {
      setLoading(false);
    }
  };

  const toggleLike = (postId: string) => {
    const newLiked = new Set(likedPosts);
    if (newLiked.has(postId)) {
      newLiked.delete(postId);
    } else {
      newLiked.add(postId);
    }
    setLikedPosts(newLiked);
  };

  const filteredCircles = circles.filter((circle) => {
    const matchesSearch = circle.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory =
      filterCategory === "all" || circle.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const displayPosts = selectedCircle
    ? posts.filter((p) => p.circleId === selectedCircle)
    : posts;

  const categories = ["all", "lifestyle", "fashion", "style", "professional", "student"];

  const getPostIcon = (type: string) => {
    switch (type) {
      case "outfit":
        return "👗";
      case "swap":
        return "🔄";
      case "discussion":
        return "💬";
      case "challenge":
        return "🎯";
      default:
        return "📝";
    }
  };

  const getBadgeColor = (color: string) => {
    const colors: Record<string, string> = {
      green: "bg-green-100 text-green-700 border-green-300",
      purple: "bg-purple-100 text-purple-700 border-purple-300",
      yellow: "bg-yellow-100 text-yellow-700 border-yellow-300",
      orange: "bg-orange-100 text-orange-700 border-orange-300",
      blue: "bg-blue-100 text-blue-700 border-blue-300",
      brown: "bg-amber-100 text-amber-700 border-amber-300",
      pink: "bg-pink-100 text-pink-700 border-pink-300",
      darkblue: "bg-indigo-100 text-indigo-700 border-indigo-300",
    };
    return colors[color] || colors.blue;
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="w-12 h-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin mx-auto" />
            <p className="text-foreground/70">Loading communities...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Hero Section */}
      <section className="w-full bg-gradient-to-b from-primary/10 to-background border-b border-border/40 py-12 md:py-16">
        <div className="container max-w-7xl mx-auto px-4 md:px-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Users className="w-8 h-8 text-primary" />
              <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                Style Circles
              </h1>
            </div>
            <p className="text-lg text-foreground/70 max-w-2xl">
              Join communities, share outfits, swap items, and earn eco-friendly badges
            </p>
          </div>
        </div>
      </section>

      <main className="w-full py-12 md:py-16">
        <div className="container max-w-7xl mx-auto px-4 md:px-6 space-y-12">
          {/* Discover Communities */}
          <section className="space-y-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h2 className="text-2xl font-bold text-foreground">
                  🏘️ Discover Communities
                </h2>
                <p className="text-foreground/70 mt-1">
                  {filteredCircles.length} communities available
                </p>
              </div>
              <button className="flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-all">
                <Plus className="w-5 h-5" />
                Create Circle
              </button>
            </div>

            {/* Search and Filter */}
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 w-5 h-5 text-foreground/50" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search communities..."
                  className="w-full pl-10 pr-4 py-2.5 bg-muted border border-border/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
              </div>

              <div className="flex items-center gap-2 overflow-x-auto pb-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setFilterCategory(cat)}
                    className={`px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                      filterCategory === cat
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-foreground/70 hover:bg-muted/80"
                    }`}
                  >
                    {cat === "all" ? "All" : cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Communities Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCircles.map((circle) => (
                <div
                  key={circle.id}
                  className="card-base p-6 space-y-4 hover:shadow-lg transition-all cursor-pointer group animate-slide-up"
                  onClick={() => setSelectedCircle(circle.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="text-5xl">{circle.image}</div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toast.success(`Joined ${circle.name}!`);
                      }}
                      className="px-3 py-1 bg-primary text-primary-foreground rounded-full text-sm font-semibold hover:bg-primary/90 transition-all"
                    >
                      Join
                    </button>
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-xl font-bold text-foreground">
                      {circle.name}
                    </h3>
                    <p className="text-sm text-foreground/70 line-clamp-2">
                      {circle.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-foreground/60">
                    <Users className="w-4 h-4" />
                    {circle.memberCount.toLocaleString()} members
                  </div>

                  {/* Eco Leaders */}
                  {circle.eco_leaders.length > 0 && (
                    <div className="pt-2 border-t border-border/50 space-y-2">
                      <p className="text-xs font-semibold text-foreground/70">
                        Eco Leaders
                      </p>
                      <div className="flex gap-2">
                        {circle.eco_leaders.map((leader, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full"
                          >
                            {leader}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Community Feed */}
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-foreground">
                  📰 Community Feed
                </h2>
                <p className="text-foreground/70 mt-1">
                  {selectedCircle
                    ? "Circle posts"
                    : `All posts (${displayPosts.length})`}
                </p>
              </div>
              {selectedCircle && (
                <button
                  onClick={() => setSelectedCircle(null)}
                  className="text-sm text-primary hover:text-primary/80 font-semibold"
                >
                  View All
                </button>
              )}
            </div>

            {/* Posts */}
            <div className="space-y-4">
              {displayPosts.map((post) => (
                <div
                  key={post.id}
                  className="card-base p-6 space-y-4 hover:shadow-md transition-all animate-slide-up"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-xl">
                        {post.userAvatar}
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">
                          {post.userName}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-foreground/50">
                          <span>{post.timestamp}</span>
                          <span className="text-lg">{getPostIcon(post.type)}</span>
                        </div>
                      </div>
                    </div>
                    <button className="p-2 hover:bg-muted rounded-lg transition-all">
                      <Share2 className="w-4 h-4 text-foreground/50" />
                    </button>
                  </div>

                  {/* Content */}
                  <p className="text-foreground/90">{post.content}</p>

                  {post.image && (
                    <div className="text-4xl text-center py-4 bg-muted/30 rounded-lg">
                      {post.image}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-4 pt-2 border-t border-border/50">
                    <button
                      onClick={() => toggleLike(post.id)}
                      className="flex items-center gap-2 text-foreground/60 hover:text-primary transition-all"
                    >
                      <Heart
                        className={`w-5 h-5 ${
                          likedPosts.has(post.id)
                            ? "fill-primary text-primary"
                            : ""
                        }`}
                      />
                      <span className="text-sm">
                        {post.likes + (likedPosts.has(post.id) ? 1 : 0)}
                      </span>
                    </button>
                    <button className="flex items-center gap-2 text-foreground/60 hover:text-primary transition-all">
                      <MessageCircle className="w-5 h-5" />
                      <span className="text-sm">{post.comments}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Available Badges */}
          <section className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                🏆 Earn Badges
              </h2>
              <p className="text-foreground/70">
                Unlock achievements through community engagement
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {badges.map((badge) => (
                <div
                  key={badge.id}
                  className={`p-4 rounded-lg border-2 text-center space-y-2 hover:shadow-md transition-all ${getBadgeColor(
                    badge.color
                  )}`}
                >
                  <div className="text-4xl">{badge.icon}</div>
                  <h4 className="font-bold">{badge.name}</h4>
                  <p className="text-xs opacity-80">{badge.description}</p>
                  <div className="text-xs opacity-70 pt-2 border-t border-current border-opacity-20">
                    {badge.requirement}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Challenge Section */}
          <section className="bg-gradient-to-r from-primary/10 to-nature/10 rounded-2xl border border-primary/20 p-8 space-y-6">
            <div className="flex items-center gap-3">
              <Flame className="w-8 h-8 text-primary" />
              <h2 className="text-2xl font-bold text-foreground">
                🎯 Weekly Challenge
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  title: "Capsule Week",
                  description:
                    "Create outfits using only 10 items. Share your combinations!",
                  emoji: "👕",
                  participants: 234,
                },
                {
                  title: "Swap Week",
                  description: "Complete 3 swaps and help another member refresh!",
                  emoji: "🔄",
                  participants: 156,
                },
                {
                  title: "Eco Challenge",
                  description: "Style only sustainable items. Max eco-friendly look!",
                  emoji: "🌿",
                  participants: 389,
                },
              ].map((challenge, idx) => (
                <div
                  key={idx}
                  className="p-6 bg-card border border-border/50 rounded-lg space-y-3 hover:border-primary/30 transition-all"
                >
                  <div className="text-3xl">{challenge.emoji}</div>
                  <h3 className="font-bold text-foreground">{challenge.title}</h3>
                  <p className="text-sm text-foreground/70">
                    {challenge.description}
                  </p>
                  <div className="flex items-center justify-between pt-3 border-t border-border/50">
                    <span className="text-xs text-foreground/60">
                      {challenge.participants} joining
                    </span>
                    <button className="px-4 py-1.5 bg-primary text-primary-foreground rounded-full text-xs font-semibold hover:bg-primary/90 transition-all">
                      Join
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </Layout>
  );
}
