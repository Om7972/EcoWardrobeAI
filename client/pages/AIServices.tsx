import { useState } from "react";
import Layout from "@/components/Layout";
import { useAI } from "@/hooks/useAI";
import { 
  Bot, 
  Send, 
  Sparkles,
  Loader2,
  MessageSquare,
  Lightbulb,
  TrendingUp,
  Leaf,
  Shirt,
  Image as ImageIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";
import { AIMessage } from "@/services/ai";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export default function AIServices() {
  const { chat, getStyleAdvice, getSustainabilityTips, loading } = useAI();
  
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content: "Hello! I'm your AI fashion assistant. I can help you with outfit suggestions, style advice, sustainability tips, and more. How can I assist you today?",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState("");
  const [activeService, setActiveService] = useState<string>("chat");

  const services = [
    {
      id: "chat",
      title: "AI Chat",
      description: "General fashion and style conversation",
      icon: MessageSquare,
      color: "text-blue-500"
    },
    {
      id: "style",
      title: "Style Advice",
      description: "Get personalized style recommendations",
      icon: Sparkles,
      color: "text-purple-500"
    },
    {
      id: "sustainability",
      title: "Eco Tips",
      description: "Sustainable fashion guidance",
      icon: Leaf,
      color: "text-green-500"
    },
    {
      id: "trends",
      title: "Trend Analysis",
      description: "Current fashion trends",
      icon: TrendingUp,
      color: "text-pink-500"
    }
  ];

  const quickPrompts = [
    "What colors go well with navy blue?",
    "How can I style a white t-shirt?",
    "What's the most sustainable fabric?",
    "Suggest a capsule wardrobe",
    "How to care for wool garments?",
    "What's business casual attire?"
  ];

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: ChatMessage = {
      role: "user",
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");

    const aiMessages: AIMessage[] = [
      {
        role: "system",
        content: "You are a helpful, friendly AI fashion stylist specializing in sustainable fashion. Provide practical, eco-conscious advice. Keep responses concise and actionable."
      },
      ...messages.map(msg => ({
        role: msg.role as "user" | "assistant",
        content: msg.content
      })),
      {
        role: "user",
        content: input
      }
    ];

    const response = await chat(aiMessages);
    
    if (response) {
      const assistantMessage: ChatMessage = {
        role: "assistant",
        content: response,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, assistantMessage]);
    }
  };

  const handleQuickPrompt = (prompt: string) => {
    setInput(prompt);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
        {/* Header */}
        <div className="bg-primary/5 border-b border-border/40">
          <div className="container max-w-7xl mx-auto px-4 py-12">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Bot className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-foreground">AI Dashboard</h1>
                <p className="text-foreground/70 mt-1">Your personal AI fashion assistant</p>
              </div>
            </div>
          </div>
        </div>

        <div className="container max-w-7xl mx-auto px-4 py-8">
          <div className="grid lg:grid-cols-4 gap-6">
            {/* Services Sidebar */}
            <div className="lg:col-span-1 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">AI Services</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {services.map(service => {
                    const Icon = service.icon;
                    return (
                      <Button
                        key={service.id}
                        variant={activeService === service.id ? "default" : "ghost"}
                        className="w-full justify-start"
                        onClick={() => setActiveService(service.id)}
                      >
                        <Icon className={`w-4 h-4 mr-2 ${service.color}`} />
                        <span className="text-sm">{service.title}</span>
                      </Button>
                    );
                  })}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Quick Prompts</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {quickPrompts.map((prompt, idx) => (
                    <Button
                      key={idx}
                      variant="outline"
                      size="sm"
                      className="w-full text-left justify-start h-auto py-2 px-3"
                      onClick={() => handleQuickPrompt(prompt)}
                    >
                      <Lightbulb className="w-3 h-3 mr-2 flex-shrink-0" />
                      <span className="text-xs">{prompt}</span>
                    </Button>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Chat Area */}
            <div className="lg:col-span-3">
              <Card className="flex flex-col" style={{ height: 'calc(100vh - 280px)', maxHeight: '700px' }}>
                <CardHeader className="flex-shrink-0">
                  <CardTitle className="flex items-center gap-2">
                    <Bot className="w-5 h-5 text-primary" />
                    AI Fashion Assistant
                  </CardTitle>
                  <CardDescription>
                    Ask me anything about fashion, style, or sustainability
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
                  {/* Messages */}
                  <ScrollArea className="flex-1 px-6">
                    <div className="space-y-4 py-4 min-h-0">
                      {messages.map((message, idx) => (
                        <div
                          key={idx}
                          className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                        >
                          <div
                            className={`max-w-[80%] rounded-lg px-4 py-3 ${
                              message.role === "user"
                                ? "bg-primary text-primary-foreground"
                                : "bg-muted"
                            }`}
                          >
                            <div className="flex items-start gap-2">
                              {message.role === "assistant" && (
                                <Bot className="w-5 h-5 mt-0.5 flex-shrink-0" />
                              )}
                              <div className="flex-1">
                                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                                <p className="text-xs opacity-70 mt-1">
                                  {message.timestamp.toLocaleTimeString()}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                      
                      {loading && (
                        <div className="flex justify-start">
                          <div className="bg-muted rounded-lg px-4 py-3">
                            <div className="flex items-center gap-2">
                              <Loader2 className="w-4 h-4 animate-spin" />
                              <span className="text-sm">AI is thinking...</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </ScrollArea>

                  {/* Input Area */}
                  <div className="border-t p-4 flex-shrink-0">
                    <div className="flex gap-2">
                      <Textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Ask me anything about fashion..."
                        className="min-h-[60px] resize-none"
                        disabled={loading}
                      />
                      <Button
                        onClick={handleSendMessage}
                        disabled={loading || !input.trim()}
                        size="icon"
                        className="h-[60px] w-[60px]"
                      >
                        {loading ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          <Send className="w-5 h-5" />
                        )}
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Press Enter to send, Shift+Enter for new line
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
