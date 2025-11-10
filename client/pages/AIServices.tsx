import { useState, useRef, useEffect } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Bot, 
  Send, 
  Sun, 
  CloudRain, 
  Wind, 
  Thermometer,
  Droplets,
  Eye,
  Leaf,
  Recycle,
  Zap,
  Car,
  Home,
  TrendingUp,
  Lightbulb,
  Users,
  Calendar,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  BarChart3,
  PieChart,
  LineChart,
  Target,
  Award,
  TreePine,
  Globe,
  Settings,
  Save,
  Download,
  Share2,
  Check,
  Activity
} from "lucide-react";
import {
  BarChart, 
  Bar, 
  LineChart as RechartsLineChart,
  Line,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from "recharts";

// Mock data for chat messages
const initialMessages = [
  {
    id: 1,
    sender: "ai",
    content: "Hello! I'm your EcoWardrobe AI Assistant. How can I help you reduce your environmental impact today?",
    timestamp: new Date(Date.now() - 300000)
  },
  {
    id: 2,
    sender: "user",
    content: "What are some easy ways to reduce my carbon footprint?",
    timestamp: new Date(Date.now() - 240000)
  },
  {
    id: 3,
    sender: "ai",
    content: "Great question! Here are some simple steps you can take:\n\n1. **Transportation**: Walk, bike, or use public transport when possible\n2. **Energy**: Switch to LED bulbs and unplug devices when not in use\n3. **Food**: Reduce meat consumption and buy local produce\n4. **Shopping**: Choose quality items that last longer\n\nWould you like me to elaborate on any of these?",
    timestamp: new Date(Date.now() - 180000)
  }
];

// Mock data for habit suggestions
const habitSuggestions = [
  {
    id: 1,
    title: "Energy Efficient Lighting",
    description: "Replace 5 incandescent bulbs with LED alternatives",
    impact: "Save 200kg CO2/year",
    category: "Home",
    difficulty: "Easy",
    icon: Lightbulb,
    completed: false,
    streak: 0
  },
  {
    id: 2,
    title: "Meatless Mondays",
    description: "Skip meat one day a week to reduce your carbon footprint",
    impact: "Save 150kg CO2/year",
    category: "Food",
    difficulty: "Medium",
    icon: Leaf,
    completed: true,
    streak: 4
  },
  {
    id: 3,
    title: "Public Transport",
    description: "Take public transport instead of driving 2 days a week",
    impact: "Save 800kg CO2/year",
    category: "Transport",
    difficulty: "Medium",
    icon: Car,
    completed: false,
    streak: 0
  },
  {
    id: 4,
    title: "Water Conservation",
    description: "Take 5-minute showers and fix leaks promptly",
    impact: "Save 10,000L water/year",
    category: "Home",
    difficulty: "Easy",
    icon: Droplets,
    completed: true,
    streak: 12
  }
];

// Mock weather data
const weatherData = {
  location: "San Francisco, CA",
  temperature: 18,
  condition: "Partly Cloudy",
  humidity: 65,
  windSpeed: 12,
  airQuality: "Good",
  uvIndex: 4
};

// Mock data for impact metrics
const impactMetrics = [
  { id: 1, name: "Carbon Saved", value: 125, unit: "kg", icon: Wind, color: "#10B981" },
  { id: 2, name: "Water Saved", value: 840, unit: "L", icon: Droplets, color: "#3B82F6" },
  { id: 3, name: "Waste Prevented", value: 32, unit: "kg", icon: Recycle, color: "#F59E0B" },
  { id: 4, name: "Trees Equivalent", value: 12, unit: "trees", icon: TreePine, color: "#8B5CF6" }
];

// Mock data for carbon footprint breakdown
const carbonData = [
  { name: 'Transportation', value: 35, color: '#10B981' },
  { name: 'Home Energy', value: 25, color: '#3B82F6' },
  { name: 'Food', value: 20, color: '#F59E0B' },
  { name: 'Consumption', value: 15, color: '#8B5CF6' },
  { name: 'Other', value: 5, color: '#EC4899' }
];

// Mock data for weekly goals
const weeklyGoals = [
  { id: 1, title: "Reduce energy consumption by 10%", completed: true, impact: "Save 15kg CO2" },
  { id: 2, title: "Use public transport 3 times", completed: false, impact: "Save 12kg CO2" },
  { id: 3, title: "No single-use plastics", completed: false, impact: "Prevent 2kg waste" },
  { id: 4, title: "Plant-based meals 5 times", completed: true, impact: "Save 8kg CO2" }
];

export default function AIServices() {
  const [messages, setMessages] = useState(initialMessages);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [activeTab, setActiveTab] = useState("assistant");
  const [selectedHabit, setSelectedHabit] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = () => {
    if (inputValue.trim() === "") return;

    // Add user message
    const newUserMessage = {
      id: messages.length + 1,
      sender: "user",
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newUserMessage]);
    setInputValue("");
    setIsLoading(true);

    // Simulate AI response after delay
    setTimeout(() => {
      const aiResponse = {
        id: messages.length + 2,
        sender: "ai",
        content: generateAIResponse(inputValue),
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1000);
  };

  const generateAIResponse = (userInput: string) => {
    const lowerInput = userInput.toLowerCase();
    
    if (lowerInput.includes("weather") || lowerInput.includes("temperature")) {
      return `The current weather in ${weatherData.location} is ${weatherData.temperature}°C with ${weatherData.condition.toLowerCase()}. Humidity is at ${weatherData.humidity}% and wind speed is ${weatherData.windSpeed} km/h. The air quality is ${weatherData.airQuality.toLowerCase()} with a UV index of ${weatherData.uvIndex}.`;
    }
    
    if (lowerInput.includes("habit") || lowerInput.includes("suggestion")) {
      return "Based on your profile, I recommend these eco-friendly habits:\n\n" + 
        habitSuggestions.map(habit => 
          `- **${habit.title}**: ${habit.description} (${habit.impact})`
        ).join("\n\n") + 
        "\n\nWould you like to track any of these habits?";
    }
    
    if (lowerInput.includes("carbon") || lowerInput.includes("footprint")) {
      return "I can help you calculate and track your carbon footprint. Based on your lifestyle, here's a breakdown of your emissions:\n\n" +
        carbonData.map(item => 
          `- **${item.name}**: ${item.value}%`
        ).join("\n") + 
        "\n\nWould you like to explore ways to reduce your footprint in any specific area?";
    }
    
    if (lowerInput.includes("thank")) {
      return "You're welcome! Remember, every small action contributes to a healthier planet. Is there anything else I can help you with?";
    }
    
    return "I understand you're asking about: \"" + userInput + "\". As your AI Climate Assistant, I can help with:\n\n" +
      "🌿 **Eco-friendly habits** tailored to your lifestyle\n" +
      "🌤️ **Weather and air quality** in your area\n" +
      "💡 **Energy-saving tips** for your home\n" +
      "🚲 **Sustainable transportation** options\n" +
      "🍽️ **Eco-conscious food choices**\n\n" +
      "What specific area would you like advice on?";
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleListening = () => {
    setIsListening(!isListening);
    // In a real app, this would connect to speech recognition API
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    // In a real app, this would control audio output
  };

  const toggleHabitCompletion = (habitId: number) => {
    // In a real app, this would update the habit status on the server
    console.log(`Toggled habit ${habitId}`);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Layout>
      {/* Header */}
      <section className="w-full bg-gradient-to-b from-primary/5 to-background border-b border-border/40 py-8 md:py-12">
        <div className="container max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="space-y-2">
              <h1 className="text-3xl md:text-4xl font-bold text-foreground flex items-center gap-3">
                <Bot className="w-8 h-8 text-primary" />
                AI Services
              </h1>
              <p className="text-lg text-foreground/70 max-w-2xl">
                Your personal AI guide for sustainable living. Get personalized tips, track habits, and calculate your impact.
              </p>
            </div>
            <div className="flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full">
              <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-sm font-medium">AI Online</span>
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
              variant={activeTab === "assistant" ? "default" : "outline"}
              onClick={() => setActiveTab("assistant")}
              className="flex items-center gap-2"
            >
              <Bot className="w-4 h-4" />
              Climate Assistant
            </Button>
            <Button
              variant={activeTab === "habits" ? "default" : "outline"}
              onClick={() => setActiveTab("habits")}
              className="flex items-center gap-2"
            >
              <Target className="w-4 h-4" />
              Habit Tracker
            </Button>
            <Button
              variant={activeTab === "carbon" ? "default" : "outline"}
              onClick={() => setActiveTab("carbon")}
              className="flex items-center gap-2"
            >
              <Globe className="w-4 h-4" />
              Carbon Calculator
            </Button>
            <Button
              variant={activeTab === "planner" ? "default" : "outline"}
              onClick={() => setActiveTab("planner")}
              className="flex items-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              Eco Planner
            </Button>
            <Button
              variant={activeTab === "dashboard" ? "default" : "outline"}
              onClick={() => setActiveTab("dashboard")}
              className="flex items-center gap-2"
            >
              <BarChart3 className="w-4 h-4" />
              AI Dashboard
            </Button>
          </div>

          {/* Climate Assistant Tab */}
          {activeTab === "assistant" && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Chat Area */}
              <div className="lg:col-span-2 space-y-6">
                <Card className="border-border/50 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Bot className="w-5 h-5 text-primary" />
                      EcoWardrobe AI Assistant
                    </CardTitle>
                    <CardDescription>
                      Ask questions about sustainability, get personalized tips, and track your eco-impact
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {/* Messages */}
                    <div className="h-96 overflow-y-auto mb-4 space-y-4 p-4 bg-muted/5 rounded-lg">
                      {messages.map((message) => (
                        <div 
                          key={message.id} 
                          className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                          <div 
                            className={`max-w-[80%] rounded-lg p-4 ${
                              message.sender === 'user' 
                                ? 'bg-primary text-primary-foreground' 
                                : 'bg-muted border border-border'
                            }`}
                          >
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs opacity-80">
                                {message.sender === 'user' ? 'You' : 'AI Assistant'}
                              </span>
                              <span className="text-xs opacity-60">
                                {formatTime(message.timestamp)}
                              </span>
                            </div>
                            <p className="whitespace-pre-wrap">{message.content}</p>
                          </div>
                        </div>
                      ))}
                      {isLoading && (
                        <div className="flex justify-start">
                          <div className="bg-muted border border-border rounded-lg p-4">
                            <div className="flex items-center gap-2">
                              <Bot className="w-4 h-4 text-primary" />
                              <span className="text-sm">AI Assistant is typing...</span>
                            </div>
                          </div>
                        </div>
                      )}
                      <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Textarea
                          value={inputValue}
                          onChange={(e) => setInputValue(e.target.value)}
                          onKeyDown={handleKeyPress}
                          placeholder="Ask about sustainable habits, weather, or eco-tips..."
                          className="min-h-[60px]"
                        />
                        <div className="absolute right-2 bottom-2 flex gap-1">
                          <Button 
                            size="icon" 
                            variant="ghost"
                            onClick={toggleListening}
                          >
                            {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                          </Button>
                          <Button 
                            size="icon" 
                            variant="ghost"
                            onClick={toggleMute}
                          >
                            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                          </Button>
                        </div>
                      </div>
                      <Button 
                        onClick={handleSendMessage}
                        disabled={isLoading || inputValue.trim() === ""}
                        size="icon"
                      >
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Weather Widget */}
                <Card className="border-border/50 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Sun className="w-5 h-5" />
                      Local Conditions
                    </CardTitle>
                    <CardDescription>
                      {weatherData.location}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Thermometer className="w-5 h-5 text-red-500" />
                        <span className="font-semibold">{weatherData.temperature}°C</span>
                      </div>
                      <span className="text-foreground/70">{weatherData.condition}</span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center gap-2 text-sm">
                        <Droplets className="w-4 h-4 text-blue-500" />
                        <div>
                          <p className="text-foreground/70">Humidity</p>
                          <p className="font-medium">{weatherData.humidity}%</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Wind className="w-4 h-4 text-gray-500" />
                        <div>
                          <p className="text-foreground/70">Wind</p>
                          <p className="font-medium">{weatherData.windSpeed} km/h</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Eye className="w-4 h-4 text-purple-500" />
                        <div>
                          <p className="text-foreground/70">Air Quality</p>
                          <p className="font-medium">{weatherData.airQuality}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Sun className="w-4 h-4 text-yellow-500" />
                        <div>
                          <p className="text-foreground/70">UV Index</p>
                          <p className="font-medium">{weatherData.uvIndex}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Suggestions */}
                <Card className="border-border/50 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Lightbulb className="w-5 h-5" />
                      Quick Suggestions
                    </CardTitle>
                    <CardDescription>
                      Based on your profile and location
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {habitSuggestions.slice(0, 3).map((habit) => {
                      const IconComponent = habit.icon;
                      return (
                        <div 
                          key={habit.id} 
                          className="p-4 border border-border/40 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                          onClick={() => setSelectedHabit(habit)}
                        >
                          <div className="flex items-start gap-3">
                            <div className="mt-1 p-2 rounded-lg bg-primary/10">
                              <IconComponent className="w-5 h-5 text-primary" />
                            </div>
                            <div className="flex-1">
                              <div className="flex justify-between">
                                <h3 className="font-semibold text-foreground">{habit.title}</h3>
                                <Badge variant="secondary">{habit.difficulty}</Badge>
                              </div>
                              <p className="text-sm text-foreground/70 mt-1">{habit.description}</p>
                              <div className="flex justify-between items-center mt-2">
                                <Badge variant="outline">{habit.category}</Badge>
                                <span className="text-xs font-medium text-primary">{habit.impact}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    <Button variant="outline" className="w-full">
                      View All Recommendations
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* Habit Tracker Tab */}
          {activeTab === "habits" && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    Personalized Eco Habits
                  </CardTitle>
                  <CardDescription>
                    Track your sustainable habits and build positive environmental routines
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {habitSuggestions.map((habit) => {
                      const IconComponent = habit.icon;
                      return (
                        <Card key={habit.id} className="hover:shadow-lg transition-shadow">
                          <CardHeader className="pb-2">
                            <div className="flex items-center justify-between">
                              <IconComponent className="w-6 h-6 text-primary" />
                              <Badge variant="secondary">{habit.difficulty}</Badge>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <h3 className="font-bold mb-2">{habit.title}</h3>
                            <p className="text-sm text-foreground/70 mb-3">{habit.description}</p>
                            <p className="text-sm font-medium text-primary mb-3">{habit.impact}</p>
                            <Badge variant="outline" className="mb-3">{habit.category}</Badge>
                            <div className="flex items-center justify-between">
                              <Button 
                                size="sm"
                                variant={habit.completed ? "outline" : "default"}
                                onClick={() => toggleHabitCompletion(habit.id)}
                              >
                                {habit.completed ? "Completed" : "Mark Done"}
                              </Button>
                              {habit.streak > 0 && (
                                <div className="flex items-center gap-1 text-sm">
                                  <TrendingUp className="w-4 h-4 text-green-500" />
                                  <span>{habit.streak} days</span>
                                </div>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Carbon Calculator Tab */}
          {activeTab === "carbon" && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Impact Summary */}
                <div className="lg:col-span-1 space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Globe className="w-5 h-5" />
                        Your Environmental Impact
                      </CardTitle>
                      <CardDescription>
                        Based on your lifestyle and activities
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {impactMetrics.map((metric) => {
                        const IconComponent = metric.icon;
                        return (
                          <div key={metric.id} className="flex items-center justify-between p-3 bg-muted/5 rounded-lg">
                            <div className="flex items-center gap-3">
                              <IconComponent className="w-5 h-5" style={{ color: metric.color }} />
                              <div>
                                <p className="text-sm font-medium">{metric.name}</p>
                                <p className="text-xs text-foreground/70">This month</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-bold" style={{ color: metric.color }}>
                                {metric.value}
                              </p>
                              <p className="text-xs text-foreground/70">{metric.unit}</p>
                            </div>
                          </div>
                        );
                      })}
                    </CardContent>
                  </Card>

                  {/* Quick Actions */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Zap className="w-5 h-5" />
                        Quick Actions
                      </CardTitle>
                      <CardDescription>
                        Simple steps to reduce your impact
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <Button variant="outline" className="w-full justify-between">
                        <div className="flex items-center gap-2">
                          <Recycle className="w-4 h-4" />
                          <span>Recycle Guide</span>
                        </div>
                        <span className="text-xs">Save 5kg CO2</span>
                      </Button>
                      <Button variant="outline" className="w-full justify-between">
                        <div className="flex items-center gap-2">
                          <Leaf className="w-4 h-4" />
                          <span>Carbon Calculator</span>
                        </div>
                        <span className="text-xs">Save 10kg CO2</span>
                      </Button>
                      <Button variant="outline" className="w-full justify-between">
                        <div className="flex items-center gap-2">
                          <Home className="w-4 h-4" />
                          <span>Energy Audit</span>
                        </div>
                        <span className="text-xs">Save 15kg CO2</span>
                      </Button>
                      <Button variant="outline" className="w-full justify-between">
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          <span>Community</span>
                        </div>
                        <span className="text-xs">Save 3kg CO2</span>
                      </Button>
                    </CardContent>
                  </Card>
                </div>

                {/* Carbon Breakdown */}
                <div className="lg:col-span-2 space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <PieChart className="w-5 h-5" />
                        Carbon Footprint Breakdown
                      </CardTitle>
                      <CardDescription>
                        Distribution of your environmental impact across categories
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <RechartsPieChart>
                            <Pie
                              data={carbonData}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="value"
                              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            >
                              {carbonData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                            <Tooltip formatter={(value) => [`${value}%`, "Percentage"]} />
                            <Legend />
                          </RechartsPieChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BarChart3 className="w-5 h-5" />
                        Monthly Impact Trend
                      </CardTitle>
                      <CardDescription>
                        Your environmental impact over the past 6 months
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart
                            data={[
                              { month: "May", carbon: 120, water: 750, waste: 25 },
                              { month: "Jun", carbon: 110, water: 720, waste: 28 },
                              { month: "Jul", carbon: 105, water: 700, waste: 30 },
                              { month: "Aug", carbon: 98, water: 680, waste: 32 },
                              { month: "Sep", carbon: 92, water: 650, waste: 35 },
                              { month: "Oct", carbon: 85, water: 620, waste: 33 }
                            ]}
                            margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="carbon" fill="#10B981" name="Carbon (kg)" />
                            <Bar dataKey="water" fill="#3B82F6" name="Water (L)" />
                            <Bar dataKey="waste" fill="#F59E0B" name="Waste (kg)" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          )}

          {/* Eco Planner Tab */}
          {activeTab === "planner" && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5" />
                    Weekly Sustainability Goals
                  </CardTitle>
                  <CardDescription>
                    AI-generated goals tailored to your lifestyle and impact areas
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {weeklyGoals.map((goal) => (
                      <Card key={goal.id} className={goal.completed ? "border-green-500/50" : ""}>
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <div className={`mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                              goal.completed 
                                ? "bg-green-500 border-green-500" 
                                : "border-foreground/30"
                            }`}>
                              {goal.completed && <Check className="w-3 h-3 text-white" />}
                            </div>
                            <div className="flex-1">
                              <h3 className="font-medium">{goal.title}</h3>
                              <p className="text-sm text-foreground/70 mt-1">{goal.impact}</p>
                              <div className="flex justify-between items-center mt-3">
                                <Badge variant={goal.completed ? "default" : "secondary"}>
                                  {goal.completed ? "Completed" : "In Progress"}
                                </Badge>
                                <Button size="sm" variant="outline">
                                  <Settings className="w-3 h-3 mr-1" />
                                  Adjust
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Monthly Challenges */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Award className="w-5 h-5" />
                      Monthly Challenges
                    </CardTitle>
                    <CardDescription>
                      Special challenges to boost your impact
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-4 border border-border/40 rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-medium">Zero Waste Week</h3>
                          <Badge variant="secondary">Hard</Badge>
                        </div>
                        <p className="text-sm text-foreground/70 mb-3">
                          Produce no waste for an entire week
                        </p>
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-primary">Save 15kg waste</span>
                          <Button size="sm">Join Challenge</Button>
                        </div>
                      </div>
                      
                      <div className="p-4 border border-border/40 rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-medium">Plant-Based November</h3>
                          <Badge variant="secondary">Medium</Badge>
                        </div>
                        <p className="text-sm text-foreground/70 mb-3">
                          Eat only plant-based foods for the month
                        </p>
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium text-primary">Save 50kg CO2</span>
                          <Button size="sm">Join Challenge</Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Progress Tracking */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5" />
                      Progress Tracking
                    </CardTitle>
                    <CardDescription>
                      Visualize your sustainability journey
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <RechartsLineChart
                          data={[
                            { week: "Week 1", habits: 3, impact: 12 },
                            { week: "Week 2", habits: 5, impact: 18 },
                            { week: "Week 3", habits: 7, impact: 25 },
                            { week: "Week 4", habits: 8, impact: 32 }
                          ]}
                          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="week" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Line 
                            type="monotone" 
                            dataKey="habits" 
                            stroke="#10B981" 
                            name="Habits Completed" 
                            strokeWidth={2}
                            dot={{ r: 4 }}
                            activeDot={{ r: 6 }}
                          />
                          <Line 
                            type="monotone" 
                            dataKey="impact" 
                            stroke="#3B82F6" 
                            name="Impact (kg CO2)" 
                            strokeWidth={2}
                            dot={{ r: 4 }}
                            activeDot={{ r: 6 }}
                          />
                        </RechartsLineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {/* AI Dashboard Tab */}
          {activeTab === "dashboard" && (
            <div className="space-y-6">
              {/* Summary Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {impactMetrics.map((metric) => {
                  const IconComponent = metric.icon;
                  return (
                    <Card key={metric.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <IconComponent className="w-6 h-6" style={{ color: metric.color }} />
                          <Badge variant="secondary">{metric.unit}</Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-2xl font-bold" style={{ color: metric.color }}>
                          {metric.value}
                        </p>
                        <p className="text-sm text-foreground/70">{metric.name}</p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>

              {/* Insights and Recommendations */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* AI Insights */}
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Bot className="w-5 h-5" />
                      AI Insights & Recommendations
                    </CardTitle>
                    <CardDescription>
                      Personalized analysis of your environmental impact
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                        <div className="flex items-start gap-3">
                          <div className="mt-1 p-2 rounded-lg bg-primary/10">
                            <Lightbulb className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-medium text-foreground">Transportation Insight</h3>
                            <p className="text-sm text-foreground/80 mt-1">
                              Your transportation emissions are 15% higher than the average user. 
                              Consider carpooling or public transport to reduce your impact.
                            </p>
                            <Button size="sm" variant="outline" className="mt-2">
                              View Recommendations
                            </Button>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                        <div className="flex items-start gap-3">
                          <div className="mt-1 p-2 rounded-lg bg-primary/10">
                            <Home className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-medium text-foreground">Home Energy Insight</h3>
                            <p className="text-sm text-foreground/80 mt-1">
                              Switching to LED bulbs could reduce your home energy consumption by 20%.
                              We've found 3 local suppliers offering discounts.
                            </p>
                            <Button size="sm" variant="outline" className="mt-2">
                              Explore Options
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Activity */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Activity className="w-5 h-5" />
                      Recent Activity
                    </CardTitle>
                    <CardDescription>
                      Your latest sustainability actions
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center">
                          <Leaf className="w-4 h-4 text-green-500" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Completed habit</p>
                          <p className="text-xs text-foreground/70">Meatless Monday</p>
                        </div>
                        <span className="text-xs text-foreground/50 ml-auto">2h ago</span>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center">
                          <Droplets className="w-4 h-4 text-blue-500" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Saved water</p>
                          <p className="text-xs text-foreground/70">5-minute shower</p>
                        </div>
                        <span className="text-xs text-foreground/50 ml-auto">5h ago</span>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-amber-500/10 flex items-center justify-center">
                          <Recycle className="w-4 h-4 text-amber-500" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Recycled items</p>
                          <p className="text-xs text-foreground/70">3 plastic bottles</p>
                        </div>
                        <span className="text-xs text-foreground/50 ml-auto">1d ago</span>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-purple-500/10 flex items-center justify-center">
                          <Car className="w-4 h-4 text-purple-500" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Public transport</p>
                          <p className="text-xs text-foreground/70">Bike to work</p>
                        </div>
                        <span className="text-xs text-foreground/50 ml-auto">1d ago</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Detailed Analytics */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Detailed Analytics
                  </CardTitle>
                  <CardDescription>
                    Comprehensive view of your environmental impact
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Carbon Breakdown */}
                    <div>
                      <h3 className="font-medium mb-4">Carbon Footprint Breakdown</h3>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <RechartsPieChart>
                            <Pie
                              data={carbonData}
                              cx="50%"
                              cy="50%"
                              innerRadius={60}
                              outerRadius={80}
                              fill="#8884d8"
                              paddingAngle={5}
                              dataKey="value"
                              label
                            >
                              {carbonData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                            <Tooltip />
                          </RechartsPieChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                    
                    {/* Impact Over Time */}
                    <div>
                      <h3 className="font-medium mb-4">Impact Over Time</h3>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <RechartsLineChart
                            data={[
                              { month: "Jan", carbon: 150, water: 800, waste: 40 },
                              { month: "Feb", carbon: 140, water: 780, waste: 38 },
                              { month: "Mar", carbon: 135, water: 760, waste: 35 },
                              { month: "Apr", carbon: 130, water: 740, waste: 32 },
                              { month: "May", carbon: 120, water: 750, waste: 25 },
                              { month: "Jun", carbon: 110, water: 720, waste: 28 }
                            ]}
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="carbon" stroke="#10B981" name="Carbon (kg)" />
                            <Line type="monotone" dataKey="water" stroke="#3B82F6" name="Water (L)" />
                            <Line type="monotone" dataKey="waste" stroke="#F59E0B" name="Waste (kg)" />
                          </RechartsLineChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>
    </Layout>
  );
}