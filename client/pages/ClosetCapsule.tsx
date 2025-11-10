import { useState, useEffect } from "react";
import { 
  Package, 
  Plus, 
  Save, 
  Heart, 
  Share2, 
  Download, 
  Calendar,
  CheckCircle,
  Circle,
  Edit,
  Trash2,
  Sparkles,
  TrendingUp
} from "lucide-react";
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

interface ClothingItem {
  _id: string;
  userId: string;
  title: string;
  category: string;
  color: string[];
  brand?: string;
  material?: string[];
  description?: string;
  imageUrl?: string;
  ecoScore: number;
  purchaseDate?: string;
  createdAt: string;
  updatedAt: string;
}

interface CapsuleItem {
  clothingItemId: string;
  category: string;
  isEssential: boolean;
  notes: string;
  clothingItem: ClothingItem;
}

interface Capsule {
  _id: string;
  userId: string;
  title: string;
  description: string;
  purpose: "travel" | "seasonal" | "minimalist" | "professional" | "casual";
  items: CapsuleItem[];
  startDate: string;
  endDate: string;
  isPublic: boolean;
  likes: number;
  createdAt: string;
  updatedAt: string;
}

const purposeOptions = [
  { id: "travel", label: "Travel", emoji: "✈️" },
  { id: "seasonal", label: "Seasonal", emoji: "🌸" },
  { id: "minimalist", label: "Minimalist", emoji: "⚪" },
  { id: "professional", label: "Professional", emoji: "💼" },
  { id: "casual", label: "Casual", emoji: "👕" },
];

const categoryOptions = [
  "Tops", "Bottoms", "Dresses", "Outerwear", 
  "Shoes", "Accessories", "Undergarments", "Sleepwear"
];

export default function ClosetCapsule() {
  const { user } = useAuth();
  
  const [clothingItems, setClothingItems] = useState<ClothingItem[]>([]);
  const [selectedPurpose, setSelectedPurpose] = useState("");
  const [capsules, setCapsules] = useState<Capsule[]>([]);
  const [currentCapsule, setCurrentCapsule] = useState<Capsule | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [step, setStep] = useState(1); // Wizard steps: 1-purpose, 2-items, 3-review
  
  // Form states
  const [capsuleForm, setCapsuleForm] = useState({
    title: "",
    description: "",
    purpose: "",
    startDate: new Date().toISOString().split("T")[0],
    endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    isPublic: false,
    items: [] as CapsuleItem[]
  });

  useEffect(() => {
    fetchClothingItems();
    fetchCapsules();
  }, [user?.userId]);

  const fetchClothingItems = async () => {
    if (!user?.userId) return;
    
    try {
      setLoading(true);
      const response = await fetch(`/api/clothing/user/${user.userId}`);
      if (!response.ok) throw new Error("Failed to fetch clothing items");
      
      const data = await response.json();
      setClothingItems(data.data);
    } catch (error) {
      console.error("Error fetching clothing items:", error);
      toast.error("Failed to load your closet items");
    } finally {
      setLoading(false);
    }
  };

  const fetchCapsules = async () => {
    if (!user?.userId) return;
    
    try {
      const response = await fetch(`/api/capsules/user/${user.userId}`);
      if (!response.ok) throw new Error("Failed to fetch capsules");
      
      const data = await response.json();
      setCapsules(data.data);
    } catch (error) {
      console.error("Error fetching capsules:", error);
      toast.error("Failed to load capsules");
    }
  };

  const generateCapsule = async () => {
    if (!selectedPurpose || !user?.userId) return;
    
    try {
      setLoading(true);
      const response = await fetch("/api/capsules/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.userId,
          purpose: selectedPurpose,
          closetItems: clothingItems,
          maxItems: 15
        })
      });
      
      if (!response.ok) throw new Error("Failed to generate capsule");
      
      const data = await response.json();
      
      // Create a new capsule with the suggestions
      const newCapsule: Capsule = {
        _id: `temp-${Date.now()}`,
        userId: user.userId,
        title: data.data.title,
        description: `AI-generated ${selectedPurpose} capsule wardrobe`,
        purpose: selectedPurpose as any,
        items: data.data.items.map((item: any) => {
          const clothingItem = clothingItems.find(ci => ci._id === item.clothingItemId);
          return {
            ...item,
            clothingItem: clothingItem || ({} as ClothingItem)
          };
        }),
        startDate: data.data.startDate,
        endDate: data.data.endDate,
        isPublic: false,
        likes: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      setCurrentCapsule(newCapsule);
      setCapsuleForm({
        title: newCapsule.title,
        description: newCapsule.description,
        purpose: newCapsule.purpose,
        startDate: newCapsule.startDate.split("T")[0],
        endDate: newCapsule.endDate.split("T")[0],
        isPublic: newCapsule.isPublic,
        items: newCapsule.items
      });
      setIsCreating(true);
      setStep(2); // Move to items selection step
      toast.success("Capsule generated successfully!");
    } catch (error) {
      console.error("Error generating capsule:", error);
      toast.error("Failed to generate capsule");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveCapsule = async () => {
    if (!currentCapsule || !user?.userId) return;
    
    try {
      setSaving(true);
      const response = await fetch("/api/capsules", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...capsuleForm,
          userId: user.userId,
          purpose: capsuleForm.purpose,
          startDate: new Date(capsuleForm.startDate).toISOString(),
          endDate: new Date(capsuleForm.endDate).toISOString(),
          items: capsuleForm.items.map(item => ({
            clothingItemId: item.clothingItemId,
            category: item.category,
            isEssential: item.isEssential,
            notes: item.notes
          }))
        })
      });
      
      if (!response.ok) throw new Error("Failed to save capsule");
      
      const data = await response.json();
      setCurrentCapsule(data.data);
      setCapsules([data.data, ...capsules]);
      setIsCreating(false);
      setStep(1);
      toast.success("Capsule saved successfully!");
    } catch (error) {
      console.error("Error saving capsule:", error);
      toast.error("Failed to save capsule");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteCapsule = async (capsuleId: string) => {
    try {
      const response = await fetch(`/api/capsules/${capsuleId}`, {
        method: "DELETE"
      });
      
      if (!response.ok) throw new Error("Failed to delete capsule");
      
      setCapsules(capsules.filter(c => c._id !== capsuleId));
      if (currentCapsule?._id === capsuleId) {
        setCurrentCapsule(null);
      }
      toast.success("Capsule deleted successfully!");
    } catch (error) {
      console.error("Error deleting capsule:", error);
      toast.error("Failed to delete capsule");
    }
  };

  const handleAddToCapsule = (clothingItem: ClothingItem) => {
    // Check if item is already in capsule
    if (capsuleForm.items.some(item => item.clothingItemId === clothingItem._id)) {
      toast.info("Item already in capsule");
      return;
    }
    
    const newItem: CapsuleItem = {
      clothingItemId: clothingItem._id,
      category: clothingItem.category,
      isEssential: false,
      notes: "",
      clothingItem
    };
    
    setCapsuleForm({
      ...capsuleForm,
      items: [...capsuleForm.items, newItem]
    });
    
    toast.success("Item added to capsule");
  };

  const handleRemoveFromCapsule = (clothingItemId: string) => {
    setCapsuleForm({
      ...capsuleForm,
      items: capsuleForm.items.filter(item => item.clothingItemId !== clothingItemId)
    });
    
    toast.success("Item removed from capsule");
  };

  const handleToggleEssential = (clothingItemId: string) => {
    setCapsuleForm({
      ...capsuleForm,
      items: capsuleForm.items.map(item => 
        item.clothingItemId === clothingItemId 
          ? { ...item, isEssential: !item.isEssential } 
          : item
      )
    });
  };

  const handleLikeCapsule = async (capsuleId: string) => {
    try {
      const response = await fetch(`/api/capsules/${capsuleId}/like`, {
        method: "PUT"
      });
      
      if (!response.ok) throw new Error("Failed to like capsule");
      
      // Update the capsule in state
      setCapsules(capsules.map(c => 
        c._id === capsuleId 
          ? { ...c, likes: c.likes + 1 } 
          : c
      ));
      
      toast.success("Liked!");
    } catch (error) {
      console.error("Error liking capsule:", error);
      toast.error("Failed to like capsule");
    }
  };

  // Group clothing items by category
  const groupedClothingItems = categoryOptions.reduce((acc, category) => {
    acc[category] = clothingItems.filter(item => 
      item.category.toLowerCase() === category.toLowerCase()
    );
    return acc;
  }, {} as Record<string, ClothingItem[]>);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-nature/5">
      <div className="container py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
              <Package className="w-8 h-8 text-primary" />
              Closet Capsule Builder
            </h1>
            <p className="text-foreground/70 mt-2">
              Create a curated 10-15 piece capsule wardrobe for any occasion
            </p>
          </div>
          
          {!isCreating && (
            <div className="flex gap-2">
              <Select value={selectedPurpose} onValueChange={setSelectedPurpose}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Select purpose" />
                </SelectTrigger>
                <SelectContent>
                  {purposeOptions.map((purpose) => (
                    <SelectItem key={purpose.id} value={purpose.id}>
                      <span className="flex items-center gap-2">
                        <span>{purpose.emoji}</span>
                        <span>{purpose.label}</span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Button 
                onClick={generateCapsule} 
                disabled={!selectedPurpose || loading}
                className="animate-pulseGlow"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                {loading ? "Generating..." : "Generate"}
              </Button>
            </div>
          )}
        </div>

        {isCreating ? (
          <div className="space-y-6">
            {/* Progress Bar */}
            <Card className="border-border/50 shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold">Create Your Capsule</h2>
                  <Badge variant="secondary">
                    Step {step} of 3
                  </Badge>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-sm font-medium ${step >= 1 ? "text-primary" : "text-foreground/50"}`}>
                        Purpose
                      </span>
                      {step > 1 && <CheckCircle className="w-4 h-4 text-green-500" />}
                    </div>
                    <div className="h-2 bg-muted rounded-full">
                      <div className={`h-full rounded-full ${step >= 1 ? "bg-primary" : "bg-muted"}`} style={{ width: step >= 1 ? "100%" : "0%" }}></div>
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-sm font-medium ${step >= 2 ? "text-primary" : "text-foreground/50"}`}>
                        Select Items
                      </span>
                      {step > 2 && <CheckCircle className="w-4 h-4 text-green-500" />}
                    </div>
                    <div className="h-2 bg-muted rounded-full">
                      <div className={`h-full rounded-full ${step >= 2 ? "bg-primary" : "bg-muted"}`} style={{ width: step >= 2 ? "100%" : "0%" }}></div>
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-sm font-medium ${step >= 3 ? "text-primary" : "text-foreground/50"}`}>
                        Review & Save
                      </span>
                    </div>
                    <div className="h-2 bg-muted rounded-full">
                      <div className={`h-full rounded-full ${step >= 3 ? "bg-primary" : "bg-muted"}`} style={{ width: step >= 3 ? "100%" : "0%" }}></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Step 1: Purpose & Details */}
            {step === 1 && (
              <Card className="border-border/50 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Edit className="w-5 h-5 text-primary" />
                    Capsule Details
                  </CardTitle>
                  <CardDescription>
                    Define the purpose and timeframe for your capsule wardrobe
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="title">Capsule Title</Label>
                      <Input
                        id="title"
                        value={capsuleForm.title}
                        onChange={(e) => setCapsuleForm({...capsuleForm, title: e.target.value})}
                        placeholder="e.g., Summer Minimalist Capsule"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="purpose">Purpose</Label>
                      <Select 
                        value={capsuleForm.purpose} 
                        onValueChange={(value) => setCapsuleForm({...capsuleForm, purpose: value})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select purpose" />
                        </SelectTrigger>
                        <SelectContent>
                          {purposeOptions.map((purpose) => (
                            <SelectItem key={purpose.id} value={purpose.id}>
                              <span className="flex items-center gap-2">
                                <span>{purpose.emoji}</span>
                                <span>{purpose.label}</span>
                              </span>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={capsuleForm.description}
                      onChange={(e) => setCapsuleForm({...capsuleForm, description: e.target.value})}
                      placeholder="Describe your capsule wardrobe..."
                      className="min-h-[100px]"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <Label htmlFor="startDate">Start Date</Label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-3 w-4 h-4 text-foreground/50" />
                        <Input
                          id="startDate"
                          type="date"
                          value={capsuleForm.startDate}
                          onChange={(e) => setCapsuleForm({...capsuleForm, startDate: e.target.value})}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="endDate">End Date</Label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-3 w-4 h-4 text-foreground/50" />
                        <Input
                          id="endDate"
                          type="date"
                          value={capsuleForm.endDate}
                          onChange={(e) => setCapsuleForm({...capsuleForm, endDate: e.target.value})}
                          className="pl-10"
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="isPublic"
                        checked={capsuleForm.isPublic}
                        onChange={(e) => setCapsuleForm({...capsuleForm, isPublic: e.target.checked})}
                        className="rounded border-border/50"
                        aria-label="Make this capsule public"
                      />
                      <Label htmlFor="isPublic">Make this capsule public</Label>
                    </div>
                    
                    <Button onClick={() => setStep(2)}>
                      Next: Select Items
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 2: Select Items */}
            {step === 2 && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Clothing Items Panel */}
                <div className="lg:col-span-2">
                  <Card className="border-border/50 shadow-lg h-full">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-primary" />
                        Select Items for Your Capsule
                      </CardTitle>
                      <CardDescription>
                        Choose 10-15 items from your closet. {capsuleForm.items.length}/15 selected.
                      </CardDescription>
                    </CardHeader>
                    
                    <CardContent className="space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto">
                      {Object.entries(groupedClothingItems).map(([category, items]) => (
                        items.length > 0 && (
                          <div key={category}>
                            <h3 className="font-semibold text-lg mb-3 flex items-center gap-2">
                              <span className="capitalize">{category}</span>
                              <Badge variant="secondary">{items.length}</Badge>
                            </h3>
                            
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                              {items.map((item) => {
                                const isInCapsule = capsuleForm.items.some(ci => ci.clothingItemId === item._id);
                                return (
                                  <div 
                                    key={item._id} 
                                    className={`border rounded-lg p-3 cursor-pointer transition-all ${
                                      isInCapsule 
                                        ? "border-primary bg-primary/5 ring-2 ring-primary/20" 
                                        : "border-border/50 hover:shadow-md"
                                    }`}
                                    onClick={() => 
                                      isInCapsule 
                                        ? handleRemoveFromCapsule(item._id) 
                                        : handleAddToCapsule(item)
                                    }
                                  >
                                    <div className="aspect-square bg-muted rounded-md mb-2 flex items-center justify-center overflow-hidden">
                                      {item.imageUrl ? (
                                        <img 
                                          src={item.imageUrl} 
                                          alt={item.title} 
                                          className="w-full h-full object-cover"
                                        />
                                      ) : (
                                        <div className="bg-muted-foreground/10 w-full h-full flex items-center justify-center">
                                          <span className="text-2xl">👕</span>
                                        </div>
                                      )}
                                    </div>
                                    <h3 className="font-medium text-sm truncate">{item.title}</h3>
                                    <p className="text-xs text-foreground/70 truncate">{item.category}</p>
                                    <div className="flex items-center justify-between mt-2">
                                      <Badge variant="secondary" className="text-xs">
                                        {item.ecoScore}/100
                                      </Badge>
                                      {isInCapsule && (
                                        <CheckCircle className="w-4 h-4 text-green-500" />
                                      )}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )
                      ))}
                    </CardContent>
                  </Card>
                </div>

                {/* Capsule Items Preview */}
                <div className="lg:col-span-1">
                  <Card className="border-border/50 shadow-lg h-full">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Package className="w-5 h-5 text-primary" />
                        Capsule Preview
                      </CardTitle>
                      <CardDescription>
                        {capsuleForm.items.length} items selected
                      </CardDescription>
                    </CardHeader>
                    
                    <CardContent className="space-y-4 max-h-[calc(100vh-300px)] overflow-y-auto">
                      {capsuleForm.items.length > 0 ? (
                        <div className="space-y-3">
                          {capsuleForm.items.map((item) => (
                            <div 
                              key={item.clothingItemId} 
                              className="border border-border/50 rounded-lg p-3 flex items-center gap-3"
                            >
                              <div className="aspect-square bg-muted rounded-md w-12 h-12 flex items-center justify-center overflow-hidden">
                                {item.clothingItem.imageUrl ? (
                                  <img 
                                    src={item.clothingItem.imageUrl} 
                                    alt={item.clothingItem.title} 
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <span className="text-lg">👕</span>
                                )}
                              </div>
                              
                              <div className="flex-1 min-w-0">
                                <h3 className="font-medium text-sm truncate">{item.clothingItem.title}</h3>
                                <p className="text-xs text-foreground/70 truncate">{item.clothingItem.category}</p>
                              </div>
                              
                              <div className="flex flex-col items-end gap-1">
                                <Button 
                                  size="sm" 
                                  variant="ghost" 
                                  className="h-6 w-6 p-0"
                                  onClick={() => handleToggleEssential(item.clothingItemId)}
                                >
                                  {item.isEssential ? (
                                    <CheckCircle className="w-4 h-4 text-green-500" />
                                  ) : (
                                    <Circle className="w-4 h-4" />
                                  )}
                                </Button>
                                <Button 
                                  size="sm" 
                                  variant="ghost" 
                                  className="h-6 w-6 p-0 text-destructive"
                                  onClick={() => handleRemoveFromCapsule(item.clothingItemId)}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <Package className="w-12 h-12 text-foreground/20 mx-auto mb-4" />
                          <h3 className="font-medium text-foreground mb-1">No Items Selected</h3>
                          <p className="text-sm text-foreground/70">
                            Add items from your closet to build your capsule
                          </p>
                        </div>
                      )}
                      
                      <div className="flex gap-2 mt-4">
                        <Button 
                          variant="outline" 
                          onClick={() => setStep(1)}
                        >
                          Back
                        </Button>
                        <Button 
                          onClick={() => setStep(3)}
                          disabled={capsuleForm.items.length === 0}
                          className="flex-1"
                        >
                          Review & Save
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}

            {/* Step 3: Review & Save */}
            {step === 3 && (
              <div className="space-y-6">
                <Card className="border-border/50 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-primary" />
                      Review Your Capsule
                    </CardTitle>
                    <CardDescription>
                      Make sure everything looks good before saving
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="font-semibold text-lg mb-2">Capsule Details</h3>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-foreground/70">Title:</span>
                            <span className="font-medium">{capsuleForm.title}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-foreground/70">Purpose:</span>
                            <span className="font-medium capitalize">{capsuleForm.purpose}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-foreground/70">Duration:</span>
                            <span className="font-medium">
                              {new Date(capsuleForm.startDate).toLocaleDateString()} - 
                              {new Date(capsuleForm.endDate).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-foreground/70">Items:</span>
                            <span className="font-medium">{capsuleForm.items.length}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-foreground/70">Public:</span>
                            <span className="font-medium">
                              {capsuleForm.isPublic ? "Yes" : "No"}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="font-semibold text-lg mb-2">Description</h3>
                        <p className="text-foreground/80">
                          {capsuleForm.description || "No description provided"}
                        </p>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold text-lg mb-3">Capsule Items ({capsuleForm.items.length})</h3>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {capsuleForm.items.map((item) => (
                          <div 
                            key={item.clothingItemId} 
                            className="border border-border/50 rounded-lg p-3"
                          >
                            <div className="aspect-square bg-muted rounded-md mb-2 flex items-center justify-center overflow-hidden">
                              {item.clothingItem.imageUrl ? (
                                <img 
                                  src={item.clothingItem.imageUrl} 
                                  alt={item.clothingItem.title} 
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <span className="text-2xl">👕</span>
                              )}
                            </div>
                            <h3 className="font-medium text-sm truncate">{item.clothingItem.title}</h3>
                            <div className="flex items-center justify-between mt-1">
                              <Badge variant="secondary" className="text-xs">
                                {item.clothingItem.ecoScore}/100
                              </Badge>
                              {item.isEssential && (
                                <Badge variant="outline" className="text-xs">
                                  Essential
                                </Badge>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button 
                        variant="outline" 
                        onClick={() => setStep(2)}
                      >
                        Back
                      </Button>
                      <Button 
                        onClick={handleSaveCapsule}
                        disabled={saving}
                        className="flex-1"
                      >
                        {saving ? "Saving..." : "Save Capsule"}
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={() => {
                          setIsCreating(false);
                          setStep(1);
                          setCurrentCapsule(null);
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Saved Capsules */}
            <div className="lg:col-span-2">
              <Card className="border-border/50 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="w-5 h-5 text-primary" />
                    Your Capsule Wardrobes
                  </CardTitle>
                  <CardDescription>
                    Curated collections of your favorite items
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto">
                  {capsules.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {capsules.map((capsule) => (
                        <div 
                          key={capsule._id} 
                          className="border border-border/50 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                          onClick={() => {
                            setCurrentCapsule(capsule);
                            setCapsuleForm({
                              title: capsule.title,
                              description: capsule.description,
                              purpose: capsule.purpose,
                              startDate: capsule.startDate.split("T")[0],
                              endDate: capsule.endDate.split("T")[0],
                              isPublic: capsule.isPublic,
                              items: capsule.items
                            });
                            setIsCreating(true);
                            setStep(3);
                          }}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-semibold text-lg">{capsule.title}</h3>
                              <div className="flex items-center gap-2 mt-1">
                                <Badge variant="secondary" className="capitalize">
                                  {capsule.purpose}
                                </Badge>
                                {capsule.isPublic && (
                                  <Badge variant="outline">
                                    Public
                                  </Badge>
                                )}
                              </div>
                            </div>
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              className="h-6 w-6 p-0"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleLikeCapsule(capsule._id);
                              }}
                            >
                              <Heart className="w-3 h-3" />
                            </Button>
                          </div>
                          
                          <p className="text-sm text-foreground/70 mt-2 line-clamp-2">
                            {capsule.description}
                          </p>
                          
                          <div className="flex items-center justify-between mt-3">
                            <span className="text-xs text-foreground/70">
                              {new Date(capsule.startDate).toLocaleDateString()} - 
                              {new Date(capsule.endDate).toLocaleDateString()}
                            </span>
                            <div className="flex items-center gap-1 text-xs text-foreground/70">
                              <Package className="w-3 h-3" />
                              <span>{capsule.items.length} items</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between mt-2">
                            <div className="flex gap-1">
                              {capsule.items.slice(0, 3).map((item) => (
                                <div 
                                  key={item.clothingItemId} 
                                  className="w-6 h-6 rounded border border-border/50 overflow-hidden"
                                >
                                  {item.clothingItem.imageUrl ? (
                                    <img 
                                      src={item.clothingItem.imageUrl} 
                                      alt={item.clothingItem.title} 
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <div className="bg-muted w-full h-full flex items-center justify-center">
                                      <span className="text-[6px]">👕</span>
                                    </div>
                                  )}
                                </div>
                              ))}
                              {capsule.items.length > 3 && (
                                <div className="w-6 h-6 rounded border border-border/50 bg-muted flex items-center justify-center">
                                  <span className="text-[8px]">+{capsule.items.length - 3}</span>
                                </div>
                              )}
                            </div>
                            <div className="flex items-center gap-1 text-xs text-foreground/70">
                              <Heart className="w-3 h-3" />
                              <span>{capsule.likes}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Package className="w-16 h-16 text-foreground/20 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-foreground mb-2">No Capsules Yet</h3>
                      <p className="text-foreground/70 mb-4">
                        Create your first capsule wardrobe to get started
                      </p>
                      <div className="flex flex-col sm:flex-row gap-2 justify-center">
                        <Select value={selectedPurpose} onValueChange={setSelectedPurpose}>
                          <SelectTrigger className="w-48 mx-auto">
                            <SelectValue placeholder="Select purpose" />
                          </SelectTrigger>
                          <SelectContent>
                            {purposeOptions.map((purpose) => (
                              <SelectItem key={purpose.id} value={purpose.id}>
                                <span className="flex items-center gap-2">
                                  <span>{purpose.emoji}</span>
                                  <span>{purpose.label}</span>
                                </span>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Button 
                          onClick={generateCapsule} 
                          disabled={!selectedPurpose || loading}
                          className="mx-auto"
                        >
                          <Sparkles className="w-4 h-4 mr-2" />
                          {loading ? "Generating..." : "Generate Capsule"}
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <div className="lg:col-span-1">
              <Card className="border-border/50 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-primary" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    {purposeOptions.map((purpose) => (
                      <Button
                        key={purpose.id}
                        variant="outline"
                        className="w-full justify-start"
                        onClick={() => {
                          setSelectedPurpose(purpose.id);
                          generateCapsule();
                        }}
                        disabled={loading}
                      >
                        <span className="mr-2">{purpose.emoji}</span>
                        {purpose.label} Capsule
                      </Button>
                    ))}
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="font-semibold mb-2">Capsule Tips</h3>
                    <ul className="text-sm space-y-1 text-foreground/70">
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>Choose versatile pieces that mix and match</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>Consider your lifestyle and daily activities</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span>Include 1-2 statement pieces for personality</span>
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}