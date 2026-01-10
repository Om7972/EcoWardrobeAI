import { useState } from "react";
import Layout from "@/components/Layout";
import { useAI } from "@/hooks/useAI";
import { 
  Sparkles, 
  Shirt, 
  Cloud, 
  Sun, 
  CloudRain,
  Wind,
  Calendar,
  MapPin,
  Loader2,
  Heart,
  Save,
  Share2,
  RefreshCw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export default function OutfitGenerator() {
  const { getOutfitSuggestion, loading } = useAI();
  
  const [occasion, setOccasion] = useState("");
  const [weather, setWeather] = useState("");
  const [style, setStyle] = useState("");
  const [items, setItems] = useState<string[]>([]);
  const [suggestion, setSuggestion] = useState("");
  const [customItems, setCustomItems] = useState("");

  const occasions = [
    "Casual Day Out",
    "Work/Office",
    "Formal Event",
    "Date Night",
    "Gym/Workout",
    "Beach/Pool",
    "Party/Club",
    "Wedding",
    "Job Interview",
    "Brunch",
    "Travel",
    "Shopping"
  ];

  const weatherOptions = [
    { value: "sunny", label: "Sunny & Warm", icon: Sun },
    { value: "cloudy", label: "Cloudy", icon: Cloud },
    { value: "rainy", label: "Rainy", icon: CloudRain },
    { value: "cold", label: "Cold", icon: Wind }
  ];

  const stylePreferences = [
    "Casual",
    "Formal",
    "Business Casual",
    "Streetwear",
    "Minimalist",
    "Bohemian",
    "Vintage",
    "Athletic",
    "Preppy",
    "Edgy"
  ];

  const defaultItems = [
    "White T-shirt",
    "Blue Jeans",
    "Black Dress",
    "Blazer",
    "Sneakers",
    "Boots",
    "Cardigan",
    "Skirt",
    "Shorts",
    "Jacket"
  ];

  const handleGenerateOutfit = async () => {
    if (!occasion || !weather || !style) {
      toast.error("Please select occasion, weather, and style");
      return;
    }

    const itemsList = customItems 
      ? customItems.split(",").map(item => item.trim()).filter(Boolean)
      : items.length > 0 
        ? items 
        : defaultItems;

    if (itemsList.length === 0) {
      toast.error("Please select or add some clothing items");
      return;
    }

    const result = await getOutfitSuggestion(occasion, weather, style, itemsList);
    if (result) {
      setSuggestion(result);
    }
  };

  const toggleItem = (item: string) => {
    setItems(prev => 
      prev.includes(item) 
        ? prev.filter(i => i !== item)
        : [...prev, item]
    );
  };

  const handleSaveOutfit = () => {
    if (!suggestion) {
      toast.error("Generate an outfit first");
      return;
    }
    toast.success("Outfit saved to your collection!");
  };

  const handleShareOutfit = () => {
    if (!suggestion) {
      toast.error("Generate an outfit first");
      return;
    }
    navigator.clipboard.writeText(suggestion);
    toast.success("Outfit copied to clipboard!");
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
        {/* Header */}
        <div className="bg-primary/5 border-b border-border/40">
          <div className="container max-w-7xl mx-auto px-4 py-12">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Sparkles className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-foreground">AI Outfit Generator</h1>
                <p className="text-foreground/70 mt-1">Get personalized outfit suggestions powered by AI</p>
              </div>
            </div>
          </div>
        </div>

        <div className="container max-w-7xl mx-auto px-4 py-8">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Input Section */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-primary" />
                    Occasion
                  </CardTitle>
                  <CardDescription>What's the event or activity?</CardDescription>
                </CardHeader>
                <CardContent>
                  <Select value={occasion} onValueChange={setOccasion}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select occasion" />
                    </SelectTrigger>
                    <SelectContent>
                      {occasions.map(occ => (
                        <SelectItem key={occ} value={occ}>{occ}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Cloud className="w-5 h-5 text-primary" />
                    Weather
                  </CardTitle>
                  <CardDescription>Current weather conditions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-3">
                    {weatherOptions.map(({ value, label, icon: Icon }) => (
                      <Button
                        key={value}
                        variant={weather === value ? "default" : "outline"}
                        className="h-auto py-4 flex flex-col gap-2"
                        onClick={() => setWeather(value)}
                      >
                        <Icon className="w-6 h-6" />
                        <span className="text-sm">{label}</span>
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shirt className="w-5 h-5 text-primary" />
                    Style Preference
                  </CardTitle>
                  <CardDescription>Your preferred style</CardDescription>
                </CardHeader>
                <CardContent>
                  <Select value={style} onValueChange={setStyle}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select style" />
                    </SelectTrigger>
                    <SelectContent>
                      {stylePreferences.map(s => (
                        <SelectItem key={s} value={s}>{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Available Items</CardTitle>
                  <CardDescription>Select items from your wardrobe or add custom ones</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {defaultItems.map(item => (
                      <Badge
                        key={item}
                        variant={items.includes(item) ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => toggleItem(item)}
                      >
                        {item}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Or add custom items (comma-separated)</Label>
                    <Textarea
                      placeholder="e.g., Red sweater, Black pants, White sneakers"
                      value={customItems}
                      onChange={(e) => setCustomItems(e.target.value)}
                      rows={3}
                    />
                  </div>
                </CardContent>
              </Card>

              <Button 
                onClick={handleGenerateOutfit} 
                disabled={loading}
                className="w-full h-12 text-lg"
                size="lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-2" />
                    Generate Outfit
                  </>
                )}
              </Button>
            </div>

            {/* Output Section */}
            <div className="space-y-6">
              <Card className="min-h-[600px]">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>AI Suggestion</span>
                    {suggestion && (
                      <div className="flex gap-2">
                        <Button variant="ghost" size="icon" onClick={handleSaveOutfit}>
                          <Save className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={handleShareOutfit}>
                          <Share2 className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={handleGenerateOutfit}>
                          <RefreshCw className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                  </CardTitle>
                  <CardDescription>
                    {suggestion ? "Your personalized outfit recommendation" : "Configure options and generate"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                      <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
                      <p className="text-muted-foreground">Creating your perfect outfit...</p>
                    </div>
                  ) : suggestion ? (
                    <div className="space-y-4">
                      <div className="prose prose-sm max-w-none">
                        <div className="whitespace-pre-wrap text-foreground/90">
                          {suggestion}
                        </div>
                      </div>
                      
                      <div className="pt-4 border-t">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                          <MapPin className="w-4 h-4" />
                          <span>Occasion: {occasion}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                          <Cloud className="w-4 h-4" />
                          <span>Weather: {weather}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Shirt className="w-4 h-4" />
                          <span>Style: {style}</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                      <Sparkles className="w-16 h-16 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-semibold mb-2">Ready to Create</h3>
                      <p className="text-muted-foreground max-w-sm">
                        Select your occasion, weather, style, and items to get AI-powered outfit suggestions
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {suggestion && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Sustainability Tip</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      💚 By mixing and matching existing items, you're reducing fashion waste and your carbon footprint!
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
