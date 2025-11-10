import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Leaf, 
  Trophy, 
  MapPin, 
  Camera, 
  Users, 
  Calendar,
  Filter,
  Search,
  Plus,
  Crown,
  Star,
  CheckCircle,
  MessageCircle,
  Heart,
  Share2,
  ThumbsUp,
  ThumbsDown,
  Clock,
  Award,
  TrendingUp,
  Globe,
  User,
  Settings,
  Bell,
  Hash,
  Link as LinkIcon
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";

// Mock data for community discussions
const mockDiscussions = [
  {
    id: 1,
    title: "Best sustainable fabrics for summer clothing?",
    content: "I'm looking to refresh my summer wardrobe with eco-friendly options. What are your recommendations for breathable, sustainable fabrics that are also durable?",
    author: {
      name: "Alex Morgan",
      avatar: "AM",
      badges: ["🌱 Eco Enthusiast", "🏆 Top Contributor"]
    },
    tags: ["fabric", "summer", "clothing"],
    upvotes: 24,
    downvotes: 2,
    comments: 18,
    timestamp: "2025-11-03T14:30:00Z",
    isVerified: true
  },
  {
    id: 2,
    title: "DIY natural cleaning products that actually work?",
    content: "Tired of buying chemical cleaners. Has anyone successfully made their own effective cleaning products? I'd love some recipes!",
    author: {
      name: "Taylor Kim",
      avatar: "TK",
      badges: ["♻️ Zero Waste", "🧼 Cleaning Expert"]
    },
    tags: ["diy", "cleaning", "natural"],
    upvotes: 42,
    downvotes: 1,
    comments: 32,
    timestamp: "2025-11-02T09:15:00Z",
    isVerified: true
  },
  {
    id: 3,
    title: "Local community garden looking for volunteers",
    content: "Our neighborhood community garden needs help with winter preparation. We're looking for volunteers to help with composting, planting cover crops, and general maintenance. All experience levels welcome!",
    author: {
      name: "Jordan Smith",
      avatar: "JS",
      badges: ["🌻 Gardener", "👥 Community Leader"]
    },
    tags: ["gardening", "volunteer", "community"],
    upvotes: 18,
    downvotes: 0,
    comments: 9,
    timestamp: "2025-11-01T16:45:00Z",
    isVerified: false
  }
];

// Mock data for community challenges
const mockChallenges = [
  {
    id: 1,
    title: "Plant 5 trees this week",
    description: "Contribute to reforestation efforts by planting trees in your community",
    category: "Reforestation",
    participants: 124,
    endDate: "2025-11-15",
    impact: "Carbon reduction: 25kg",
    difficulty: "Easy",
    badge: "🌱 Sapling",
    progress: 60,
    userParticipating: true
  },
  {
    id: 2,
    title: "Zero waste week",
    description: "Produce no waste for an entire week",
    category: "Waste Reduction",
    participants: 89,
    endDate: "2025-11-10",
    impact: "Waste prevented: 15kg",
    difficulty: "Hard",
    badge: "♻️ Zero Waste Warrior",
    progress: 30,
    userParticipating: false
  },
  {
    id: 3,
    title: "Bike to work challenge",
    description: "Use bicycle instead of car for all commutes this week",
    category: "Transportation",
    participants: 210,
    endDate: "2025-11-12",
    impact: "Emissions saved: 30kg",
    difficulty: "Medium",
    badge: "🚴 Eco Commuter",
    progress: 80,
    userParticipating: true
  }
];

// Mock data for leaderboard
const mockLeaderboard = [
  { id: 1, name: "Alex Morgan", points: 1250, avatar: "AM", badge: "🏆 Eco Champion", streak: 42 },
  { id: 2, name: "Taylor Kim", points: 1120, avatar: "TK", badge: "🌱 Green Leader", streak: 38 },
  { id: 3, name: "Jordan Smith", points: 980, avatar: "JS", badge: "♻️ Sustainability Star", streak: 29 },
  { id: 4, name: "Casey Johnson", points: 875, avatar: "CJ", badge: "🌍 Eco Warrior", streak: 24 },
  { id: 5, name: "Riley Brown", points: 760, avatar: "RB", badge: "🌿 Green Advocate", streak: 19 }
];

// Mock data for user profiles
const mockUserProfiles = [
  {
    id: 1,
    name: "Alex Morgan",
    username: "@alex_morgan",
    avatar: "AM",
    bio: "Sustainable living enthusiast | Urban gardener | Zero waste advocate",
    badges: ["🏆 Eco Champion", "🌱 Green Leader", "♻️ Sustainability Star"],
    contributionStats: {
      posts: 142,
      comments: 328,
      challenges: 24,
      impact: 125
    },
    streak: 42,
    joinDate: "2024-03-15",
    location: "San Francisco, CA",
    following: 128,
    followers: 342
  }
];

// Mock data for events
const mockEvents = [
  {
    id: 1,
    title: "Community Cleanup Day",
    description: "Join us for a neighborhood cleanup to beautify our local parks and streets",
    date: "2025-11-12",
    time: "09:00 AM",
    location: "Central Park, New York",
    attendees: 42,
    maxAttendees: 50,
    category: "Community Service",
    isVirtual: false,
    userAttending: true
  },
  {
    id: 2,
    title: "Sustainable Fashion Workshop",
    description: "Learn how to upcycle old clothes into trendy new pieces",
    date: "2025-11-18",
    time: "02:00 PM",
    location: "Eco Center, Portland",
    attendees: 28,
    maxAttendees: 30,
    category: "Education",
    isVirtual: false,
    userAttending: false
  },
  {
    id: 3,
    title: "Virtual Climate Action Webinar",
    description: "Expert panel discussion on individual climate action strategies",
    date: "2025-11-20",
    time: "07:00 PM",
    location: "Online Event",
    attendees: 156,
    maxAttendees: null,
    category: "Education",
    isVirtual: true,
    userAttending: true
  }
];

// Mock data for eco news
const mockEcoNews = [
  {
    id: 1,
    title: "New breakthrough in biodegradable packaging",
    excerpt: "Scientists develop packaging material that completely decomposes in 30 days",
    source: "EcoTech Journal",
    timestamp: "2025-11-03T10:00:00Z",
    image: "/placeholder-news1.jpg",
    category: "Innovation"
  },
  {
    id: 2,
    title: "City implements plastic bag ban with impressive results",
    excerpt: "Six months after implementation, plastic bag usage down 85% in participating areas",
    source: "Green Cities Report",
    timestamp: "2025-11-02T14:30:00Z",
    image: "/placeholder-news2.jpg",
    category: "Policy"
  },
  {
    id: 3,
    title: "Renewable energy hits record adoption rates",
    excerpt: "Solar and wind power now account for 35% of new energy capacity globally",
    source: "Energy Today",
    timestamp: "2025-11-01T08:15:00Z",
    image: "/placeholder-news3.jpg",
    category: "Energy"
  }
];

export default function Community() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("discussions");
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortBy, setSortBy] = useState("recent");
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [showCreateChallenge, setShowCreateChallenge] = useState(false);
  const [showCreateEvent, setShowCreateEvent] = useState(false);
  const [showUserProfile, setShowUserProfile] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [newPost, setNewPost] = useState({ title: "", content: "", tags: "" });
  const [newChallenge, setNewChallenge] = useState({ 
    title: "", 
    description: "", 
    category: "", 
    difficulty: "Medium",
    endDate: ""
  });
  const [newEvent, setNewEvent] = useState({ 
    title: "", 
    description: "", 
    date: "", 
    time: "", 
    location: "", 
    category: "",
    isVirtual: false
  });
  const [selectedChallenge, setSelectedChallenge] = useState<any>(null);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [chatMessages, setChatMessages] = useState([
    { id: 1, user: "Alex Morgan", message: "Anyone else joining the cleanup tomorrow?", timestamp: "10:30 AM" },
    { id: 2, user: "Taylor Kim", message: "Yes! Looking forward to it", timestamp: "10:32 AM" },
    { id: 3, user: "Jordan Smith", message: "I'll be there with my gardening tools", timestamp: "10:35 AM" }
  ]);
  const [newChatMessage, setNewChatMessage] = useState("");

  // Filter discussions based on search and category
  const filteredDiscussions = mockDiscussions.filter(discussion => {
    const matchesSearch = discussion.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          discussion.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          discussion.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = categoryFilter === "all" || discussion.tags.includes(categoryFilter);
    return matchesSearch && matchesCategory;
  });

  // Sort discussions
  const sortedDiscussions = [...filteredDiscussions].sort((a, b) => {
    if (sortBy === "popular") return (b.upvotes - b.downvotes) - (a.upvotes - a.downvotes);
    if (sortBy === "comments") return b.comments - a.comments;
    // Default sort by recent (timestamp)
    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
  });

  // Get unique categories for filter
  const categories = ["all", ...new Set(mockDiscussions.flatMap(discussion => discussion.tags))];

  const handleCreatePost = () => {
    if (!newPost.title.trim() || !newPost.content.trim()) {
      toast({
        title: "Error",
        description: "Please fill in both title and content",
        variant: "destructive"
      });
      return;
    }

    // In a real app, this would send the post to the server
    toast({
      title: "Success",
      description: "Your post has been created successfully!"
    });
    
    setNewPost({ title: "", content: "", tags: "" });
    setShowCreatePost(false);
  };

  const handleCreateChallenge = () => {
    if (!newChallenge.title.trim() || !newChallenge.description.trim()) {
      toast({
        title: "Error",
        description: "Please fill in both title and description",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Success",
      description: "Your challenge has been created successfully!"
    });
    
    setNewChallenge({ 
      title: "", 
      description: "", 
      category: "", 
      difficulty: "Medium",
      endDate: ""
    });
    setShowCreateChallenge(false);
  };

  const handleCreateEvent = () => {
    if (!newEvent.title.trim() || !newEvent.description.trim() || !newEvent.date) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Success",
      description: "Your event has been created successfully!"
    });
    
    setNewEvent({ 
      title: "", 
      description: "", 
      date: "", 
      time: "", 
      location: "", 
      category: "",
      isVirtual: false
    });
    setShowCreateEvent(false);
  };

  const handleJoinChallenge = (challengeId: number) => {
    toast({
      title: "Success",
      description: "You've joined the challenge!"
    });
  };

  const handleRSVP = (eventId: number) => {
    toast({
      title: "Success",
      description: "You've RSVP'd to the event!"
    });
  };

  const handleSendMessage = () => {
    if (!newChatMessage.trim()) return;
    
    const newMessage = {
      id: chatMessages.length + 1,
      user: "You",
      message: newChatMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setChatMessages([...chatMessages, newMessage]);
    setNewChatMessage("");
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const date = new Date(timestamp);
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  return (
    <Layout>
      {/* Header */}
      <section className="w-full bg-gradient-to-b from-primary/5 to-background border-b border-border/40 py-8 md:py-12">
        <div className="container max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="space-y-2">
              <h1 className="text-3xl md:text-4xl font-bold text-foreground flex items-center gap-3">
                <Users className="w-8 h-8 text-primary" />
                Community Hub
              </h1>
              <p className="text-lg text-foreground/70 max-w-2xl">
                Connect with eco-conscious individuals, join challenges, and make a collective impact
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button 
                onClick={() => setShowCreatePost(true)}
                className="flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                New Post
              </Button>
              <Button 
                variant="outline"
                onClick={() => setShowCreateChallenge(true)}
                className="flex items-center gap-2"
              >
                <Trophy className="w-4 h-4" />
                New Challenge
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="w-full py-8 md:py-12">
        <div className="container max-w-7xl mx-auto px-4 md:px-6">
          {/* Tabs */}
          <div className="flex flex-wrap gap-2 mb-8 border-b border-border/40 pb-4">
            <Button
              variant={activeTab === "discussions" ? "default" : "outline"}
              onClick={() => setActiveTab("discussions")}
              className="flex items-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              Discussions
            </Button>
            <Button
              variant={activeTab === "challenges" ? "default" : "outline"}
              onClick={() => setActiveTab("challenges")}
              className="flex items-center gap-2"
            >
              <Trophy className="w-4 h-4" />
              Challenges
            </Button>
            <Button
              variant={activeTab === "events" ? "default" : "outline"}
              onClick={() => setActiveTab("events")}
              className="flex items-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              Events
            </Button>
            <Button
              variant={activeTab === "leaderboard" ? "default" : "outline"}
              onClick={() => setActiveTab("leaderboard")}
              className="flex items-center gap-2"
            >
              <Crown className="w-4 h-4" />
              Leaderboard
            </Button>
            <Button
              variant={activeTab === "chat" ? "default" : "outline"}
              onClick={() => setActiveTab("chat")}
              className="flex items-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              Eco Chat
            </Button>
            <Button
              variant={activeTab === "news" ? "default" : "outline"}
              onClick={() => setActiveTab("news")}
              className="flex items-center gap-2"
            >
              <Globe className="w-4 h-4" />
              Eco News
            </Button>
          </div>

          {/* Discussions Tab */}
          {activeTab === "discussions" && (
            <div className="space-y-6">
              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search discussions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Filter by category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.filter(cat => cat !== "all").map(category => (
                      <SelectItem key={category} value={category}>
                        <div className="flex items-center gap-2">
                          <Hash className="w-4 h-4" />
                          {category}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recent">Most Recent</SelectItem>
                    <SelectItem value="popular">Most Popular</SelectItem>
                    <SelectItem value="comments">Most Comments</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Discussions Grid */}
              <div className="space-y-4">
                {sortedDiscussions.map((discussion) => (
                  <Card key={discussion.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Avatar className="w-8 h-8">
                              <AvatarFallback>{discussion.author.avatar}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="font-medium">{discussion.author.name}</h3>
                                {discussion.isVerified && (
                                  <CheckCircle className="w-4 h-4 text-primary" />
                                )}
                              </div>
                              <p className="text-xs text-foreground/70">
                                {formatTimeAgo(discussion.timestamp)}
                              </p>
                            </div>
                          </div>
                          <CardTitle className="text-lg mt-2">{discussion.title}</CardTitle>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <Settings className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>Save Post</DropdownMenuItem>
                            <DropdownMenuItem>Report</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-foreground/80 mb-4">{discussion.content}</p>
                      
                      <div className="flex flex-wrap gap-2 mb-4">
                        {discussion.tags.map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            #{tag}
                          </Badge>
                        ))}
                      </div>
                      
                      <div className="flex flex-wrap gap-2 mb-4">
                        {discussion.author.badges.map((badge, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {badge}
                          </Badge>
                        ))}
                      </div>
                      
                      <div className="flex items-center justify-between pt-4 border-t border-border/40">
                        <div className="flex items-center gap-4">
                          <Button variant="ghost" size="sm" className="flex items-center gap-1">
                            <ThumbsUp className="w-4 h-4" />
                            <span>{discussion.upvotes}</span>
                          </Button>
                          <Button variant="ghost" size="sm" className="flex items-center gap-1">
                            <ThumbsDown className="w-4 h-4" />
                            <span>{discussion.downvotes}</span>
                          </Button>
                          <Button variant="ghost" size="sm" className="flex items-center gap-1">
                            <MessageCircle className="w-4 h-4" />
                            <span>{discussion.comments} comments</span>
                          </Button>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm">
                            <Share2 className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Heart className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Challenges Tab */}
          {activeTab === "challenges" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <p className="text-foreground/70">
                  Join community challenges to make a bigger impact together
                </p>
                <Button onClick={() => setShowCreateChallenge(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Challenge
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockChallenges.map((challenge) => (
                  <Card key={challenge.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="flex items-center gap-2">
                            {challenge.title}
                            <Badge variant="secondary">{challenge.difficulty}</Badge>
                          </CardTitle>
                          <CardDescription className="mt-2">
                            {challenge.description}
                          </CardDescription>
                        </div>
                        <Badge variant="outline">{challenge.category}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-1 text-foreground/70">
                          <Users className="w-4 h-4" />
                          {challenge.participants} participants
                        </div>
                        <div className="flex items-center gap-1 text-foreground/70">
                          <Calendar className="w-4 h-4" />
                          Ends {new Date(challenge.endDate).toLocaleDateString()}
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progress</span>
                          <span>{challenge.progress}%</span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div 
                            className="bg-primary h-2 rounded-full" 
                            style={{ width: `${challenge.progress}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <div className="p-3 bg-primary/5 rounded-lg">
                        <p className="text-sm font-medium text-primary">{challenge.impact}</p>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <Badge variant="default">{challenge.badge}</Badge>
                        {challenge.userParticipating ? (
                          <Button variant="outline" size="sm" disabled>
                            Participating
                          </Button>
                        ) : (
                          <Button 
                            size="sm" 
                            onClick={() => handleJoinChallenge(challenge.id)}
                          >
                            Join Challenge
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Events Tab */}
          {activeTab === "events" && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <p className="text-foreground/70">
                  Find local and virtual eco-events in your community
                </p>
                <Button onClick={() => setShowCreateEvent(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Event
                </Button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {mockEvents.map((event) => (
                  <Card key={event.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="flex items-center gap-2">
                            {event.title}
                            {event.isVirtual && (
                              <Badge variant="secondary">Virtual</Badge>
                            )}
                          </CardTitle>
                          <CardDescription className="mt-2">
                            {event.description}
                          </CardDescription>
                        </div>
                        <Badge variant="outline">{event.category}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="w-4 h-4 text-foreground/70" />
                        <span>
                          {new Date(event.date).toLocaleDateString()} at {event.time}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="w-4 h-4 text-foreground/70" />
                        <span>{event.location}</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm">
                          <Users className="w-4 h-4 text-foreground/70" />
                          <span>
                            {event.attendees} 
                            {event.maxAttendees && `/${event.maxAttendees}`} attending
                          </span>
                        </div>
                        {event.userAttending ? (
                          <Button variant="outline" size="sm" disabled>
                            Attending
                          </Button>
                        ) : (
                          <Button 
                            size="sm" 
                            onClick={() => handleRSVP(event.id)}
                          >
                            RSVP
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Leaderboard Tab */}
          {activeTab === "leaderboard" && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Crown className="w-5 h-5 text-yellow-500" />
                    Eco Champions Leaderboard
                  </CardTitle>
                  <CardDescription>
                    Top contributors making a positive environmental impact
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockLeaderboard.map((user, index) => (
                      <div 
                        key={user.id} 
                        className="flex items-center justify-between p-4 rounded-lg border border-border/40 hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 font-bold">
                            {index === 0 ? (
                              <Trophy className="w-5 h-5 text-yellow-500" />
                            ) : (
                              index + 1
                            )}
                          </div>
                          <Avatar className="w-10 h-10">
                            <AvatarFallback>{user.avatar}</AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-semibold text-foreground">{user.name}</h3>
                            <div className="flex items-center gap-2">
                              <div className="flex items-center gap-1 text-sm text-foreground/70">
                                <Star className="w-4 h-4" />
                                <span>{user.badge}</span>
                              </div>
                              <div className="flex items-center gap-1 text-sm text-foreground/70">
                                <TrendingUp className="w-4 h-4" />
                                <span>{user.streak} day streak</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-lg text-primary">{user.points}</p>
                          <p className="text-sm text-foreground/70">points</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Chat Tab */}
          {activeTab === "chat" && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageCircle className="w-5 h-5" />
                    Eco Community Chat
                  </CardTitle>
                  <CardDescription>
                    Real-time conversation with eco-conscious individuals
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="h-96 overflow-y-auto p-4 bg-muted/10 rounded-lg border">
                      {chatMessages.map((msg) => (
                        <div key={msg.id} className="mb-4">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-sm">{msg.user}</span>
                            <span className="text-xs text-foreground/50">{msg.timestamp}</span>
                          </div>
                          <p className="text-foreground/90">{msg.message}</p>
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex gap-2">
                      <Input
                        placeholder="Type your message..."
                        value={newChatMessage}
                        onChange={(e) => setNewChatMessage(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                      />
                      <Button onClick={handleSendMessage}>
                        Send
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Eco News Tab */}
          {activeTab === "news" && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="w-5 h-5" />
                    Latest Eco News
                  </CardTitle>
                  <CardDescription>
                    AI-generated highlights of environmental news and innovations
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {mockEcoNews.map((news) => (
                      <Card key={news.id} className="hover:shadow-lg transition-shadow">
                        <div className="bg-muted aspect-video rounded-t-lg flex items-center justify-center">
                          <span className="text-4xl">🌍</span>
                        </div>
                        <CardHeader>
                          <CardTitle className="text-lg">{news.title}</CardTitle>
                          <CardDescription>{news.excerpt}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-foreground/70">{news.source}</span>
                            <span className="text-foreground/70">
                              {formatTimeAgo(news.timestamp)}
                            </span>
                          </div>
                          <Badge variant="secondary" className="mt-2">
                            {news.category}
                          </Badge>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>

      {/* Create Post Modal */}
      <Dialog open={showCreatePost} onOpenChange={setShowCreatePost}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Discussion</DialogTitle>
            <DialogDescription>
              Share your thoughts, ask questions, or start a conversation
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="post-title">Title</Label>
              <Input
                id="post-title"
                placeholder="What would you like to discuss?"
                value={newPost.title}
                onChange={(e) => setNewPost({...newPost, title: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="post-content">Content</Label>
              <Textarea
                id="post-content"
                placeholder="Share your thoughts..."
                rows={6}
                value={newPost.content}
                onChange={(e) => setNewPost({...newPost, content: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="post-tags">Tags (comma separated)</Label>
              <Input
                id="post-tags"
                placeholder="e.g., sustainability, fashion, zero-waste"
                value={newPost.tags}
                onChange={(e) => setNewPost({...newPost, tags: e.target.value})}
              />
            </div>
            
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowCreatePost(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreatePost}>
                Post Discussion
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Create Challenge Modal */}
      <Dialog open={showCreateChallenge} onOpenChange={setShowCreateChallenge}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Challenge</DialogTitle>
            <DialogDescription>
              Inspire the community with a new sustainability challenge
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="challenge-title">Challenge Title</Label>
              <Input
                id="challenge-title"
                placeholder="e.g., Plastic-Free Week"
                value={newChallenge.title}
                onChange={(e) => setNewChallenge({...newChallenge, title: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="challenge-description">Description</Label>
              <Textarea
                id="challenge-description"
                placeholder="Describe the challenge and its environmental impact..."
                rows={4}
                value={newChallenge.description}
                onChange={(e) => setNewChallenge({...newChallenge, description: e.target.value})}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="challenge-category">Category</Label>
                <Select 
                  value={newChallenge.category} 
                  onValueChange={(value) => setNewChallenge({...newChallenge, category: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="waste">Waste Reduction</SelectItem>
                    <SelectItem value="energy">Energy Conservation</SelectItem>
                    <SelectItem value="transport">Transportation</SelectItem>
                    <SelectItem value="food">Sustainable Food</SelectItem>
                    <SelectItem value="water">Water Conservation</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="challenge-difficulty">Difficulty</Label>
                <Select 
                  value={newChallenge.difficulty} 
                  onValueChange={(value) => setNewChallenge({...newChallenge, difficulty: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select difficulty" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Easy">Easy</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="Hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="challenge-end-date">End Date</Label>
              <Input
                id="challenge-end-date"
                type="date"
                value={newChallenge.endDate}
                onChange={(e) => setNewChallenge({...newChallenge, endDate: e.target.value})}
              />
            </div>
            
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowCreateChallenge(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateChallenge}>
                Create Challenge
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Create Event Modal */}
      <Dialog open={showCreateEvent} onOpenChange={setShowCreateEvent}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Event</DialogTitle>
            <DialogDescription>
              Organize a local or virtual eco-event for the community
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="event-title">Event Title</Label>
              <Input
                id="event-title"
                placeholder="e.g., Community Cleanup Day"
                value={newEvent.title}
                onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="event-description">Description</Label>
              <Textarea
                id="event-description"
                placeholder="Describe the event and what participants will do..."
                rows={4}
                value={newEvent.description}
                onChange={(e) => setNewEvent({...newEvent, description: e.target.value})}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="event-date">Date</Label>
                <Input
                  id="event-date"
                  type="date"
                  value={newEvent.date}
                  onChange={(e) => setNewEvent({...newEvent, date: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="event-time">Time</Label>
                <Input
                  id="event-time"
                  type="time"
                  value={newEvent.time}
                  onChange={(e) => setNewEvent({...newEvent, time: e.target.value})}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="event-location">Location</Label>
              <Input
                id="event-location"
                placeholder="e.g., Central Park, New York or Online"
                value={newEvent.location}
                onChange={(e) => setNewEvent({...newEvent, location: e.target.value})}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="event-category">Category</Label>
              <Select 
                value={newEvent.category} 
                onValueChange={(value) => setNewEvent({...newEvent, category: value})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="community">Community Service</SelectItem>
                  <SelectItem value="education">Education</SelectItem>
                  <SelectItem value="social">Social Gathering</SelectItem>
                  <SelectItem value="workshop">Workshop</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center gap-2">
              <Switch
                id="event-virtual"
                checked={newEvent.isVirtual}
                onCheckedChange={(checked) => setNewEvent({...newEvent, isVirtual: checked})}
              />
              <Label htmlFor="event-virtual">Virtual Event</Label>
            </div>
            
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowCreateEvent(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreateEvent}>
                Create Event
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}