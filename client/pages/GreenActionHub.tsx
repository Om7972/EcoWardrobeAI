import { useState } from "react";
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
  CheckCircle
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
    badge: "🌱 Sapling"
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
    badge: "♻️ Zero Waste Warrior"
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
    badge: "🚴 Eco Commuter"
  },
  {
    id: 4,
    title: "Plastic-free shopping",
    description: "Shop without using any single-use plastics",
    category: "Consumption",
    participants: 156,
    endDate: "2025-11-20",
    impact: "Plastic prevented: 8kg",
    difficulty: "Medium",
    badge: "🛍️ Plastic Free"
  }
];

// Mock data for leaderboard
const mockLeaderboard = [
  { id: 1, name: "Alex Morgan", points: 1250, avatar: "AM", badge: "🏆 Eco Champion" },
  { id: 2, name: "Taylor Kim", points: 1120, avatar: "TK", badge: "🌱 Green Leader" },
  { id: 3, name: "Jordan Smith", points: 980, avatar: "JS", badge: "♻️ Sustainability Star" },
  { id: 4, name: "Casey Johnson", points: 875, avatar: "CJ", badge: "🌍 Eco Warrior" },
  { id: 5, name: "Riley Brown", points: 760, avatar: "RB", badge: "🌿 Green Advocate" }
];

// Mock data for user submissions
const mockSubmissions = [
  {
    id: 1,
    userId: "user1",
    userName: "Alex Morgan",
    challengeId: 1,
    title: "My tree planting day",
    description: "Planted 3 oak trees in the community park with my family",
    imageUrl: "/placeholder-tree.jpg",
    location: "Central Park, New York",
    date: "2025-11-03",
    likes: 24,
    verified: true
  },
  {
    id: 2,
    userId: "user2",
    userName: "Taylor Kim",
    challengeId: 3,
    title: "Bike commute success",
    description: "Completed all my commutes by bike this week!",
    imageUrl: "/placeholder-bike.jpg",
    location: "Downtown, San Francisco",
    date: "2025-11-02",
    likes: 18,
    verified: true
  }
];

export default function GreenActionHub() {
  const [activeTab, setActiveTab] = useState("challenges");
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [showSubmissionForm, setShowSubmissionForm] = useState(false);
  const [selectedChallenge, setSelectedChallenge] = useState<number | null>(null);

  // Filter challenges based on search and category
  const filteredChallenges = mockChallenges.filter(challenge => {
    const matchesSearch = challenge.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          challenge.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "all" || challenge.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Get unique categories for filter
  const categories = ["all", ...new Set(mockChallenges.map(challenge => challenge.category))];

  return (
    <Layout>
      {/* Header */}
      <section className="w-full bg-gradient-to-b from-primary/5 to-background border-b border-border/40 py-8 md:py-12">
        <div className="container max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="space-y-2">
              <h1 className="text-3xl md:text-4xl font-bold text-foreground flex items-center gap-3">
                <Leaf className="w-8 h-8 text-primary" />
                Green Action Hub
              </h1>
              <p className="text-lg text-foreground/70 max-w-2xl">
                Join community challenges, track your impact, and connect with eco-conscious individuals
              </p>
            </div>
            <Button 
              onClick={() => setShowSubmissionForm(true)}
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              New Submission
            </Button>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="w-full py-8 md:py-12">
        <div className="container max-w-7xl mx-auto px-4 md:px-6">
          {/* Tabs */}
          <div className="flex flex-wrap gap-2 mb-8 border-b border-border/40 pb-4">
            <Button
              variant={activeTab === "challenges" ? "default" : "outline"}
              onClick={() => setActiveTab("challenges")}
              className="flex items-center gap-2"
            >
              <Leaf className="w-4 h-4" />
              Challenges
            </Button>
            <Button
              variant={activeTab === "leaderboard" ? "default" : "outline"}
              onClick={() => setActiveTab("leaderboard")}
              className="flex items-center gap-2"
            >
              <Trophy className="w-4 h-4" />
              Leaderboard
            </Button>
            <Button
              variant={activeTab === "submissions" ? "default" : "outline"}
              onClick={() => setActiveTab("submissions")}
              className="flex items-center gap-2"
            >
              <Users className="w-4 h-4" />
              Community Feed
            </Button>
          </div>

          {/* Challenges Tab */}
          {activeTab === "challenges" && (
            <div className="space-y-6">
              {/* Filters */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="search-challenges"
                    placeholder="Search challenges..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                    aria-label="Search challenges"
                  />
                </div>
                <div className="w-full sm:w-48">
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger>
                      <div className="flex items-center gap-2">
                        <Filter className="w-4 h-4" />
                        <SelectValue placeholder="Category" />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category} value={category}>
                          {category === "all" ? "All Categories" : category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Challenges Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredChallenges.map(challenge => (
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
                      <div className="p-3 bg-primary/5 rounded-lg">
                        <p className="text-sm font-medium text-primary">{challenge.impact}</p>
                      </div>
                      <div className="flex justify-between items-center">
                        <Badge variant="default">{challenge.badge}</Badge>
                        <Button 
                          onClick={() => {
                            setSelectedChallenge(challenge.id);
                            setShowSubmissionForm(true);
                          }}
                          size="sm"
                        >
                          Join Challenge
                        </Button>
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
                          <div>
                            <h3 className="font-semibold text-foreground">{user.name}</h3>
                            <div className="flex items-center gap-1 text-sm text-foreground/70">
                              <Star className="w-4 h-4" />
                              {user.badge}
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

          {/* Submissions Tab */}
          {activeTab === "submissions" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {mockSubmissions.map(submission => (
                  <Card key={submission.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="flex items-center gap-2">
                            {submission.title}
                            {submission.verified && (
                              <CheckCircle className="w-5 h-5 text-green-500" />
                            )}
                          </CardTitle>
                          <CardDescription>
                            by {submission.userName}
                          </CardDescription>
                        </div>
                        <Badge variant="outline">
                          {new Date(submission.date).toLocaleDateString()}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-foreground/80">{submission.description}</p>
                      <div className="flex items-center gap-2 text-sm text-foreground/70">
                        <MapPin className="w-4 h-4" />
                        {submission.location}
                      </div>
                      <div className="flex justify-between items-center">
                        <Button variant="outline" size="sm">
                          <Star className="w-4 h-4 mr-2" />
                          {submission.likes} likes
                        </Button>
                        <Button variant="ghost" size="sm">
                          Share
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Submission Form Modal */}
      {showSubmissionForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-background rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Submit Challenge Entry</h2>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => setShowSubmissionForm(false)}
                >
                  ✕
                </Button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Challenge</label>
                  <Select 
                    value={selectedChallenge?.toString() || ""} 
                    onValueChange={(value) => setSelectedChallenge(parseInt(value))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a challenge" />
                    </SelectTrigger>
                    <SelectContent>
                      {mockChallenges.map(challenge => (
                        <SelectItem key={challenge.id} value={challenge.id.toString()}>
                          {challenge.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label htmlFor="submission-title" className="text-sm font-medium">Title</label>
                  <Input id="submission-title" placeholder="Give your submission a title" />
                </div>
                <div>
                  <label className="text-sm font-medium">Description</label>
                  <Textarea placeholder="Describe your experience..." rows={4} />
                </div>
                <div>
                  <label htmlFor="location" className="text-sm font-medium">Location</label>
                  <div className="flex gap-2">
                    <Input id="location" placeholder="Add location" className="flex-1" />
                    <Button variant="outline" size="icon">
                      <MapPin className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">Photo</label>
                  <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                    <Camera className="w-8 h-8 mx-auto text-foreground/40 mb-2" />
                    <p className="text-sm text-foreground/70">Upload a photo of your action</p>
                    <Button variant="outline" size="sm" className="mt-2">
                      Choose File
                    </Button>
                  </div>
                </div>
                <div className="flex gap-3 pt-4">
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => setShowSubmissionForm(false)}
                  >
                    Cancel
                  </Button>
                  <Button className="flex-1">Submit</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}