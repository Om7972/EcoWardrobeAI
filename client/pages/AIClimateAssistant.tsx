import { useState, useRef, useEffect } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
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
  Calendar
} from "lucide-react";

// Mock data for chat messages
const initialMessages = [
  {
    id: 1,
    sender: "ai",
    content: "Hello! I'm your EcoWardrobe AI Climate Assistant. How can I help you reduce your environmental impact today?",
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
    icon: Lightbulb
  },
  {
    id: 2,
    title: "Meatless Mondays",
    description: "Skip meat one day a week to reduce your carbon footprint",
    impact: "Save 150kg CO2/year",
    category: "Food",
    difficulty: "Medium",
    icon: Leaf
  },
  {
    id: 3,
    title: "Public Transport",
    description: "Take public transport instead of driving 2 days a week",
    impact: "Save 800kg CO2/year",
    category: "Transport",
    difficulty: "Medium",
    icon: Car
  },
  {
    id: 4,
    title: "Water Conservation",
    description: "Take 5-minute showers and fix leaks promptly",
    impact: "Save 10,000L water/year",
    category: "Home",
    difficulty: "Easy",
    icon: Droplets
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

export default function AIClimateAssistant() {
  const [messages, setMessages] = useState(initialMessages);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
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

  return (
    <Layout>
      {/* Header */}
      <section className="w-full bg-gradient-to-b from-primary/5 to-background border-b border-border/40 py-8 md:py-12">
        <div className="container max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="space-y-2">
              <h1 className="text-3xl md:text-4xl font-bold text-foreground flex items-center gap-3">
                <Bot className="w-8 h-8 text-primary" />
                AI Climate Assistant
              </h1>
              <p className="text-lg text-foreground/70 max-w-2xl">
                Your personal AI guide for sustainable living. Ask questions, get personalized tips, and track your eco-impact.
              </p>
            </div>
            <div className="flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full">
              <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-sm font-medium">Online</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="w-full py-8 md:py-12">
        <div className="container max-w-7xl mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Chat Interface */}
            <div className="lg:col-span-2 flex flex-col">
              <Card className="flex-1 flex flex-col">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bot className="w-5 h-5" />
                    Eco Assistant Chat
                  </CardTitle>
                  <CardDescription>
                    Ask me anything about sustainable living
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col">
                  {/* Chat Messages */}
                  <div className="flex-1 overflow-y-auto mb-4 space-y-4 max-h-[500px]">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                            message.sender === "user"
                              ? "bg-primary text-primary-foreground rounded-br-none"
                              : "bg-muted rounded-bl-none"
                          }`}
                        >
                          <div className="whitespace-pre-wrap text-sm">
                            {message.content}
                          </div>
                          <div
                            className={`text-xs mt-1 ${
                              message.sender === "user"
                                ? "text-primary-foreground/70"
                                : "text-foreground/50"
                            }`}
                          >
                            {message.timestamp.toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </div>
                        </div>
                      </div>
                    ))}
                    {isLoading && (
                      <div className="flex justify-start">
                        <div className="bg-muted rounded-2xl rounded-bl-none px-4 py-3">
                          <div className="flex space-x-2">
                            <div className="w-2 h-2 rounded-full bg-foreground/40 animate-bounce"></div>
                            <div className="w-2 h-2 rounded-full bg-foreground/40 animate-bounce delay-100"></div>
                            <div className="w-2 h-2 rounded-full bg-foreground/40 animate-bounce delay-200"></div>
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Input Area */}
                  <div className="flex gap-2">
                    <Input
                      id="ai-chat-input"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyDown={handleKeyPress}
                      placeholder="Ask about sustainable habits, weather, or eco-tips..."
                      className="flex-1"
                      aria-label="Chat message input"
                    />
                    <Button 
                      onClick={handleSendMessage}
                      disabled={isLoading || inputValue.trim() === ""}
                      size="icon"
                      aria-label="Send message"
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
              <Card>
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

              {/* Personalized Habits */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Recommended Habits
                  </CardTitle>
                  <CardDescription>
                    Based on your profile and location
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {habitSuggestions.map((habit) => {
                    const IconComponent = habit.icon;
                    return (
                      <div 
                        key={habit.id} 
                        className="p-4 border border-border/40 rounded-lg hover:bg-muted/50 transition-colors"
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
                <CardContent className="grid grid-cols-2 gap-3">
                  <Button variant="outline" className="h-auto py-3 flex flex-col gap-1 items-center">
                    <Recycle className="w-5 h-5" />
                    <span className="text-xs">Recycle Guide</span>
                  </Button>
                  <Button variant="outline" className="h-auto py-3 flex flex-col gap-1 items-center">
                    <Leaf className="w-5 h-5" />
                    <span className="text-xs">Carbon Calculator</span>
                  </Button>
                  <Button variant="outline" className="h-auto py-3 flex flex-col gap-1 items-center">
                    <Home className="w-5 h-5" />
                    <span className="text-xs">Energy Audit</span>
                  </Button>
                  <Button variant="outline" className="h-auto py-3 flex flex-col gap-1 items-center">
                    <Users className="w-5 h-5" />
                    <span className="text-xs">Community</span>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
}