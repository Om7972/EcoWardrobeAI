import { useState, useRef, useEffect } from "react";
import { 
  Camera, 
  RotateCcw, 
  ZoomIn, 
  ZoomOut, 
  Play, 
  Pause, 
  Download,
  Shirt,
  Share2,
  Heart,
  Info,
  X,
  Maximize2,
  Minimize2
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

interface ARItem {
  id: string;
  name: string;
  category: string;
  image: string;
  sustainabilityScore: number;
  materials: string[];
  brand: string;
  price: number;
}

const mockARItems: ARItem[] = [
  {
    id: "1",
    name: "Organic Cotton T-Shirt",
    category: "Tops",
    image: "/placeholder-tshirt.jpg",
    sustainabilityScore: 95,
    materials: ["Organic Cotton", "Natural Dyes"],
    brand: "EcoWear",
    price: 29.99
  },
  {
    id: "2",
    name: "Recycled Denim Jacket",
    category: "Outerwear",
    image: "/placeholder-jacket.jpg",
    sustainabilityScore: 88,
    materials: ["Recycled Cotton", "Recycled Polyester"],
    brand: "ReNew Apparel",
    price: 89.99
  },
  {
    id: "3",
    name: "Bamboo Fiber Dress",
    category: "Dresses",
    image: "/placeholder-dress.jpg",
    sustainabilityScore: 92,
    materials: ["Bamboo Fiber", "Organic Cotton"],
    brand: "GreenThreads",
    price: 49.99
  },
  {
    id: "4",
    name: "Hemp Cargo Pants",
    category: "Bottoms",
    image: "/placeholder-pants.jpg",
    sustainabilityScore: 87,
    materials: ["Hemp", "Organic Cotton"],
    brand: "EarthWear",
    price: 59.99
  }
];

export default function ARFit() {
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ARItem | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showTutorial, setShowTutorial] = useState(true);
  const [showItemDetails, setShowItemDetails] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Simulate camera access
  const startCamera = async () => {
    try {
      // In a real implementation, this would access the device camera
      // For demo purposes, we'll just simulate it
      setIsCameraActive(true);
      setSelectedItem(mockARItems[0]);
    } catch (error) {
      console.error("Error accessing camera:", error);
      alert("Could not access camera. Please ensure you've granted permission.");
    }
  };

  const stopCamera = () => {
    setIsCameraActive(false);
    setSelectedItem(null);
  };

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.2, 3));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.2, 0.5));
  };

  const handleRotate = () => {
    setRotation(prev => (prev + 45) % 360);
  };

  const resetView = () => {
    setZoomLevel(1);
    setRotation(0);
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-nature/5">
      <div className="container py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
              <Maximize2 className="w-8 h-8 text-primary" />
              AR Fit Studio
            </h1>
            <p className="text-foreground/70 mt-2">
              Try on sustainable fashion virtually with augmented reality
            </p>
          </div>
          
          <div className="flex gap-2">
            {!isCameraActive ? (
              <Button onClick={startCamera}>
                <Camera className="w-4 h-4 mr-2" />
                Start AR Session
              </Button>
            ) : (
              <Button variant="outline" onClick={stopCamera}>
                <X className="w-4 h-4 mr-2" />
                End Session
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* AR View */}
          <div className="lg:col-span-3">
            <Card className="border-border/50 shadow-lg h-full">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>AR Try-On</CardTitle>
                  {isCameraActive && (
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={handleZoomOut}>
                        <ZoomOut className="w-4 h-4" />
                      </Button>
                      <span className="text-sm px-2 py-1 bg-muted rounded">
                        {Math.round(zoomLevel * 100)}%
                      </span>
                      <Button variant="outline" size="sm" onClick={handleZoomIn}>
                        <ZoomIn className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={handleRotate}>
                        <RotateCcw className="w-4 h-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={resetView}>
                        Reset
                      </Button>
                    </div>
                  )}
                </div>
                <CardDescription>
                  {isCameraActive 
                    ? "Position yourself in the frame and try on virtual clothing" 
                    : "Start an AR session to try on sustainable fashion items"}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="p-0">
                <div className="relative aspect-video bg-muted flex items-center justify-center">
                  {!isCameraActive ? (
                    <div className="text-center p-8">
                      <Camera className="w-16 h-16 text-foreground/20 mx-auto mb-4" />
                      <h3 className="text-xl font-medium mb-2">Ready to Try On?</h3>
                      <p className="text-foreground/70 mb-4 max-w-md">
                        Start an AR session to virtually try on sustainable fashion items. 
                        See how they look on you before purchasing.
                      </p>
                      <Button onClick={startCamera}>
                        <Camera className="w-4 h-4 mr-2" />
                        Start AR Session
                      </Button>
                    </div>
                  ) : (
                    <>
                      {/* Simulated camera view */}
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 to-purple-900/20 flex items-center justify-center">
                        <div className="text-center">
                          <div className="w-32 h-32 border-4 border-dashed border-white/30 rounded-full flex items-center justify-center mb-4 mx-auto">
                            <span className="text-white/50">Camera View</span>
                          </div>
                          <p className="text-white/70">AR Camera Active</p>
                        </div>
                      </div>
                      
                      {/* AR Overlay - Simulated item overlay */}
                      {selectedItem && (
                        <div 
                          className="absolute inset-0 flex items-center justify-center"
                          style={{
                            transform: `scale(${zoomLevel}) rotate(${rotation}deg)`,
                            transition: 'transform 0.3s ease'
                          }}
                        >
                          <div className="relative">
                            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 border border-white/30">
                              <div className="bg-muted aspect-[9/16] w-48 flex items-center justify-center rounded">
                                <Shirt className="w-16 h-16 text-foreground/30" />
                              </div>
                              <p className="text-white text-center mt-2 font-medium">
                                {selectedItem.name}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      {/* Controls Overlay */}
                      <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                        <Button 
                          variant="secondary" 
                          size="icon"
                          onClick={togglePlay}
                        >
                          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                        </Button>
                        <Button variant="secondary" size="icon">
                          <Download className="w-4 h-4" />
                        </Button>
                        <Button variant="secondary" size="icon">
                          <Share2 className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="secondary" 
                          size="icon"
                          onClick={() => setShowItemDetails(true)}
                        >
                          <Info className="w-4 h-4" />
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Items Panel */}
          <div className="space-y-6">
            <Card className="border-border/50 shadow-lg">
              <CardHeader>
                <CardTitle>Sustainable Items</CardTitle>
                <CardDescription>
                  Try on eco-friendly fashion items
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 max-h-[500px] overflow-y-auto">
                {mockARItems.map((item) => (
                  <Card 
                    key={item.id} 
                    className={`cursor-pointer hover:shadow-md transition-shadow ${
                      selectedItem?.id === item.id ? "ring-2 ring-primary" : ""
                    }`}
                    onClick={() => setSelectedItem(item)}
                  >
                    <CardContent className="p-3">
                      <div className="flex gap-3">
                        <div className="bg-muted aspect-square w-16 rounded flex items-center justify-center">
                          <Shirt className="w-8 h-8 text-foreground/30" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium text-sm line-clamp-1">{item.name}</h4>
                          <p className="text-xs text-foreground/70">{item.brand}</p>
                          <div className="flex items-center justify-between mt-1">
                            <Badge variant="secondary" className="text-xs">
                              {item.sustainabilityScore}% Eco
                            </Badge>
                            <span className="text-sm font-medium">${item.price}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
            </Card>
            
            {selectedItem && (
              <Card className="border-border/50 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shirt className="w-5 h-5" />
                    {selectedItem.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-foreground/70">Brand</span>
                    <span className="font-medium">{selectedItem.brand}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-foreground/70">Category</span>
                    <Badge variant="outline">{selectedItem.category}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-foreground/70">Price</span>
                    <span className="font-medium">${selectedItem.price}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-foreground/70">Eco-Score</span>
                    <Badge 
                      variant="secondary" 
                      className={
                        selectedItem.sustainabilityScore > 90 
                          ? "bg-green-500/20 text-green-700" 
                          : selectedItem.sustainabilityScore > 80 
                            ? "bg-blue-500/20 text-blue-700" 
                            : "bg-amber-500/20 text-amber-700"
                      }
                    >
                      {selectedItem.sustainabilityScore}%
                    </Badge>
                  </div>
                  
                  <div>
                    <p className="text-sm font-medium mb-2">Materials</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedItem.materials.map((material, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {material}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex gap-2 pt-2">
                    <Button size="sm" className="flex-1">
                      <Heart className="w-4 h-4 mr-1" />
                      Save
                    </Button>
                    <Button size="sm" variant="outline">
                      Buy
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
            
            <Card className="border-border/50 shadow-lg">
              <CardHeader>
                <CardTitle>AR Tips</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 bg-blue-500/10 rounded-lg">
                  <h4 className="font-medium text-sm">Lighting</h4>
                  <p className="text-xs text-foreground/70 mt-1">
                    Ensure good lighting for best AR experience
                  </p>
                </div>
                <div className="p-3 bg-green-500/10 rounded-lg">
                  <h4 className="font-medium text-sm">Movement</h4>
                  <p className="text-xs text-foreground/70 mt-1">
                    Move slowly to allow tracking to adjust
                  </p>
                </div>
                <div className="p-3 bg-amber-500/10 rounded-lg">
                  <h4 className="font-medium text-sm">Environment</h4>
                  <p className="text-xs text-foreground/70 mt-1">
                    Stand in a well-lit, uncluttered space
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      {/* Tutorial Modal */}
      <Dialog open={showTutorial} onOpenChange={setShowTutorial}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Welcome to AR Fit Studio</DialogTitle>
            <DialogDescription>
              Try on sustainable fashion items virtually
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="bg-primary/10 p-2 rounded-full mt-0.5">
                <Camera className="w-4 h-4 text-primary" />
              </div>
              <div>
                <h4 className="font-medium">Start AR Session</h4>
                <p className="text-sm text-foreground/70">
                  Click "Start AR Session" to activate your camera
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="bg-primary/10 p-2 rounded-full mt-0.5">
                <Shirt className="w-4 h-4 text-primary" />
              </div>
              <div>
                <h4 className="font-medium">Select Items</h4>
                <p className="text-sm text-foreground/70">
                  Choose from sustainable fashion items to try on
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="bg-primary/10 p-2 rounded-full mt-0.5">
                <Maximize2 className="w-4 h-4 text-primary" />
              </div>
              <div>
                <h4 className="font-medium">Adjust View</h4>
                <p className="text-sm text-foreground/70">
                  Use zoom and rotation controls to get the perfect view
                </p>
              </div>
            </div>
            
            <Button onClick={() => setShowTutorial(false)} className="w-full">
              Get Started
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Item Details Modal */}
      <Dialog open={showItemDetails} onOpenChange={setShowItemDetails}>
        <DialogContent className="max-w-md">
          {selectedItem && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedItem.name}</DialogTitle>
                <DialogDescription>
                  Detailed information about this sustainable item
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-4">
                <div className="bg-muted aspect-video rounded-lg flex items-center justify-center">
                  <Shirt className="w-16 h-16 text-foreground/30" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-green-500/10 rounded-lg">
                    <p className="text-xs text-foreground/70">Eco-Score</p>
                    <p className="font-bold text-lg">{selectedItem.sustainabilityScore}%</p>
                  </div>
                  <div className="p-3 bg-blue-500/10 rounded-lg">
                    <p className="text-xs text-foreground/70">Price</p>
                    <p className="font-bold text-lg">${selectedItem.price}</p>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Materials</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedItem.materials.map((material, index) => (
                      <Badge key={index} variant="secondary">
                        {material}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button className="flex-1">
                    <Heart className="w-4 h-4 mr-2" />
                    Save to Wishlist
                  </Button>
                  <Button variant="outline" className="flex-1">
                    Try On
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