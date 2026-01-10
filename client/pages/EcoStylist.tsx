import { useState } from "react";
import Layout from "@/components/Layout";
import { useAI } from "@/hooks/useAI";
import { 
  Sparkles, 
  User, 
  Palette,
  Ruler,
  Heart,
  TrendingUp,
  Leaf,
  Loader2,
  CheckCircle,
  ArrowRight
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

export default function EcoStylist() {
  const { getStyleAdvice, loading } = useAI();
  
  const [step, setStep] = useState(1);
  const [profile, setProfile] = useState({
    bodyType: "",
    height: "",
    skinTone: "",
    hairColor: "",
    styleGoals: [] as string[],
    budget: "",
    sustainabilityLevel: ""
  });
  const [styleAdvice, setStyleAdvice] = useState("");

  const bodyTypes = ["Pear", "Apple", "Hourglass", "Rectangle", "Inverted Triangle"];
  const skinTones = ["Fair", "Light", "Medium", "Olive", "Tan", "Deep"];
  const hairColors = ["Blonde", "Brown", "Black", "Red", "Gray", "Other"];
  const budgetRanges = ["Budget-Friendly", "Mid-Range", "Premium", "Luxury"];
  const sustainabilityLevels = ["Beginner", "Intermediate", "Advanced", "Expert"];
  
  const styleGoalOptions = [
    "Look more professional",
    "Develop personal style",
    "Dress for body type",
    "Build capsule wardrobe",
    "Sustainable fashion",
    "Mix & match better",
    "Accessorize effectively",
    "Dress for occasions"
  ];

  const toggleStyleGoal = (goal: string) => {
    setProfile(prev => ({
      ...prev,
      styleGoals: prev.styleGoals.includes(goal)
        ? prev.styleGoals.filter(g => g !== goal)
        : [...prev.styleGoals, goal]
    }));
  };

  const handleGetAdvice = async () => {
    if (!profile.bodyType || !profile.skinTone || profile.styleGoals.length === 0) {
      toast.error("Please complete your profile");
      return;
    }

    const query = `I need personalized style advice. Here's my profile:
- Body Type: ${profile.bodyType}
- Height: ${profile.height || "Not specified"}
- Skin Tone: ${profile.skinTone}
- Hair Color: ${profile.hairColor}
- Style Goals: ${profile.styleGoals.join(", ")}
- Budget: ${profile.budget}
- Sustainability Level: ${profile.sustainabilityLevel}

Please provide:
1. Colors that complement my features
2. Clothing styles that flatter my body type
3. Sustainable fashion recommendations
4. Specific outfit ideas
5. Shopping tips within my budget`;

    const advice = await getStyleAdvice(query);
    if (advice) {
      setStyleAdvice(advice);
      setStep(3);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
        {/* Header */}
        <div className="bg-primary/5 border-b border-border/40">
          <div className="container max-w-5xl mx-auto px-4 py-12">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Sparkles className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-foreground">Virtual Stylist</h1>
                <p className="text-foreground/70 mt-1">Get personalized style advice from AI</p>
              </div>
            </div>
          </div>
        </div>

        <div className="container max-w-5xl mx-auto px-4 py-8">
          {/* Progress Steps */}
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center gap-4">
              <div className={`flex items-center gap-2 ${step >= 1 ? "text-primary" : "text-muted-foreground"}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                  {step > 1 ? <CheckCircle className="w-5 h-5" /> : "1"}
                </div>
                <span className="text-sm font-medium">Profile</span>
              </div>
              <ArrowRight className="w-4 h-4 text-muted-foreground" />
              <div className={`flex items-center gap-2 ${step >= 2 ? "text-primary" : "text-muted-foreground"}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                  {step > 2 ? <CheckCircle className="w-5 h-5" /> : "2"}
                </div>
                <span className="text-sm font-medium">Preferences</span>
              </div>
              <ArrowRight className="w-4 h-4 text-muted-foreground" />
              <div className={`flex items-center gap-2 ${step >= 3 ? "text-primary" : "text-muted-foreground"}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 3 ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                  {step > 3 ? <CheckCircle className="w-5 h-5" /> : "3"}
                </div>
                <span className="text-sm font-medium">Advice</span>
              </div>
            </div>
          </div>

          {/* Step 1: Basic Profile */}
          {step === 1 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5 text-primary" />
                  Your Profile
                </CardTitle>
                <CardDescription>Tell us about yourself</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Body Type *</Label>
                    <Select value={profile.bodyType} onValueChange={(value) => setProfile(prev => ({ ...prev, bodyType: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select body type" />
                      </SelectTrigger>
                      <SelectContent>
                        {bodyTypes.map(type => (
                          <SelectItem key={type} value={type}>{type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Height</Label>
                    <Input
                      placeholder="e.g., 5'6&quot; or 168cm"
                      value={profile.height}
                      onChange={(e) => setProfile(prev => ({ ...prev, height: e.target.value }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Skin Tone *</Label>
                    <Select value={profile.skinTone} onValueChange={(value) => setProfile(prev => ({ ...prev, skinTone: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select skin tone" />
                      </SelectTrigger>
                      <SelectContent>
                        {skinTones.map(tone => (
                          <SelectItem key={tone} value={tone}>{tone}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Hair Color</Label>
                    <Select value={profile.hairColor} onValueChange={(value) => setProfile(prev => ({ ...prev, hairColor: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select hair color" />
                      </SelectTrigger>
                      <SelectContent>
                        {hairColors.map(color => (
                          <SelectItem key={color} value={color}>{color}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button onClick={() => setStep(2)} className="w-full">
                  Continue
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Step 2: Preferences */}
          {step === 2 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-primary" />
                  Style Preferences
                </CardTitle>
                <CardDescription>What are your fashion goals?</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label>Style Goals * (Select all that apply)</Label>
                  <div className="grid md:grid-cols-2 gap-2">
                    {styleGoalOptions.map(goal => (
                      <Badge
                        key={goal}
                        variant={profile.styleGoals.includes(goal) ? "default" : "outline"}
                        className="cursor-pointer justify-start py-2 px-3"
                        onClick={() => toggleStyleGoal(goal)}
                      >
                        {goal}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Budget Range</Label>
                    <Select value={profile.budget} onValueChange={(value) => setProfile(prev => ({ ...prev, budget: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select budget" />
                      </SelectTrigger>
                      <SelectContent>
                        {budgetRanges.map(range => (
                          <SelectItem key={range} value={range}>{range}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="flex items-center gap-2">
                      <Leaf className="w-4 h-4 text-primary" />
                      Sustainability Level
                    </Label>
                    <Select value={profile.sustainabilityLevel} onValueChange={(value) => setProfile(prev => ({ ...prev, sustainabilityLevel: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select level" />
                      </SelectTrigger>
                      <SelectContent>
                        {sustainabilityLevels.map(level => (
                          <SelectItem key={level} value={level}>{level}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                    Back
                  </Button>
                  <Button onClick={handleGetAdvice} disabled={loading} className="flex-1">
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        Get Style Advice
                        <Sparkles className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Step 3: Results */}
          {step === 3 && styleAdvice && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  Your Personalized Style Guide
                </CardTitle>
                <CardDescription>AI-powered recommendations just for you</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="prose prose-sm max-w-none">
                  <div className="whitespace-pre-wrap text-foreground/90">
                    {styleAdvice}
                  </div>
                </div>

                <div className="flex gap-2 pt-4 border-t">
                  <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                    Start Over
                  </Button>
                  <Button onClick={handleGetAdvice} disabled={loading} className="flex-1">
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Regenerating...
                      </>
                    ) : (
                      <>
                        Get New Advice
                        <Sparkles className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </Layout>
  );
}
