import { useState, useEffect, useRef } from "react";
import { 
  Sparkles, 
  Plus, 
  Save, 
  Heart, 
  Share2, 
  Download, 
  Move, 
  RotateCcw, 
  ZoomIn, 
  ZoomOut,
  Trash2,
  Eye,
  Lock,
  Unlock,
  Shirt
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

interface MoodboardItem {
  id: string;
  clothingItemId: string;
  position: { x: number; y: number };
  rotation: number;
  scale: number;
  clothingItem: ClothingItem;
}

interface Moodboard {
  _id: string;
  userId: string;
  title: string;
  mood: string;
  description: string;
  items: MoodboardItem[];
  tags: string[];
  isPublic: boolean;
  likes: number;
  createdAt: string;
  updatedAt: string;
}

const moodOptions = [
  { id: "confident", label: "Confident", emoji: "💪" },
  { id: "cozy", label: "Cozy", emoji: "🛋️" },
  { id: "bold", label: "Bold", emoji: "🔥" },
  { id: "elegant", label: "Elegant", emoji: "👑" },
  { id: "casual", label: "Casual", emoji: "👕" },
  { id: "professional", label: "Professional", emoji: "💼" },
  { id: "playful", label: "Playful", emoji: "🎨" },
  { id: "minimalist", label: "Minimalist", emoji: "⚪" },
];

export default function OutfitGenerator() {
  const { user } = useAuth();
  
  const [clothingItems, setClothingItems] = useState<ClothingItem[]>([]);
  const [selectedMood, setSelectedMood] = useState("");
  const [moodboards, setMoodboards] = useState<Moodboard[]>([]);
  const [currentMoodboard, setCurrentMoodboard] = useState<Moodboard | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Canvas state
  const [canvasItems, setCanvasItems] = useState<MoodboardItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [draggingItem, setDraggingItem] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const canvasRef = useRef<HTMLDivElement>(null);
  
  // Form states
  const [moodboardForm, setMoodboardForm] = useState({
    title: "",
    description: "",
    isPublic: false,
    tags: [] as string[]
  });

  useEffect(() => {
    fetchClothingItems();
    fetchMoodboards();
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

  const fetchMoodboards = async () => {
    if (!user?.userId) return;
    
    try {
      const response = await fetch(`/api/moodboards/user/${user.userId}`);
      if (!response.ok) throw new Error("Failed to fetch moodboards");
      
      const data = await response.json();
      setMoodboards(data.data);
    } catch (error) {
      console.error("Error fetching moodboards:", error);
      toast.error("Failed to load moodboards");
    }
  };

  const generateMoodboard = async () => {
    if (!selectedMood || !user?.userId) return;
    
    try {
      setLoading(true);
      const response = await fetch("/api/moodboards/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.userId,
          mood: selectedMood,
          closetItems: clothingItems
        })
      });
      
      if (!response.ok) throw new Error("Failed to generate moodboard");
      
      const data = await response.json();
      
      // For now, we'll just create a new moodboard with the first suggestion
      if (data.data && data.data.length > 0) {
        const suggestion = data.data[0];
        const newMoodboard: Moodboard = {
          _id: `temp-${Date.now()}`,
          userId: user.userId,
          title: suggestion.title,
          mood: selectedMood,
          description: `AI-generated ${selectedMood} outfit`,
          items: suggestion.items.map((item: ClothingItem, index: number) => ({
            id: `item-${Date.now()}-${index}`,
            clothingItemId: item._id,
            position: { 
              x: 100 + (index % 3) * 150, 
              y: 100 + Math.floor(index / 3) * 200 
            },
            rotation: 0,
            scale: 1,
            clothingItem: item
          })),
          tags: suggestion.tags,
          isPublic: false,
          likes: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        setCurrentMoodboard(newMoodboard);
        setCanvasItems(newMoodboard.items);
        setIsCreating(true);
      }
      
      toast.success("Moodboard generated successfully!");
    } catch (error) {
      console.error("Error generating moodboard:", error);
      toast.error("Failed to generate moodboard");
    } finally {
      setLoading(false);
    }
  };

  const handleSaveMoodboard = async () => {
    if (!currentMoodboard || !user?.userId) return;
    
    try {
      setSaving(true);
      const response = await fetch("/api/moodboards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...currentMoodboard,
          userId: user.userId,
          items: canvasItems.map(item => ({
            clothingItemId: item.clothingItemId,
            position: item.position,
            rotation: item.rotation,
            scale: item.scale
          }))
        })
      });
      
      if (!response.ok) throw new Error("Failed to save moodboard");
      
      const data = await response.json();
      setCurrentMoodboard(data.data);
      setMoodboards([data.data, ...moodboards]);
      setIsCreating(false);
      toast.success("Moodboard saved successfully!");
    } catch (error) {
      console.error("Error saving moodboard:", error);
      toast.error("Failed to save moodboard");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteMoodboard = async (moodboardId: string) => {
    try {
      const response = await fetch(`/api/moodboards/${moodboardId}`, {
        method: "DELETE"
      });
      
      if (!response.ok) throw new Error("Failed to delete moodboard");
      
      setMoodboards(moodboards.filter(mb => mb._id !== moodboardId));
      if (currentMoodboard?._id === moodboardId) {
        setCurrentMoodboard(null);
        setCanvasItems([]);
      }
      toast.success("Moodboard deleted successfully!");
    } catch (error) {
      console.error("Error deleting moodboard:", error);
      toast.error("Failed to delete moodboard");
    }
  };

  const handleAddToCanvas = (clothingItem: ClothingItem) => {
    const newItem: MoodboardItem = {
      id: `item-${Date.now()}`,
      clothingItemId: clothingItem._id,
      position: { x: 200, y: 200 },
      rotation: 0,
      scale: 1,
      clothingItem
    };
    
    setCanvasItems([...canvasItems, newItem]);
    toast.success("Item added to canvas");
  };

  const handleCanvasMouseDown = (e: React.MouseEvent, itemId: string) => {
    e.stopPropagation();
    setSelectedItem(itemId);
    setDraggingItem(itemId);
    
    const item = canvasItems.find(i => i.id === itemId);
    if (item) {
      const rect = (e.target as HTMLElement).getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    }
  };

  const handleCanvasMouseMove = (e: React.MouseEvent) => {
    if (!draggingItem || !canvasRef.current) return;
    
    const canvasRect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - canvasRect.left - dragOffset.x;
    const y = e.clientY - canvasRect.top - dragOffset.y;
    
    setCanvasItems(canvasItems.map(item => 
      item.id === draggingItem 
        ? { ...item, position: { x, y } } 
        : item
    ));
  };

  const handleCanvasMouseUp = () => {
    setDraggingItem(null);
  };

  const handleRotateItem = (itemId: string, direction: "left" | "right") => {
    setCanvasItems(canvasItems.map(item => 
      item.id === itemId 
        ? { 
            ...item, 
            rotation: item.rotation + (direction === "left" ? -15 : 15) 
          } 
        : item
    ));
  };

  const handleScaleItem = (itemId: string, direction: "in" | "out") => {
    setCanvasItems(canvasItems.map(item => 
      item.id === itemId 
        ? { 
            ...item, 
            scale: Math.max(0.5, Math.min(2, item.scale + (direction === "in" ? -0.1 : 0.1))) 
          } 
        : item
    ));
  };

  const handleDeleteItem = (itemId: string) => {
    setCanvasItems(canvasItems.filter(item => item.id !== itemId));
    if (selectedItem === itemId) {
      setSelectedItem(null);
    }
  };

  const handleLikeMoodboard = async (moodboardId: string) => {
    try {
      const response = await fetch(`/api/moodboards/${moodboardId}/like`, {
        method: "PUT"
      });
      
      if (!response.ok) throw new Error("Failed to like moodboard");
      
      // Update the moodboard in state
      setMoodboards(moodboards.map(mb => 
        mb._id === moodboardId 
          ? { ...mb, likes: mb.likes + 1 } 
          : mb
      ));
      
      toast.success("Liked!");
    } catch (error) {
      console.error("Error liking moodboard:", error);
      toast.error("Failed to like moodboard");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-nature/5">
      <div className="container py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
              <Sparkles className="w-8 h-8 text-primary" />
              AI Moodboard Generator
            </h1>
            <p className="text-foreground/70 mt-2">
              Create visual outfit moodboards powered by AI
            </p>
          </div>
          
          <div className="flex gap-2">
            <Select value={selectedMood} onValueChange={setSelectedMood}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select a mood" />
              </SelectTrigger>
              <SelectContent>
                {moodOptions.map((mood) => (
                  <SelectItem key={mood.id} value={mood.id}>
                    <span className="flex items-center gap-2">
                      <span>{mood.emoji}</span>
                      <span>{mood.label}</span>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Button 
              onClick={generateMoodboard} 
              disabled={!selectedMood || loading}
              className="animate-pulseGlow"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              {loading ? "Generating..." : "Generate"}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Clothing Items Panel */}
          <div className="lg:col-span-1">
            <Card className="border-border/50 shadow-lg h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="w-5 h-5 text-primary" />
                  Your Closet
                </CardTitle>
                <CardDescription>
                  Drag items to the canvas to create your moodboard
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto">
                {loading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : clothingItems.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-3">
                    {clothingItems.map((item) => (
                      <div 
                        key={item._id} 
                        className="border border-border/50 rounded-lg p-2 hover:shadow-md transition-shadow cursor-pointer group"
                        onClick={() => handleAddToCanvas(item)}
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
                        <div className="flex items-center justify-between mt-1">
                          <Badge variant="secondary" className="text-xs">
                            {item.ecoScore}/100
                          </Badge>
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAddToCanvas(item);
                            }}
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="bg-muted rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                      <Shirt className="w-8 h-8 text-foreground/50" />
                    </div>
                    <h3 className="font-medium text-foreground mb-1">No Clothing Items</h3>
                    <p className="text-sm text-foreground/70 mb-4">
                      Add items to your closet to start creating moodboards
                    </p>
                    <Button variant="outline" size="sm">
                      Add Clothing
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Canvas Area */}
          <div className="lg:col-span-2">
            <Card className="border-border/50 shadow-lg h-full flex flex-col">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Move className="w-5 h-5 text-primary" />
                    Moodboard Canvas
                  </span>
                  {currentMoodboard && (
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => setIsCreating(true)}
                      >
                        <RotateCcw className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => handleDeleteMoodboard(currentMoodboard._id)}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </Button>
                    </div>
                  )}
                </CardTitle>
                <CardDescription>
                  {currentMoodboard 
                    ? currentMoodboard.title 
                    : "Generate a moodboard or create your own"}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="flex-1 flex flex-col">
                {isCreating ? (
                  <>
                    <div className="flex gap-2 mb-4">
                      <Input
                        id="moodboard-title"
                        placeholder="Moodboard title"
                        value={moodboardForm.title}
                        onChange={(e) => setMoodboardForm({...moodboardForm, title: e.target.value})}
                        className="flex-1"
                        aria-label="Moodboard title"
                      />
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => setMoodboardForm({...moodboardForm, isPublic: !moodboardForm.isPublic})}
                      >
                        {moodboardForm.isPublic ? (
                          <Unlock className="w-4 h-4 mr-2" />
                        ) : (
                          <Lock className="w-4 h-4 mr-2" />
                        )}
                        {moodboardForm.isPublic ? "Public" : "Private"}
                      </Button>
                    </div>
                    
                    <div 
                      ref={canvasRef}
                      className="flex-1 bg-muted rounded-lg border-2 border-dashed border-border/50 relative overflow-hidden"
                      onMouseMove={handleCanvasMouseMove}
                      onMouseUp={handleCanvasMouseUp}
                      onMouseLeave={handleCanvasMouseUp}
                    >
                      {canvasItems.length > 0 ? (
                        canvasItems.map((item) => (
                          <div
                            key={item.id}
                            className={`absolute cursor-move transition-transform ${
                              selectedItem === item.id ? "ring-2 ring-primary" : ""
                            }`}
                            style={{
                              left: `${item.position.x}px`,
                              top: `${item.position.y}px`,
                              transform: `rotate(${item.rotation}deg) scale(${item.scale})`,
                              transformOrigin: "center"
                            }}
                            onMouseDown={(e) => handleCanvasMouseDown(e, item.id)}
                          >
                            <div className="relative">
                              <div className="bg-card border border-border rounded-lg shadow-md w-32 h-40 overflow-hidden">
                                {item.clothingItem.imageUrl ? (
                                  <img 
                                    src={item.clothingItem.imageUrl} 
                                    alt={item.clothingItem.title} 
                                    className="w-full h-full object-cover"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center bg-muted">
                                    <span className="text-3xl">👕</span>
                                  </div>
                                )}
                              </div>
                              
                              {selectedItem === item.id && (
                                <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-card border border-border rounded-md shadow-lg p-1 flex gap-1">
                                  <Button 
                                    size="sm" 
                                    variant="ghost" 
                                    className="h-6 w-6 p-0"
                                    onClick={() => handleRotateItem(item.id, "left")}
                                  >
                                    <RotateCcw className="w-3 h-3" />
                                  </Button>
                                  <Button 
                                    size="sm" 
                                    variant="ghost" 
                                    className="h-6 w-6 p-0"
                                    onClick={() => handleScaleItem(item.id, "out")}
                                  >
                                    <ZoomOut className="w-3 h-3" />
                                  </Button>
                                  <Button 
                                    size="sm" 
                                    variant="ghost" 
                                    className="h-6 w-6 p-0"
                                    onClick={() => handleScaleItem(item.id, "in")}
                                  >
                                    <ZoomIn className="w-3 h-3" />
                                  </Button>
                                  <Button 
                                    size="sm" 
                                    variant="ghost" 
                                    className="h-6 w-6 p-0 text-destructive"
                                    onClick={() => handleDeleteItem(item.id)}
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </Button>
                                </div>
                              )}
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-foreground/50">
                          <Move className="w-12 h-12 mb-2" />
                          <p className="text-lg font-medium">Drag items here</p>
                          <p className="text-sm">Select clothing from your closet and drag to the canvas</p>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex justify-between mt-4">
                      <Button 
                        variant="outline" 
                        onClick={() => {
                          setIsCreating(false);
                          setCurrentMoodboard(null);
                          setCanvasItems([]);
                        }}
                      >
                        Cancel
                      </Button>
                      <Button 
                        onClick={handleSaveMoodboard}
                        disabled={saving || canvasItems.length === 0}
                      >
                        {saving ? "Saving..." : "Save Moodboard"}
                      </Button>
                    </div>
                  </>
                ) : currentMoodboard ? (
                  <div className="flex-1 flex flex-col">
                    <div className="flex-1 bg-muted rounded-lg border border-border overflow-hidden relative">
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4">
                        {currentMoodboard.items.map((item) => (
                          <div key={item.id} className="bg-card border border-border rounded-lg overflow-hidden">
                            <div className="aspect-square bg-muted flex items-center justify-center">
                              {item.clothingItem.imageUrl ? (
                                <img 
                                  src={item.clothingItem.imageUrl} 
                                  alt={item.clothingItem.title} 
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <span className="text-3xl">👕</span>
                              )}
                            </div>
                            <div className="p-2">
                              <h3 className="font-medium text-sm truncate">{item.clothingItem.title}</h3>
                              <p className="text-xs text-foreground/70">{item.clothingItem.category}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex justify-between mt-4">
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          <Heart className="w-4 h-4 mr-2" />
                          {currentMoodboard.likes}
                        </Button>
                        <Button variant="outline" size="sm">
                          <Share2 className="w-4 h-4 mr-2" />
                          Share
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </Button>
                      </div>
                      <div className="flex gap-2">
                        {currentMoodboard.tags.map((tag) => (
                          <Badge key={tag} variant="secondary">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-foreground/50 bg-muted rounded-lg border-2 border-dashed border-border/50">
                    <Sparkles className="w-12 h-12 mb-4" />
                    <h3 className="text-lg font-medium mb-2">No Moodboard Selected</h3>
                    <p className="text-center mb-4 max-w-md">
                      Select a mood and click "Generate" to create an AI-powered outfit moodboard, 
                      or start creating your own from scratch.
                    </p>
                    <div className="flex gap-2">
                      <Select value={selectedMood} onValueChange={setSelectedMood}>
                        <SelectTrigger className="w-40">
                          <SelectValue placeholder="Select a mood" />
                        </SelectTrigger>
                        <SelectContent>
                          {moodOptions.map((mood) => (
                            <SelectItem key={mood.id} value={mood.id}>
                              <span className="flex items-center gap-2">
                                <span>{mood.emoji}</span>
                                <span>{mood.label}</span>
                              </span>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button 
                        onClick={() => setIsCreating(true)}
                        disabled={!selectedMood}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Create Blank
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Moodboards List */}
          <div className="lg:col-span-1">
            <Card className="border-border/50 shadow-lg h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Save className="w-5 h-5 text-primary" />
                  Saved Moodboards
                </CardTitle>
                <CardDescription>
                  Your previously created moodboards
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto">
                {moodboards.length > 0 ? (
                  <div className="space-y-3">
                    {moodboards.map((moodboard) => (
                      <div 
                        key={moodboard._id} 
                        className={`border rounded-lg p-3 cursor-pointer transition-colors ${
                          currentMoodboard?._id === moodboard._id 
                            ? "border-primary bg-primary/5" 
                            : "border-border/50 hover:bg-muted/50"
                        }`}
                        onClick={() => {
                          setCurrentMoodboard(moodboard);
                          setCanvasItems(moodboard.items);
                          setIsCreating(false);
                        }}
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium text-foreground">{moodboard.title}</h3>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant="secondary" className="text-xs">
                                {moodboard.mood}
                              </Badge>
                              {moodboard.isPublic && (
                                <Badge variant="outline" className="text-xs">
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
                              handleLikeMoodboard(moodboard._id);
                            }}
                          >
                            <Heart className="w-3 h-3" />
                          </Button>
                        </div>
                        
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-foreground/70">
                            {new Date(moodboard.createdAt).toLocaleDateString()}
                          </span>
                          <div className="flex items-center gap-1 text-xs text-foreground/70">
                            <Heart className="w-3 h-3" />
                            <span>{moodboard.likes}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="bg-muted rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                      <Save className="w-8 h-8 text-foreground/50" />
                    </div>
                    <h3 className="font-medium text-foreground mb-1">No Moodboards Yet</h3>
                    <p className="text-sm text-foreground/70">
                      Create your first moodboard to get started
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}