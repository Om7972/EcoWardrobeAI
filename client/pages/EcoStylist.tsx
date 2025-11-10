import { useState, useEffect, useRef } from "react";
import { 
  Bot, 
  Send, 
  Image, 
  Sun, 
  CloudRain, 
  Cloud, 
  Wind, 
  Zap,
  Shirt,
  Heart,
  Star,
  Calendar,
  MapPin,
  Users,
  TrendingUp,
  Plus,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { useAuth } from "@/hooks/useAuth";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  suggestions?: string[];
  outfitRecommendation?: OutfitRecommendation;
}

interface OutfitRecommendation {
  id: string;
  title: string;
  description: string;
  items: OutfitItem[];
  occasion: string;
  weather: string;
  sustainabilityScore: number;
}

interface OutfitItem {
  id: string;
  name: string;
  category: string;
  image: string;
}

const initialMessages: Message[] = [
  {
    id: "1",
    role: "assistant",
    content: "Hi there! I'm your EcoFashion Stylist. I can help you create sustainable outfits based on your preferences, the weather, and upcoming events. What would you like to wear today?",
    timestamp: new Date(),
    suggestions: [
      "Recommend an outfit for a casual day out",
      "Suggest something for a formal event",
      "Show me sustainable summer outfits"
    ]
  }
];

const mockOutfits: OutfitRecommendation[] = [
  {
    id: "1",
    title: "Casual Weekend Look",
    description: "Perfect for a relaxed day out with friends",
    occasion: "Casual",
    weather: "Sunny",
    sustainabilityScore: 92,
    items: [
      {
        id: "101",
        name: "Organic Cotton T-Shirt",
        category: "Top",
        image: "/placeholder-tshirt.jpg"
      },
      {
        id: "102",
        name: "Recycled Denim Jeans",
        category: "Bottom",
        image: "/placeholder-jeans.jpg"
      },
      {
        id: "103",
        name: "Canvas Sneakers",
        category: "Shoes",
        image: "/placeholder-sneakers.jpg"
      }
    ]
  },
  {
    id: "2",
    title: "Eco-Chic Office Attire",
    description: "Professional yet sustainable work outfit",
    occasion: "Business",
    weather: "Cloudy",
    sustainabilityScore: 88,
    items: [
      {
        id: "201",
        name: "Hemp Blazer",
        category: "Outerwear",
        image: "/placeholder-blazer.jpg"
      },
      {
        id: "202",
        name: "Bamboo Fiber Blouse",
        category: "Top",
        image: "/placeholder-blouse.jpg"
      },
      {
        id: "203",
        name: "Organic Cotton Trousers",
        category: "Bottom",
        image: "/placeholder-trousers.jpg"
      }
    ]
  }
];

export default function EcoStylist() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [selectedOutfit, setSelectedOutfit] = useState<OutfitRecommendation | null>(null);
  const [showOutfitDetail, setShowOutfitDetail] = useState(false);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsTyping(true);

    // Simulate AI response after a delay
    setTimeout(() => {
      generateAIResponse(inputMessage);
    }, 1000);
  };

  const generateAIResponse = (userInput: string) => {
    let response: Message;
    
    // Simple keyword-based responses for demo
    if (userInput.toLowerCase().includes("casual") || userInput.toLowerCase().includes("day out")) {
      response = {
        id: Date.now().toString(),
        role: "assistant",
        content: "I found a perfect casual outfit for you! It's made from sustainable materials and perfect for a day out.",
        timestamp: new Date(),
        outfitRecommendation: mockOutfits[0],
        suggestions: [
          "Show me another casual option",
          "What about formal wear?",
          "Recommend based on today's weather"
        ]
      };
    } else if (userInput.toLowerCase().includes("formal") || userInput.toLowerCase().includes("business")) {
      response = {
        id: Date.now().toString(),
        role: "assistant",
        content: "Here's a professional yet eco-friendly outfit for your business meeting. It's made from sustainable fabrics and designed to make you look sharp!",
        timestamp: new Date(),
        outfitRecommendation: mockOutfits[1],
        suggestions: [
          "Show me another business option",
          "What about casual wear?",
          "Recommend based on today's weather"
        ]
      };
    } else if (userInput.toLowerCase().includes("summer") || userInput.toLowerCase().includes("hot")) {
      response = {
        id: Date.now().toString(),
        role: "assistant",
        content: "Here are some breezy summer options that are both comfortable and sustainable. These outfits use lightweight, breathable fabrics perfect for hot weather.",
        timestamp: new Date(),
        outfitRecommendation: mockOutfits[0],
        suggestions: [
          "Show me winter options",
          "What about rainy weather?",
          "Recommend accessories"
        ]
      };
    } else {
      response = {
        id: Date.now().toString(),
        role: "assistant",
        content: "I can help you find the perfect sustainable outfit! Based on your request, I recommend this eco-friendly option. It's made from ethically sourced materials and designed to last.",
        timestamp: new Date(),
        outfitRecommendation: mockOutfits[0],
        suggestions: [
          "Recommend a casual outfit",
          "Suggest something for work",
          "Show me sustainable accessories"
        ]
      };
    }

    setMessages(prev => [...prev, response]);
    setIsTyping(false);
  };

  const handleQuickSuggestion = (suggestion: string) => {
    setInputMessage(suggestion);
  };

  const handleViewOutfit = (outfit: OutfitRecommendation) => {
    setSelectedOutfit(outfit);
    setShowOutfitDetail(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-nature/5">
      <div className="container py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
              <Sparkles className="w-8 h-8 text-primary" />
              EcoFashion Stylist
            </h1>
            <p className="text-foreground/70 mt-2">
              Your AI-powered sustainable fashion assistant
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Chat Interface */}
          <div className="lg:col-span-2 flex flex-col h-[calc(100vh-200px)]">
            <Card className="flex-1 flex flex-col border-border/50 shadow-lg">
              <CardHeader className="border-b border-border/50">
                <CardTitle className="flex items-center gap-2">
                  <Bot className="w-5 h-5 text-primary" />
                  EcoFashion AI Assistant
                </CardTitle>
                <CardDescription>
                  Ask me about sustainable fashion, outfit recommendations, or styling tips
                </CardDescription>
              </CardHeader>
              
              <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <div 
                    key={message.id} 
                    className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div 
                      className={`max-w-[80%] rounded-lg p-4 ${
                        message.role === "user" 
                          ? "bg-primary text-primary-foreground" 
                          : "bg-muted"
                      }`}
                    >
                      <p>{message.content}</p>
                      
                      {message.outfitRecommendation && (
                        <Card className="mt-3 bg-background border-border/50">
                          <CardContent className="p-3">
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-bold">{message.outfitRecommendation.title}</h4>
                                <p className="text-sm text-foreground/70 mt-1">
                                  {message.outfitRecommendation.description}
                                </p>
                              </div>
                              <Badge variant="secondary">
                                {message.outfitRecommendation.sustainabilityScore}% eco-score
                              </Badge>
                            </div>
                            
                            <div className="flex items-center gap-2 mt-2 text-sm">
                              <Calendar className="w-4 h-4" />
                              <span>{message.outfitRecommendation.occasion}</span>
                              <Sun className="w-4 h-4 ml-2" />
                              <span>{message.outfitRecommendation.weather}</span>
                            </div>
                            
                            <div className="flex gap-2 mt-3">
                              {message.outfitRecommendation.items.map((item) => (
                                <div key={item.id} className="flex-1">
                                  <div className="bg-muted aspect-square rounded flex items-center justify-center">
                                    <Shirt className="w-6 h-6 text-foreground/50" />
                                  </div>
                                  <p className="text-xs mt-1 text-center truncate">{item.name}</p>
                                </div>
                              ))}
                            </div>
                            
                            <Button 
                              size="sm" 
                              className="w-full mt-3"
                              onClick={() => handleViewOutfit(message.outfitRecommendation!)}
                            >
                              View Details
                            </Button>
                          </CardContent>
                        </Card>
                      )}
                      
                      {message.suggestions && message.suggestions.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3">
                          {message.suggestions.map((suggestion, index) => (
                            <Button
                              key={index}
                              variant="outline"
                              size="sm"
                              onClick={() => handleQuickSuggestion(suggestion)}
                              className="text-xs"
                            >
                              {suggestion}
                            </Button>
                          ))}
                        </div>
                      )}
                      
                      <p className="text-xs opacity-70 mt-2">
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))}
                
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-muted rounded-lg p-4">
                      <div className="flex space-x-2">
                        <div className="w-2 h-2 rounded-full bg-foreground animate-bounce"></div>
                        <div className="w-2 h-2 rounded-full bg-foreground animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        <div className="w-2 h-2 rounded-full bg-foreground animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </CardContent>
              
              <div className="p-4 border-t border-border/50">
                <div className="flex gap-2">
                  <Input
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Ask about sustainable fashion, outfit recommendations..."
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    className="flex-1"
                  />
                  <Button 
                    onClick={handleSendMessage}
                    disabled={!inputMessage.trim()}
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
                
                <div className="flex gap-2 mt-2">
                  <Button variant="outline" size="sm">
                    <Image className="w-4 h-4 mr-1" />
                    Upload Image
                  </Button>
                  <Button variant="outline" size="sm">
                    <Sun className="w-4 h-4 mr-1" />
                    Weather-Based
                  </Button>
                </div>
              </div>
            </Card>
          </div>
          
          {/* Stylist Info and Tips */}
          <div className="space-y-6">
            <Card className="border-border/50 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bot className="w-5 h-5 text-primary" />
                  About Your Stylist
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-foreground/80">
                  I'm your AI-powered sustainable fashion assistant, trained to help you make eco-conscious clothing choices.
                </p>
                
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Heart className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <h4 className="font-medium">Sustainability Focus</h4>
                      <p className="text-sm text-foreground/70">
                        I prioritize eco-friendly materials and ethical brands
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <Zap className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <h4 className="font-medium">Personalized</h4>
                      <p className="text-sm text-foreground/70">
                        Recommendations based on your style preferences and needs
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <TrendingUp className="w-5 h-5 text-primary mt-0.5" />
                    <div>
                      <h4 className="font-medium">Trend Aware</h4>
                      <p className="text-sm text-foreground/70">
                        Up-to-date with sustainable fashion trends and innovations
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-border/50 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-primary" />
                  Popular Requests
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => handleQuickSuggestion("Recommend a sustainable outfit for a job interview")}
                >
                  Job Interview Outfit
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => handleQuickSuggestion("Show me eco-friendly workout clothes")}
                >
                  Workout Wear
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => handleQuickSuggestion("Suggest a zero-waste capsule wardrobe")}
                >
                  Capsule Wardrobe
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => handleQuickSuggestion("Recommend sustainable fabrics for summer")}
                >
                  Summer Fabrics
                </Button>
              </CardContent>
            </Card>
            
            <Card className="border-border/50 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  Eco Tips
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 bg-green-500/10 rounded-lg">
                  <h4 className="font-medium text-sm">Material Matters</h4>
                  <p className="text-xs text-foreground/70 mt-1">
                    Organic cotton uses 91% less water than conventional cotton
                  </p>
                </div>
                <div className="p-3 bg-blue-500/10 rounded-lg">
                  <h4 className="font-medium text-sm">Care Instructions</h4>
                  <p className="text-xs text-foreground/70 mt-1">
                    Wash clothes in cold water to save energy and preserve fibers
                  </p>
                </div>
                <div className="p-3 bg-amber-500/10 rounded-lg">
                  <h4 className="font-medium text-sm">Longevity Tips</h4>
                  <p className="text-xs text-foreground/70 mt-1">
                    Air dry clothes to extend their lifespan by up to 3 years
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      {/* Outfit Detail Modal */}
      <Dialog open={showOutfitDetail} onOpenChange={setShowOutfitDetail}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedOutfit && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedOutfit.title}</DialogTitle>
                <DialogDescription>
                  {selectedOutfit.description}
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">
                      {selectedOutfit.occasion}
                    </Badge>
                    <Badge variant="outline">
                      {selectedOutfit.weather}
                    </Badge>
                  </div>
                  <Badge className="bg-green-500/20 text-green-700 hover:bg-green-500/30">
                    {selectedOutfit.sustainabilityScore}% Eco-Score
                  </Badge>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {selectedOutfit.items.map((item) => (
                    <Card key={item.id}>
                      <CardContent className="p-4">
                        <div className="bg-muted aspect-square rounded-lg flex items-center justify-center mb-3">
                          <Shirt className="w-10 h-10 text-foreground/50" />
                        </div>
                        <h4 className="font-medium">{item.name}</h4>
                        <p className="text-sm text-foreground/70">{item.category}</p>
                        <div className="flex items-center gap-1 mt-2">
                          <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                          <span className="text-sm">4.8/5</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Sustainability Impact</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-green-500/10 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Leaf className="w-5 h-5 text-green-500" />
                        <span>Carbon Footprint</span>
                      </div>
                      <span className="font-medium">-2.5kg CO2</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-blue-500/10 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Droplets className="w-5 h-5 text-blue-500" />
                        <span>Water Saved</span>
                      </div>
                      <span className="font-medium">200L</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-amber-500/10 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Recycle className="w-5 h-5 text-amber-500" />
                        <span>Waste Prevented</span>
                      </div>
                      <span className="font-medium">1.2kg</span>
                    </div>
                  </CardContent>
                </Card>
                
                <div className="flex gap-2">
                  <Button className="flex-1">
                    <Plus className="w-4 h-4 mr-2" />
                    Add to Wardrobe
                  </Button>
                  <Button variant="outline">
                    Save for Later
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