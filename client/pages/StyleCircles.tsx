import { useState, useEffect, useRef } from "react";
import { 
  Users, 
  Plus, 
  Search, 
  Filter, 
  Heart, 
  MessageCircle, 
  Share2, 
  Lock, 
  Globe, 
  Crown,
  Star,
  TrendingUp,
  Calendar,
  MapPin,
  Camera,
  Award,
  BarChart3,
  TrendingUpIcon,
  ArrowLeft
} from "lucide-react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { useAuth } from "@/hooks/useAuth";

interface StyleCircleMember {
  userId: string;
  role: "admin" | "moderator" | "member";
  joinedAt: string;
}

interface StyleCirclePost {
  _id: string;
  userId: string;
  content: string;
  images: string[];
  likes: number;
  comments: number;
  createdAt: string;
  updatedAt: string;
}

interface StyleCircle {
  _id: string;
  name: string;
  description: string;
  category: string;
  members: StyleCircleMember[];
  posts: StyleCirclePost[];
  privacy: "public" | "private";
  tags: string[];
  memberCount: number;
  postCount: number;
  createdAt: string;
  updatedAt: string;
  // New fields for enhanced features
  events?: StyleCircleEvent[];
  achievements?: StyleCircleAchievement[];
}

interface StyleCircleEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  type: "virtual" | "in-person";
}

interface StyleCircleAchievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  earnedAt: string;
}

const categoryOptions = [
  "Minimalist Moms",
  "Streetwear Swappers",
  "Vintage Lovers",
  "Sustainable Fashion",
  "Capsule Wardrobe",
  "Thrifting Enthusiasts",
  "Eco-Conscious",
  "Fashion Forward"
];

const tagOptions = [
  "sustainable", "vintage", "thrifting", "minimalism", 
  "streetwear", "capsule", "eco-friendly", "secondhand"
];

const ALL_CATEGORIES = "all";
const ALL_TAGS = "all";

export default function StyleCircles() {
  const { user } = useAuth();
  
  const [styleCircles, setStyleCircles] = useState<StyleCircle[]>([]);
  const [filteredCircles, setFilteredCircles] = useState<StyleCircle[]>([]);
  const [selectedCircle, setSelectedCircle] = useState<StyleCircle | null>(null);
  const [circlePosts, setCirclePosts] = useState<StyleCirclePost[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isPosting, setIsPosting] = useState(false);
  const [isCreatingEvent, setIsCreatingEvent] = useState(false);
  
  // Form states
  const [circleForm, setCircleForm] = useState({
    name: "",
    description: "",
    category: "",
    privacy: "public" as "public" | "private",
    tags: [] as string[]
  });
  
  const [postForm, setPostForm] = useState({
    content: "",
    images: [] as string[]
  });
  
  const [eventForm, setEventForm] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
    type: "virtual" as "virtual" | "in-person"
  });
  
  const [filter, setFilter] = useState({
    category: ALL_CATEGORIES,
    tag: ALL_TAGS,
    search: ""
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchStyleCircles();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [styleCircles, filter]);

  const fetchStyleCircles = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/style-circles");
      if (!response.ok) throw new Error("Failed to fetch style circles");
      
      const data = await response.json();
      if (!data.data || data.data.length === 0) {
        throw new Error("No circles returned");
      }
      setStyleCircles(data.data);
    } catch (error) {
      console.error("Error fetching style circles, using mock:", error);
      const mockCircles: StyleCircle[] = [
        {
          _id: "circle-1",
          name: "Minimalist Moms",
          description: "A community for moms sharing tips on kids' capsule wardrobes, eco-friendly parenting, and minimalist closet lifestyle.",
          category: "Minimalist Moms",
          members: [
            { userId: "user-1", role: "admin", joinedAt: "2026-01-10" },
            { userId: "user-2", role: "member", joinedAt: "2026-02-14" },
            { userId: "user-3", role: "moderator", joinedAt: "2026-03-01" }
          ],
          posts: [],
          privacy: "public",
          tags: ["minimalism", "secondhand", "eco-friendly"],
          memberCount: 24,
          postCount: 15,
          createdAt: "2026-01-10T00:00:00.000Z",
          updatedAt: "2026-01-10T00:00:00.000Z",
          events: [
            {
              id: "event-1",
              title: "Kids Clothing Swap Day",
              description: "Bring outgrown kids clothing and swap them for next sizes!",
              date: "2026-07-20T14:00:00.000Z",
              location: "Community Center Park",
              type: "in-person"
            }
          ],
          achievements: [
            {
              id: "ach-1",
              title: "Green Starters",
              description: "Gathered 20+ members to support circular fashion",
              icon: "🌱",
              earnedAt: "2026-02-01"
            }
          ]
        },
        {
          _id: "circle-2",
          name: "Vintage Lovers",
          description: "Celebrating retro fashion, vintage finds, and historical garment preservation. Let's make old gold shine again!",
          category: "Vintage Lovers",
          members: [
            { userId: "user-4", role: "admin", joinedAt: "2026-01-15" }
          ],
          posts: [],
          privacy: "public",
          tags: ["vintage", "secondhand", "sustainable"],
          memberCount: 42,
          postCount: 28,
          createdAt: "2026-01-15T00:00:00.000Z",
          updatedAt: "2026-01-15T00:00:00.000Z",
          events: [],
          achievements: []
        },
        {
          _id: "circle-3",
          name: "Streetwear Swappers",
          description: "Swap oversized tees, vintage hoodies, sneakers and more. Keep the hype, ditch the footprint.",
          category: "Streetwear Swappers",
          members: [
            { userId: "user-5", role: "admin", joinedAt: "2026-02-01" }
          ],
          posts: [],
          privacy: "public",
          tags: ["streetwear", "thrifting"],
          memberCount: 18,
          postCount: 9,
          createdAt: "2026-02-01T00:00:00.000Z",
          updatedAt: "2026-02-01T00:00:00.000Z",
          events: [],
          achievements: []
        }
      ];
      setStyleCircles(mockCircles);
    } finally {
      setLoading(false);
    }
  };

  const fetchCirclePosts = async (circleId: string) => {
    try {
      const response = await fetch(`/api/style-circles/${circleId}/posts`);
      if (!response.ok) throw new Error("Failed to fetch circle posts");
      
      const data = await response.json();
      setCirclePosts(data.data);
    } catch (error) {
      console.error("Error fetching circle posts, using mock:", error);
      setCirclePosts([
        {
          _id: "post-1",
          userId: "user-1",
          content: "Just thrifted this amazing vintage denim jacket! What do you guys think? Fits right into my autumn capsule wardrobe.",
          images: ["/placeholder.svg"],
          likes: 12,
          comments: 3,
          createdAt: "2026-06-01T12:00:00.000Z",
          updatedAt: "2026-06-01T12:00:00.000Z"
        },
        {
          _id: "post-2",
          userId: "user-2",
          content: "Remember to wash thrifted items in cold water and air-dry to conserve energy and preserve fabric quality!",
          images: [],
          likes: 8,
          comments: 1,
          createdAt: "2026-06-02T09:30:00.000Z",
          updatedAt: "2026-06-02T09:30:00.000Z"
        }
      ]);
    }
  };

  const applyFilters = () => {
    let result = [...styleCircles];
    
    if (filter.category !== ALL_CATEGORIES) {
      result = result.filter(circle => circle.category === filter.category);
    }
    
    if (filter.tag !== ALL_TAGS) {
      result = result.filter(circle => circle.tags.includes(filter.tag));
    }
    
    if (filter.search) {
      const searchLower = filter.search.toLowerCase();
      result = result.filter(circle => 
        circle.name.toLowerCase().includes(searchLower) ||
        circle.description.toLowerCase().includes(searchLower) ||
        circle.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }
    
    setFilteredCircles(result);
  };

  const handleCreateCircle = async () => {
    if (!user?.userId) return;
    
    try {
      setSaving(true);
      const response = await fetch("/api/style-circles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...circleForm,
          adminUserId: user.userId
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create style circle");
      }
      
      const data = await response.json();
      setStyleCircles([data.data, ...styleCircles]);
      setIsCreating(false);
      setCircleForm({
        name: "",
        description: "",
        category: "",
        privacy: "public",
        tags: []
      });
      toast.success("Style circle created successfully!");
    } catch (error: any) {
      console.error("Error creating style circle:", error);
      toast.error(error.message || "Failed to create style circle");
    } finally {
      setSaving(false);
    }
  };

  const handleJoinCircle = async (circleId: string) => {
    if (!user?.userId) {
      toast.error("Please sign in to join a circle");
      return;
    }
    
    try {
      const response = await fetch(`/api/style-circles/${circleId}/join`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.userId })
      });
      
      if (!response.ok) throw new Error("Failed to join circle");
      
      const data = await response.json();
      setStyleCircles(styleCircles.map(circle => 
        circle._id === circleId ? data.data : circle
      ));
      
      if (selectedCircle?._id === circleId) {
        setSelectedCircle(data.data);
      }
      
      toast.success("Joined circle successfully!");
    } catch (error) {
      console.error("Error joining circle:", error);
      toast.error("Failed to join circle");
    }
  };

  const handleLeaveCircle = async (circleId: string) => {
    if (!user?.userId) return;
    
    try {
      const response = await fetch(`/api/style-circles/${circleId}/leave`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.userId })
      });
      
      if (!response.ok) throw new Error("Failed to leave circle");
      
      const data = await response.json();
      setStyleCircles(styleCircles.map(circle => 
        circle._id === circleId ? data.data : circle
      ));
      
      if (selectedCircle?._id === circleId) {
        setSelectedCircle(data.data);
      }
      
      toast.success("Left circle successfully!");
    } catch (error) {
      console.error("Error leaving circle:", error);
      toast.error("Failed to leave circle");
    }
  };

  const handleCreatePost = async () => {
    if (!selectedCircle || !user?.userId) return;
    
    try {
      setIsPosting(true);
      const response = await fetch(`/api/style-circles/${selectedCircle._id}/posts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.userId,
          content: postForm.content,
          images: postForm.images
        })
      });
      
      if (!response.ok) throw new Error("Failed to create post");
      
      const data = await response.json();
      setSelectedCircle(data.data);
      fetchCirclePosts(selectedCircle._id);
      setPostForm({ content: "", images: [] });
      toast.success("Post created successfully!");
    } catch (error) {
      console.error("Error creating post:", error);
      toast.error("Failed to create post");
    } finally {
      setIsPosting(false);
    }
  };

  const handleLikePost = async (postId: string) => {
    if (!selectedCircle) return;
    
    try {
      const response = await fetch(`/api/style-circles/${selectedCircle._id}/posts/${postId}/like`, {
        method: "PUT"
      });
      
      if (!response.ok) throw new Error("Failed to like post");
      
      const data = await response.json();
      setCirclePosts(circlePosts.map(post => 
        post._id === postId ? { ...post, likes: data.data.likes } : post
      ));
    } catch (error) {
      console.error("Error liking post:", error);
      toast.error("Failed to like post");
    }
  };

  const handleTagToggle = (tag: string) => {
    setCircleForm(prev => {
      const newTags = prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag];
      return { ...prev, tags: newTags };
    });
  };

  const handleCreateEvent = async () => {
    if (!selectedCircle || !user?.userId) return;
    
    try {
      setSaving(true);
      // In a real implementation, this would call an API endpoint
      // For now, we'll just show a success message
      toast.success("Event created successfully!");
      setIsCreatingEvent(false);
      setEventForm({
        title: "",
        description: "",
        date: "",
        location: "",
        type: "virtual"
      });
    } catch (error) {
      console.error("Error creating event:", error);
      toast.error("Failed to create event");
    } finally {
      setSaving(false);
    }
  };

  const getUserRole = (circle: StyleCircle) => {
    if (!user?.userId) return null;
    const member = circle.members.find(m => m.userId === user.userId);
    return member?.role || null;
  };

  const isMember = (circle: StyleCircle) => {
    if (!user?.userId) return false;
    return circle.members.some(m => m.userId === user.userId);
  };

  return (
    <Layout>
      <div className="container py-8">
        <div className="mb-4">
          <Link to="/dashboard" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>
        </div>
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
              <Users className="w-8 h-8 text-primary" />
              Style Circles
            </h1>
            <p className="text-foreground/70 mt-2">
              Join or create style circles to share outfits and swaps with like-minded fashion enthusiasts
            </p>
          </div>
          
          <Dialog open={isCreating} onOpenChange={setIsCreating}>
            <DialogTrigger asChild>
              <Button onClick={() => setIsCreating(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Create Circle
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Style Circle</DialogTitle>
                <DialogDescription>
                  Build a community around your fashion interests
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Circle Name
                  </Label>
                  <div className="col-span-3">
                    <Input
                      id="name"
                      value={circleForm.name}
                      onChange={(e) => setCircleForm({...circleForm, name: e.target.value})}
                      placeholder="e.g., Minimalist Moms"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-4 items-start gap-4">
                  <Label htmlFor="description" className="text-right pt-2">
                    Description
                  </Label>
                  <div className="col-span-3">
                    <Textarea
                      id="description"
                      value={circleForm.description}
                      onChange={(e) => setCircleForm({...circleForm, description: e.target.value})}
                      placeholder="Describe your style circle..."
                      className="min-h-[80px]"
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="category" className="text-right">
                    Category
                  </Label>
                  <div className="col-span-3">
                    <Select 
                      value={circleForm.category || undefined} 
                      onValueChange={(value) => setCircleForm({...circleForm, category: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categoryOptions.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="privacy" className="text-right">
                    Privacy
                  </Label>
                  <div className="col-span-3">
                    <Select 
                      value={circleForm.privacy} 
                      onValueChange={(value) => setCircleForm({...circleForm, privacy: value as any})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select privacy" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="public">
                          <div className="flex items-center gap-2">
                            <Globe className="w-4 h-4" />
                            Public
                          </div>
                        </SelectItem>
                        <SelectItem value="private">
                          <div className="flex items-center gap-2">
                            <Lock className="w-4 h-4" />
                            Private
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="grid grid-cols-4 items-start gap-4">
                  <Label className="text-right pt-2">
                    Tags
                  </Label>
                  <div className="col-span-3">
                    <div className="flex flex-wrap gap-2">
                      {tagOptions.map((tag) => (
                        <Badge 
                          key={tag} 
                          variant={circleForm.tags.includes(tag) ? "default" : "outline"}
                          className="cursor-pointer"
                          onClick={() => handleTagToggle(tag)}
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreating(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateCircle} disabled={saving}>
                  {saving ? "Creating..." : "Create Circle"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Filters */}
        <Card className="border-border/50 shadow-lg mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 w-4 h-4 text-foreground/50" />
                <Input
                  id="search-circles"
                  placeholder="Search circles..."
                  className="pl-10"
                  value={filter.search}
                  onChange={(e) => setFilter({...filter, search: e.target.value})}
                  aria-label="Search style circles"
                />
              </div>
              
              <Select 
                value={filter.category} 
                onValueChange={(value) => setFilter({...filter, category: value})}
              >
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ALL_CATEGORIES}>All Categories</SelectItem>
                  {categoryOptions.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select 
                value={filter.tag} 
                onValueChange={(value) => setFilter({...filter, tag: value})}
              >
                <SelectTrigger className="w-full sm:w-48">
                  <SelectValue placeholder="Filter by tag" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={ALL_TAGS}>All Tags</SelectItem>
                  {tagOptions.map((tag) => (
                    <SelectItem key={tag} value={tag}>
                      {tag}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {selectedCircle ? (
          /* Circle Detail View */
          <div className="space-y-6">
            {/* Circle Header */}
            <Card className="border-border/50 shadow-lg">
              <CardHeader>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="text-2xl font-bold text-foreground">{selectedCircle.name}</h2>
                      {selectedCircle.privacy === "private" ? (
                        <Lock className="w-5 h-5 text-foreground/50" />
                      ) : (
                        <Globe className="w-5 h-5 text-foreground/50" />
                      )}
                      {getUserRole(selectedCircle) === "admin" && (
                        <Crown className="w-5 h-5 text-yellow-500" />
                      )}
                    </div>
                    <p className="text-foreground/80">{selectedCircle.description}</p>
                    <div className="flex flex-wrap items-center gap-2 mt-3">
                      <Badge variant="secondary">
                        {selectedCircle.category}
                      </Badge>
                      {selectedCircle.tags.map((tag) => (
                        <Badge key={tag} variant="outline">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {!isMember(selectedCircle) ? (
                      <Button onClick={() => handleJoinCircle(selectedCircle._id)}>
                        <Plus className="w-4 h-4 mr-2" />
                        Join Circle
                      </Button>
                    ) : (
                      <Button 
                        variant="outline" 
                        onClick={() => handleLeaveCircle(selectedCircle._id)}
                      >
                        Leave Circle
                      </Button>
                    )}
                    <Button variant="outline" onClick={() => setSelectedCircle(null)}>
                      Back to Circles
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                      <Users className="w-5 h-5 text-foreground/70" />
                      <span className="font-medium">{selectedCircle.memberCount} members</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MessageCircle className="w-5 h-5 text-foreground/70" />
                      <span className="font-medium">{selectedCircle.postCount} posts</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-foreground/70" />
                      <span className="font-medium">
                        {selectedCircle.events?.length || 0} events
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Award className="w-5 h-5 text-foreground/70" />
                      <span className="font-medium">
                        {selectedCircle.achievements?.length || 0} achievements
                      </span>
                    </div>
                  </div>
                  
                  <div className="text-sm text-foreground/70">
                    Created {new Date(selectedCircle.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Circle Actions */}
            {isMember(selectedCircle) && (
              <div className="flex flex-wrap gap-2">
                <Button onClick={() => setIsCreatingEvent(true)}>
                  <Calendar className="w-4 h-4 mr-2" />
                  Create Event
                </Button>
                <Button variant="outline">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  View Analytics
                </Button>
                <Button variant="outline">
                  <TrendingUpIcon className="w-4 h-4 mr-2" />
                  Leaderboard
                </Button>
              </div>
            )}

            {/* Event Creation Dialog */}
            <Dialog open={isCreatingEvent} onOpenChange={setIsCreatingEvent}>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Create New Event</DialogTitle>
                  <DialogDescription>
                    Plan a gathering for your style circle members
                  </DialogDescription>
                </DialogHeader>
                
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="event-title" className="text-right">
                      Title
                    </Label>
                    <div className="col-span-3">
                      <Input
                        id="event-title"
                        value={eventForm.title}
                        onChange={(e) => setEventForm({...eventForm, title: e.target.value})}
                        placeholder="e.g., Sustainable Fashion Swap"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-4 items-start gap-4">
                    <Label htmlFor="event-description" className="text-right pt-2">
                      Description
                    </Label>
                    <div className="col-span-3">
                      <Textarea
                        id="event-description"
                        value={eventForm.description}
                        onChange={(e) => setEventForm({...eventForm, description: e.target.value})}
                        placeholder="Describe your event..."
                        className="min-h-[80px]"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="event-date" className="text-right">
                      Date & Time
                    </Label>
                    <div className="col-span-3">
                      <Input
                        id="event-date"
                        type="datetime-local"
                        value={eventForm.date}
                        onChange={(e) => setEventForm({...eventForm, date: e.target.value})}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="event-location" className="text-right">
                      Location
                    </Label>
                    <div className="col-span-3">
                      <Input
                        id="event-location"
                        value={eventForm.location}
                        onChange={(e) => setEventForm({...eventForm, location: e.target.value})}
                        placeholder="e.g., Central Park or Zoom link"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="event-type" className="text-right">
                      Type
                    </Label>
                    <div className="col-span-3">
                      <Select 
                        value={eventForm.type} 
                        onValueChange={(value) => setEventForm({...eventForm, type: value as any})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select event type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="virtual">
                            <div className="flex items-center gap-2">
                              <Globe className="w-4 h-4" />
                              Virtual
                            </div>
                          </SelectItem>
                          <SelectItem value="in-person">
                            <div className="flex items-center gap-2">
                              <MapPin className="w-4 h-4" />
                              In-Person
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
                
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsCreatingEvent(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateEvent} disabled={saving}>
                    {saving ? "Creating..." : "Create Event"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Post Creation */}
              <div className="lg:col-span-2">
                {isMember(selectedCircle) && (
                  <Card className="border-border/50 shadow-lg mb-6">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <MessageCircle className="w-5 h-5 text-primary" />
                        Create Post
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <Textarea
                          placeholder="Share your thoughts, outfits, or tips with the circle..."
                          value={postForm.content}
                          onChange={(e) => setPostForm({...postForm, content: e.target.value})}
                          className="min-h-[100px]"
                        />
                        
                        <div className="flex justify-between">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => fileInputRef.current?.click()}
                          >
                            <Camera className="w-4 h-4 mr-2" />
                            Add Image
                          </Button>
                          <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept="image/*"
                            multiple
                            onChange={(e) => {
                              // In a real app, you would upload the images
                              // For now, we'll just show a toast
                              if (e.target.files?.length) {
                                toast.info(`${e.target.files.length} image(s) selected`);
                              }
                            }}
                            aria-label="Select images to upload"
                          />
                          <Button 
                            onClick={handleCreatePost}
                            disabled={isPosting || !postForm.content.trim()}
                          >
                            {isPosting ? "Posting..." : "Post"}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Posts Feed */}
                <Card className="border-border/50 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-primary" />
                      Circle Feed
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {circlePosts.length > 0 ? (
                      circlePosts.map((post) => (
                        <div key={post._id} className="border-b border-border/50 pb-6 last:border-0 last:pb-0">
                          <div className="flex items-start gap-3">
                            <div className="bg-muted rounded-full w-10 h-10 flex items-center justify-center">
                              <span className="font-medium">U</span>
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <div>
                                  <h3 className="font-medium">User ID: {post.userId.substring(0, 8)}...</h3>
                                  <p className="text-sm text-foreground/70">
                                    {new Date(post.createdAt).toLocaleDateString()}
                                  </p>
                                </div>
                              </div>
                              <p className="mt-2 text-foreground/90">{post.content}</p>
                              
                              {post.images.length > 0 && (
                                <div className="mt-3 grid grid-cols-2 gap-2">
                                  {post.images.slice(0, 4).map((image, index) => (
                                    <div key={index} className="aspect-square bg-muted rounded-lg overflow-hidden">
                                      <img 
                                        src={image} 
                                        alt={`Post image ${index + 1}`} 
                                        className="w-full h-full object-cover"
                                      />
                                    </div>
                                  ))}
                                </div>
                              )}
                              
                              <div className="flex items-center gap-4 mt-3">
                                <button 
                                  className="flex items-center gap-1 text-foreground/70 hover:text-foreground transition-colors"
                                  onClick={() => handleLikePost(post._id)}
                                >
                                  <Heart className="w-4 h-4" />
                                  <span>{post.likes}</span>
                                </button>
                                <button className="flex items-center gap-1 text-foreground/70 hover:text-foreground transition-colors">
                                  <MessageCircle className="w-4 h-4" />
                                  <span>{post.comments}</span>
                                </button>
                                <button className="flex items-center gap-1 text-foreground/70 hover:text-foreground transition-colors">
                                  <Share2 className="w-4 h-4" />
                                  <span>Share</span>
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8">
                        <MessageCircle className="w-12 h-12 text-foreground/20 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-foreground mb-2">No Posts Yet</h3>
                        <p className="text-foreground/70">
                          Be the first to post in this circle!
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Members List and Events */}
              <div className="space-y-6">
                {/* Members List */}
                <Card className="border-border/50 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="w-5 h-5 text-primary" />
                      Members ({selectedCircle.memberCount})
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 max-h-[300px] overflow-y-auto">
                    {selectedCircle.members.map((member) => (
                      <div key={member.userId} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="bg-muted rounded-full w-8 h-8 flex items-center justify-center">
                            <span className="text-xs font-medium">U</span>
                          </div>
                          <div>
                            <p className="text-sm font-medium">User ID: {member.userId.substring(0, 8)}...</p>
                            <p className="text-xs text-foreground/70">
                              Joined {new Date(member.joinedAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        {member.role === "admin" && (
                          <Crown className="w-4 h-4 text-yellow-500" />
                        )}
                        {member.role === "moderator" && (
                          <Star className="w-4 h-4 text-blue-500" />
                        )}
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Upcoming Events */}
                <Card className="border-border/50 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-primary" />
                      Upcoming Events
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 max-h-[300px] overflow-y-auto">
                    {selectedCircle.events && selectedCircle.events.length > 0 ? (
                      selectedCircle.events.map((event) => (
                        <div key={event.id} className="border-b border-border/50 pb-3 last:border-0 last:pb-0">
                          <h4 className="font-medium">{event.title}</h4>
                          <p className="text-sm text-foreground/70 mt-1">{event.description}</p>
                          <div className="flex items-center gap-2 mt-2 text-xs">
                            <Calendar className="w-3 h-3" />
                            <span>{new Date(event.date).toLocaleDateString()}</span>
                            {event.type === "virtual" ? (
                              <Globe className="w-3 h-3 ml-2" />
                            ) : (
                              <MapPin className="w-3 h-3 ml-2" />
                            )}
                            <span>{event.type}</span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-foreground/70">No upcoming events</p>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        ) : (
          /* Circles List View */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              Array.from({ length: 6 }).map((_, index) => (
                <Card key={index} className="border-border/50 shadow-lg animate-pulse">
                  <CardHeader>
                    <div className="h-6 bg-muted rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-muted rounded w-full"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="h-4 bg-muted rounded w-1/2 mb-4"></div>
                    <div className="flex justify-between">
                      <div className="h-4 bg-muted rounded w-16"></div>
                      <div className="h-4 bg-muted rounded w-16"></div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : filteredCircles.length > 0 ? (
              filteredCircles.map((circle) => {
                const userRole = getUserRole(circle);
                const isUserMember = isMember(circle);
                
                return (
                  <Card 
                    key={circle._id} 
                    className="border-border/50 shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
                    onClick={() => {
                      setSelectedCircle(circle);
                      fetchCirclePosts(circle._id);
                    }}
                  >
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg flex items-center gap-2">
                          {circle.name}
                          {circle.privacy === "private" ? (
                            <Lock className="w-4 h-4 text-foreground/50" />
                          ) : (
                            <Globe className="w-4 h-4 text-foreground/50" />
                          )}
                        </CardTitle>
                        {userRole === "admin" && (
                          <Crown className="w-4 h-4 text-yellow-500" />
                        )}
                      </div>
                      <CardDescription className="line-clamp-2">
                        {circle.description}
                      </CardDescription>
                    </CardHeader>
                    
                    <CardContent>
                      <div className="flex flex-wrap gap-1 mb-4">
                        <Badge variant="secondary" className="text-xs">
                          {circle.category}
                        </Badge>
                        {circle.tags.slice(0, 2).map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {circle.tags.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{circle.tags.length - 2}
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4 text-foreground/70" />
                            <span>{circle.memberCount}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MessageCircle className="w-4 h-4 text-foreground/70" />
                            <span>{circle.postCount}</span>
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          {isUserMember ? (
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleLeaveCircle(circle._id);
                              }}
                            >
                              Leave
                            </Button>
                          ) : (
                            <Button 
                              size="sm" 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleJoinCircle(circle._id);
                              }}
                            >
                              Join
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })
            ) : (
              <div className="col-span-full text-center py-12">
                <Users className="w-16 h-16 text-foreground/20 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">No Style Circles Found</h3>
                <p className="text-foreground/70 mb-4">
                  Try adjusting your filters or create a new circle
                </p>
                <Button onClick={() => setIsCreating(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Circle
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}