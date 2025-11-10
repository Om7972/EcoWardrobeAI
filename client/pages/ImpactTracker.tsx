import { useState } from "react";
import { 
  Leaf, 
  Globe, 
  Droplets, 
  Recycle, 
  Award, 
  TrendingUp, 
  Target, 
  Calendar,
  Users,
  Zap,
  Shirt,
  BarChart3,
  PieChart,
  LineChart,
  Medal,
  Crown,
  Star
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell
} from "recharts";

interface WardrobeItem {
  id: string;
  name: string;
  category: string;
  purchaseDate: Date;
  price: number;
  ecoScore: number;
  carbonFootprint: number; // kg CO2
  waterUsage: number; // liters
  materials: string[];
  brand: string;
}

interface Challenge {
  id: string;
  title: string;
  description: string;
  target: number;
  progress: number;
  reward: string;
  deadline: Date;
  completed: boolean;
}

interface BadgeType {
  id: string;
  name: string;
  description: string;
  icon: string;
  earned: boolean;
  earnedDate?: Date;
}

const mockWardrobeItems: WardrobeItem[] = [
  {
    id: "1",
    name: "Organic Cotton T-Shirt",
    category: "Tops",
    purchaseDate: new Date(2023, 5, 15),
    price: 29.99,
    ecoScore: 95,
    carbonFootprint: 2.5,
    waterUsage: 200,
    materials: ["Organic Cotton"],
    brand: "EcoWear"
  },
  {
    id: "2",
    name: "Recycled Denim Jeans",
    category: "Bottoms",
    purchaseDate: new Date(2023, 8, 22),
    price: 89.99,
    ecoScore: 88,
    carbonFootprint: 8.2,
    waterUsage: 150,
    materials: ["Recycled Cotton", "Recycled Polyester"],
    brand: "ReNew Apparel"
  },
  {
    id: "3",
    name: "Bamboo Fiber Dress",
    category: "Dresses",
    purchaseDate: new Date(2024, 1, 10),
    price: 49.99,
    ecoScore: 92,
    carbonFootprint: 4.7,
    waterUsage: 120,
    materials: ["Bamboo Fiber"],
    brand: "GreenThreads"
  },
  {
    id: "4",
    name: "Hemp Cargo Pants",
    category: "Bottoms",
    purchaseDate: new Date(2023, 11, 5),
    price: 59.99,
    ecoScore: 87,
    carbonFootprint: 6.1,
    waterUsage: 180,
    materials: ["Hemp", "Organic Cotton"],
    brand: "EarthWear"
  },
  {
    id: "5",
    name: "Linen Shirt",
    category: "Tops",
    purchaseDate: new Date(2024, 3, 18),
    price: 39.99,
    ecoScore: 90,
    carbonFootprint: 3.8,
    waterUsage: 100,
    materials: ["Linen"],
    brand: "NaturalStyle"
  }
];

const mockChallenges: Challenge[] = [
  {
    id: "1",
    title: "Eco-Conscious Shopper",
    description: "Purchase 5 items with eco-score above 85",
    target: 5,
    progress: 4,
    reward: "Eco Warrior Badge",
    deadline: new Date(2024, 11, 31),
    completed: false
  },
  {
    id: "2",
    title: "Water Saver",
    description: "Reduce water footprint by 30%",
    target: 30,
    progress: 22,
    reward: "Blue Planet Badge",
    deadline: new Date(2024, 11, 31),
    completed: false
  },
  {
    id: "3",
    title: "Carbon Neutral",
    description: "Offset 10kg of carbon emissions",
    target: 10,
    progress: 7,
    reward: "Green Champion Badge",
    deadline: new Date(2024, 11, 31),
    completed: false
  }
];

const mockBadges: BadgeType[] = [
  {
    id: "1",
    name: "Eco Warrior",
    description: "Purchased 10 sustainable items",
    icon: "🌱",
    earned: true,
    earnedDate: new Date(2024, 5, 15)
  },
  {
    id: "2",
    name: "Water Guardian",
    description: "Saved 1000L of water through eco-choices",
    icon: "💧",
    earned: true,
    earnedDate: new Date(2024, 7, 22)
  },
  {
    id: "3",
    name: "Carbon Neutral",
    description: "Offset 50kg of carbon emissions",
    icon: "🌍",
    earned: false
  },
  {
    id: "4",
    name: "Circular Fashionista",
    description: "Participated in 5 clothing swaps",
    icon: "🔄",
    earned: false
  }
];

// Mock data for charts
const monthlyImpactData = [
  { month: "Jan", carbon: 12.5, water: 850 },
  { month: "Feb", carbon: 9.8, water: 720 },
  { month: "Mar", carbon: 15.2, water: 980 },
  { month: "Apr", carbon: 7.6, water: 620 },
  { month: "May", carbon: 11.3, water: 780 },
  { month: "Jun", carbon: 8.9, water: 690 }
];

const categoryImpactData = [
  { category: "Tops", value: 35, color: "#10B981" },
  { category: "Bottoms", value: 40, color: "#3B82F6" },
  { category: "Dresses", value: 15, color: "#F59E0B" },
  { category: "Outerwear", value: 10, color: "#EF4444" }
];

export default function ImpactTracker() {
  const [selectedItem, setSelectedItem] = useState<WardrobeItem | null>(null);
  const [showItemDetail, setShowItemDetail] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [timeRange, setTimeRange] = useState("6m");

  const getTotalCarbonFootprint = () => {
    return mockWardrobeItems.reduce((total, item) => total + item.carbonFootprint, 0);
  };

  const getTotalWaterUsage = () => {
    return mockWardrobeItems.reduce((total, item) => total + item.waterUsage, 0);
  };

  const getAverageEcoScore = () => {
    const totalScore = mockWardrobeItems.reduce((total, item) => total + item.ecoScore, 0);
    return Math.round(totalScore / mockWardrobeItems.length);
  };

  const getEcoItemsCount = () => {
    return mockWardrobeItems.filter(item => item.ecoScore >= 85).length;
  };

  const getCompletedChallenges = () => {
    return mockChallenges.filter(challenge => challenge.completed).length;
  };

  const getEarnedBadges = () => {
    return mockBadges.filter(badge => badge.earned).length;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-nature/5">
      <div className="container py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
              <Leaf className="w-8 h-8 text-primary" />
              Impact Tracker
            </h1>
            <p className="text-foreground/70 mt-2">
              Track your fashion footprint and earn rewards for sustainable choices
            </p>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline">
              <Calendar className="w-4 h-4 mr-2" />
              Last 6 Months
            </Button>
            <Button>
              <Target className="w-4 h-4 mr-2" />
              Set Goals
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-border/50 shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="bg-green-500/10 p-2 rounded-full">
                  <Globe className="w-5 h-5 text-green-500" />
                </div>
                <div>
                  <p className="text-sm text-foreground/70">Carbon Footprint</p>
                  <p className="text-xl font-bold">{getTotalCarbonFootprint().toFixed(1)} kg</p>
                  <p className="text-xs text-green-600">↓ 15% from last month</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-border/50 shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="bg-blue-500/10 p-2 rounded-full">
                  <Droplets className="w-5 h-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-sm text-foreground/70">Water Usage</p>
                  <p className="text-xl font-bold">{getTotalWaterUsage()} L</p>
                  <p className="text-xs text-green-600">↓ 12% from last month</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-border/50 shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="bg-amber-500/10 p-2 rounded-full">
                  <Star className="w-5 h-5 text-amber-500" />
                </div>
                <div>
                  <p className="text-sm text-foreground/70">Eco Score</p>
                  <p className="text-xl font-bold">{getAverageEcoScore()}%</p>
                  <p className="text-xs text-green-600">↑ 3% from last month</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-border/50 shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="bg-purple-500/10 p-2 rounded-full">
                  <Award className="w-5 h-5 text-purple-500" />
                </div>
                <div>
                  <p className="text-sm text-foreground/70">Eco Items</p>
                  <p className="text-xl font-bold">{getEcoItemsCount()}</p>
                  <p className="text-xs text-foreground/70">of {mockWardrobeItems.length} items</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border mb-6">
          <button
            className={`px-4 py-2 font-medium ${activeTab === "overview" ? "border-b-2 border-primary text-primary" : "text-foreground/70"}`}
            onClick={() => setActiveTab("overview")}
          >
            Overview
          </button>
          <button
            className={`px-4 py-2 font-medium ${activeTab === "challenges" ? "border-b-2 border-primary text-primary" : "text-foreground/70"}`}
            onClick={() => setActiveTab("challenges")}
          >
            Challenges
          </button>
          <button
            className={`px-4 py-2 font-medium ${activeTab === "badges" ? "border-b-2 border-primary text-primary" : "text-foreground/70"}`}
            onClick={() => setActiveTab("badges")}
          >
            Badges
          </button>
          <button
            className={`px-4 py-2 font-medium ${activeTab === "leaderboard" ? "border-b-2 border-primary text-primary" : "text-foreground/70"}`}
            onClick={() => setActiveTab("leaderboard")}
          >
            Leaderboard
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Charts */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="border-border/50 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-primary" />
                    Monthly Impact
                  </CardTitle>
                  <CardDescription>
                    Your environmental impact over the last 6 months
                  </CardDescription>
                </CardHeader>
                <CardContent className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={monthlyImpactData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis yAxisId="left" />
                      <YAxis yAxisId="right" orientation="right" />
                      <Tooltip />
                      <Bar yAxisId="left" dataKey="carbon" fill="#10B981" name="Carbon (kg)" />
                      <Bar yAxisId="right" dataKey="water" fill="#3B82F6" name="Water (L)" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              
              <Card className="border-border/50 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <LineChart className="w-5 h-5 text-primary" />
                    Progress Overview
                  </CardTitle>
                  <CardDescription>
                    Your sustainability journey
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Carbon Footprint Reduction</span>
                        <span>45%</span>
                      </div>
                      <Progress value={45} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Water Usage Reduction</span>
                        <span>38%</span>
                      </div>
                      <Progress value={38} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Eco Items Purchased</span>
                        <span>72%</span>
                      </div>
                      <Progress value={72} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* Wardrobe Items */}
            <div className="space-y-6">
              <Card className="border-border/50 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Shirt className="w-5 h-5 text-primary" />
                      Your Eco Wardrobe
                    </div>
                    <Badge variant="secondary">{mockWardrobeItems.length} items</Badge>
                  </CardTitle>
                  <CardDescription>
                    Sustainable items in your collection
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 max-h-[500px] overflow-y-auto">
                  {mockWardrobeItems.map((item) => (
                    <div 
                      key={item.id} 
                      className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted/50 cursor-pointer"
                      onClick={() => {
                        setSelectedItem(item);
                        setShowItemDetail(true);
                      }}
                    >
                      <div className="bg-muted aspect-square w-12 rounded flex items-center justify-center">
                        <Shirt className="w-6 h-6 text-foreground/30" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-sm line-clamp-1">{item.name}</h4>
                        <p className="text-xs text-foreground/70">{item.brand}</p>
                        <div className="flex items-center justify-between mt-1">
                          <Badge 
                            variant="secondary" 
                            className="text-xs"
                          >
                            {item.ecoScore}% Eco
                          </Badge>
                          <span className="text-xs text-foreground/70">
                            {item.carbonFootprint}kg CO2
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
              
              <Card className="border-border/50 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="w-5 h-5 text-primary" />
                    Impact by Category
                  </CardTitle>
                </CardHeader>
                <CardContent className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={categoryImpactData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {categoryImpactData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
        
        {activeTab === "challenges" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockChallenges.map((challenge) => (
              <Card 
                key={challenge.id} 
                className="border-border/50 shadow-lg hover:shadow-md transition-shadow"
              >
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{challenge.title}</span>
                    {challenge.completed && (
                      <Medal className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                    )}
                  </CardTitle>
                  <CardDescription>{challenge.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Progress</span>
                        <span>{Math.round((challenge.progress / challenge.target) * 100)}%</span>
                      </div>
                      <Progress value={(challenge.progress / challenge.target) * 100} />
                      <p className="text-xs text-foreground/70 mt-1">
                        {challenge.progress} of {challenge.target} completed
                      </p>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Badge variant="outline">
                        Reward: {challenge.reward}
                      </Badge>
                      <span className="text-xs text-foreground/70">
                        Due: {challenge.deadline.toLocaleDateString()}
                      </span>
                    </div>
                    
                    <Button 
                      className="w-full"
                      disabled={challenge.completed}
                    >
                      {challenge.completed ? "Completed!" : "Take Action"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
        
        {activeTab === "badges" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {mockBadges.map((badge) => (
              <Card 
                key={badge.id} 
                className={`border-border/50 shadow-lg ${
                  badge.earned ? "ring-2 ring-primary" : "opacity-70"
                }`}
              >
                <CardContent className="p-6 text-center">
                  <div className="text-4xl mb-3">{badge.icon}</div>
                  <h3 className="font-bold text-lg mb-1">{badge.name}</h3>
                  <p className="text-sm text-foreground/70 mb-3">{badge.description}</p>
                  
                  {badge.earned ? (
                    <div className="space-y-2">
                      <Badge className="bg-green-500/20 text-green-700 hover:bg-green-500/30">
                        Earned
                      </Badge>
                      <p className="text-xs text-foreground/70">
                        {badge.earnedDate?.toLocaleDateString()}
                      </p>
                    </div>
                  ) : (
                    <Badge variant="outline">Locked</Badge>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
        
        {activeTab === "leaderboard" && (
          <Card className="border-border/50 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Crown className="w-5 h-5 text-primary" />
                Community Leaderboard
              </CardTitle>
              <CardDescription>
                Top eco-conscious fashionistas in your community
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((rank) => (
                  <div 
                    key={rank} 
                    className="flex items-center gap-4 p-3 border rounded-lg"
                  >
                    <div className={`w-8 h-8 flex items-center justify-center rounded-full ${
                      rank === 1 ? "bg-yellow-500 text-white" : 
                      rank === 2 ? "bg-gray-400 text-white" : 
                      rank === 3 ? "bg-amber-700 text-white" : 
                      "bg-muted"
                    }`}>
                      {rank}
                    </div>
                    <div className="bg-muted aspect-square w-10 rounded-full flex items-center justify-center">
                      <Users className="w-5 h-5 text-foreground/30" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">User {rank}</h4>
                      <p className="text-sm text-foreground/70">
                        {100 - (rank * 5)} impact points
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Leaf className="w-4 h-4 text-green-500" />
                      <span className="font-medium">{100 - (rank * 5)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
      
      {/* Item Detail Modal */}
      <Dialog open={showItemDetail} onOpenChange={setShowItemDetail}>
        <DialogContent className="max-w-md">
          {selectedItem && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedItem.name}</DialogTitle>
                <DialogDescription>
                  Environmental impact details
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <div className="bg-muted aspect-video rounded-lg flex items-center justify-center">
                  <Shirt className="w-16 h-16 text-foreground/30" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-green-500/10 rounded-lg">
                    <p className="text-xs text-foreground/70">Carbon Footprint</p>
                    <p className="font-bold text-lg">{selectedItem.carbonFootprint} kg</p>
                  </div>
                  <div className="p-3 bg-blue-500/10 rounded-lg">
                    <p className="text-xs text-foreground/70">Water Usage</p>
                    <p className="font-bold text-lg">{selectedItem.waterUsage} L</p>
                  </div>
                </div>
                
                <div className="p-3 bg-amber-500/10 rounded-lg">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-xs text-foreground/70">Eco Score</p>
                      <p className="font-bold text-lg">{selectedItem.ecoScore}%</p>
                    </div>
                    <Badge 
                      variant="secondary" 
                      className={
                        selectedItem.ecoScore > 90 
                          ? "bg-green-500/20 text-green-700" 
                          : selectedItem.ecoScore > 80 
                            ? "bg-blue-500/20 text-blue-700" 
                            : "bg-amber-500/20 text-amber-700"
                      }
                    >
                      {selectedItem.ecoScore > 90 ? "Excellent" : 
                       selectedItem.ecoScore > 80 ? "Good" : "Average"}
                    </Badge>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Materials</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedItem.materials.map((material, index) => (
                      <Badge key={index} variant="outline">
                        {material}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button className="flex-1">
                    <Recycle className="w-4 h-4 mr-2" />
                    Care Instructions
                  </Button>
                  <Button variant="outline">
                    Share Impact
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}