import { useState, useRef, useEffect } from "react";
import { 
  Scan, 
  Upload, 
  Camera, 
  Leaf, 
  AlertTriangle, 
  CheckCircle, 
  Info,
  RotateCcw,
  Download,
  Share2
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

interface FabricComponent {
  material: string;
  percentage: number;
  sustainabilityScore: number;
  environmentalImpact: "low" | "medium" | "high";
}

interface FabricAnalysis {
  _id: string;
  userId: string;
  clothingItemId?: string;
  imageUrl: string;
  fabricType: string;
  components: FabricComponent[];
  sustainabilityScore: number;
  recommendations: string[];
  createdAt: string;
  updatedAt: string;
}

export default function FabricScanner() {
  const { user } = useAuth();
  
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<FabricAnalysis | null>(null);
  const [previousAnalyses, setPreviousAnalyses] = useState<FabricAnalysis[]>([]);
  const [loading, setLoading] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);

  useEffect(() => {
    fetchPreviousAnalyses();
  }, [user?.userId]);

  const fetchPreviousAnalyses = async () => {
    if (!user?.userId) return;
    
    try {
      setLoading(true);
      const response = await fetch(`/api/fabric-analyses/user/${user.userId}`);
      if (!response.ok) throw new Error("Failed to fetch previous analyses");
      
      const data = await response.json();
      setPreviousAnalyses(data.data);
    } catch (error) {
      console.error("Error fetching previous analyses:", error);
      toast.error("Failed to load previous analyses");
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCameraActive(true);
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
      toast.error("Failed to access camera. Please check permissions.");
    }
  };

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;
      const context = canvas.getContext("2d");
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], "captured-image.jpg", { type: "image/jpeg" });
            setImage(file);
            setImagePreview(URL.createObjectURL(file));
            stopCamera();
          }
        }, "image/jpeg");
      }
    }
  };

  const stopCamera = () => {
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
      setIsCameraActive(false);
    }
  };

  const analyzeFabric = async () => {
    if (!image || !user?.userId) return;
    
    try {
      setIsAnalyzing(true);
      
      // In a real app, we would upload the image to a server and analyze it
      // For now, we'll simulate the analysis with a delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock analysis result
      const mockAnalysis: FabricAnalysis = {
        _id: `analysis-${Date.now()}`,
        userId: user.userId,
        imageUrl: imagePreview || "",
        fabricType: "Cotton Blend",
        components: [
          {
            material: "Organic Cotton",
            percentage: 70,
            sustainabilityScore: 85,
            environmentalImpact: "low"
          },
          {
            material: "Polyester",
            percentage: 30,
            sustainabilityScore: 40,
            environmentalImpact: "high"
          }
        ],
        sustainabilityScore: 65,
        recommendations: [
          "This item is made with 70% organic cotton, which is a sustainable choice",
          "The 30% polyester content has a higher environmental impact",
          "Consider washing in cold water to extend the life of this garment",
          "When disposing, look for textile recycling programs in your area"
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      setAnalysis(mockAnalysis);
      setPreviousAnalyses([mockAnalysis, ...previousAnalyses]);
      toast.success("Fabric analysis completed successfully!");
    } catch (error) {
      console.error("Error analyzing fabric:", error);
      toast.error("Failed to analyze fabric");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    setImage(null);
    setImagePreview(null);
    setAnalysis(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleShare = () => {
    if (navigator.share && analysis) {
      navigator.share({
        title: "Fabric Analysis",
        text: `This garment has a sustainability score of ${analysis.sustainabilityScore}/100`,
        url: window.location.href
      }).catch(console.error);
    } else {
      // Fallback for browsers that don't support Web Share API
      toast.info("Share functionality not available on this browser");
    }
  };

  const handleDownload = () => {
    if (analysis) {
      const dataStr = JSON.stringify(analysis, null, 2);
      const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
      
      const exportFileDefaultName = `fabric-analysis-${new Date().toISOString().slice(0, 10)}.json`;
      
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "low": return "bg-green-500";
      case "medium": return "bg-yellow-500";
      case "high": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  const getSustainabilityScoreColor = (score: number) => {
    if (score >= 80) return "text-green-500";
    if (score >= 60) return "text-yellow-500";
    return "text-red-500";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-nature/5">
      <div className="container py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
              <Scan className="w-8 h-8 text-primary" />
              Fabric Intelligence Scanner
            </h1>
            <p className="text-foreground/70 mt-2">
              Upload a clothing tag or receipt to detect fabric type and rate sustainability
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Scanner Panel */}
          <div className="lg:col-span-2">
            <Card className="border-border/50 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Camera className="w-5 h-5 text-primary" />
                  Scan Fabric
                </CardTitle>
                <CardDescription>
                  Upload an image of a clothing tag or receipt to analyze fabric composition
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {!imagePreview ? (
                  <div className="space-y-6">
                    {/* Upload Zone */}
                    <div 
                      className="border-2 border-dashed border-border/50 rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 transition-colors"
                      onDragOver={handleDragOver}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Upload className="w-12 h-12 text-foreground/30 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-foreground mb-2">Upload Image</h3>
                      <p className="text-foreground/70 mb-4">
                        Drag and drop an image here, or click to select a file
                      </p>
                      <Button variant="outline">
                        <Upload className="w-4 h-4 mr-2" />
                        Select Image
                      </Button>
                      <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept="image/*"
                        onChange={handleFileSelect}
                        aria-label="Select image file"
                      />
                    </div>
                    
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <Separator className="w-full" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background px-2 text-foreground/50">or</span>
                      </div>
                    </div>
                    
                    {/* Camera Option */}
                    <div className="text-center">
                      <Button onClick={startCamera} variant="outline">
                        <Camera className="w-4 h-4 mr-2" />
                        Use Camera
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Image Preview */}
                    <div className="relative">
                      {isCameraActive ? (
                        <div className="relative">
                          <video 
                            ref={videoRef} 
                            autoPlay 
                            playsInline 
                            className="w-full rounded-lg border border-border/50"
                          />
                          <canvas ref={canvasRef} className="hidden" />
                          <div className="absolute bottom-4 left-0 right-0 flex justify-center">
                            <Button 
                              onClick={captureImage}
                              className="bg-white/80 hover:bg-white text-foreground"
                            >
                              <Camera className="w-5 h-5 mr-2" />
                              Capture
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="relative">
                          <img 
                            src={imagePreview} 
                            alt="Preview" 
                            className="w-full rounded-lg border border-border/50"
                          />
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="absolute top-2 right-2"
                            onClick={handleReset}
                          >
                            <RotateCcw className="w-4 h-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                    
                    {/* Action Buttons */}
                    {!isCameraActive && (
                      <div className="flex gap-2">
                        <Button 
                          onClick={analyzeFabric} 
                          disabled={isAnalyzing}
                          className="flex-1"
                        >
                          {isAnalyzing ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                              Analyzing...
                            </>
                          ) : (
                            <>
                              <Scan className="w-4 h-4 mr-2" />
                              Analyze Fabric
                            </>
                          )}
                        </Button>
                        <Button 
                          variant="outline" 
                          onClick={handleReset}
                        >
                          Reset
                        </Button>
                      </div>
                    )}
                  </div>
                )}
                
                {/* Analysis Results */}
                {analysis && (
                  <div className="space-y-6 animate-fadeIn">
                    <Separator />
                    
                    <div>
                      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <Leaf className="w-5 h-5 text-primary" />
                        Analysis Results
                      </h3>
                      
                      {/* Overall Score */}
                      <div className="bg-muted rounded-lg p-4 mb-6">
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-medium">Sustainability Score</span>
                          <Badge 
                            className={getSustainabilityScoreColor(analysis.sustainabilityScore)}
                            variant="secondary"
                          >
                            {analysis.sustainabilityScore}/100
                          </Badge>
                        </div>
                        <div className="w-full bg-secondary rounded-full h-2.5">
                          <div 
                            className="bg-primary h-2.5 rounded-full"
                            style={{ width: `${analysis.sustainabilityScore}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      {/* Fabric Type */}
                      <div className="mb-6">
                        <h4 className="font-medium mb-2">Fabric Type</h4>
                        <Badge variant="outline" className="text-lg py-2 px-4">
                          {analysis.fabricType}
                        </Badge>
                      </div>
                      
                      {/* Components */}
                      <div className="mb-6">
                        <h4 className="font-medium mb-3">Fabric Components</h4>
                        <div className="space-y-3">
                          {analysis.components.map((component, index) => (
                            <div key={index} className="border border-border/50 rounded-lg p-3">
                              <div className="flex justify-between items-center mb-2">
                                <span className="font-medium">{component.material}</span>
                                <Badge variant="secondary">{component.percentage}%</Badge>
                              </div>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <div className={`w-3 h-3 rounded-full ${getImpactColor(component.environmentalImpact)}`}></div>
                                  <span className="text-sm capitalize">{component.environmentalImpact} impact</span>
                                </div>
                                <Badge 
                                  className={getSustainabilityScoreColor(component.sustainabilityScore)}
                                  variant="outline"
                                >
                                  {component.sustainabilityScore}/100
                                </Badge>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      {/* Recommendations */}
                      <div>
                        <h4 className="font-medium mb-3 flex items-center gap-2">
                          <Info className="w-4 h-4" />
                          Recommendations
                        </h4>
                        <ul className="space-y-2">
                          {analysis.recommendations.map((rec, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                              <span className="text-foreground/80">{rec}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="flex gap-2 mt-6">
                        <Button onClick={handleShare} variant="outline" className="flex-1">
                          <Share2 className="w-4 h-4 mr-2" />
                          Share
                        </Button>
                        <Button onClick={handleDownload} variant="outline" className="flex-1">
                          <Download className="w-4 h-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Previous Analyses */}
          <div className="lg:col-span-1">
            <Card className="border-border/50 shadow-lg h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Leaf className="w-5 h-5 text-primary" />
                  Previous Analyses
                </CardTitle>
                <CardDescription>
                  Your fabric analysis history
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto">
                {loading ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : previousAnalyses.length > 0 ? (
                  <div className="space-y-3">
                    {previousAnalyses.map((analysis) => (
                      <div 
                        key={analysis._id} 
                        className="border border-border/50 rounded-lg p-3 cursor-pointer hover:bg-muted/50 transition-colors"
                        onClick={() => setAnalysis(analysis)}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-medium text-sm truncate">{analysis.fabricType}</h3>
                          <Badge 
                            className={getSustainabilityScoreColor(analysis.sustainabilityScore)}
                            variant="secondary"
                          >
                            {analysis.sustainabilityScore}
                          </Badge>
                        </div>
                        
                        <div className="flex items-center gap-2 mb-2">
                          {analysis.components.slice(0, 2).map((component, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {component.material}
                            </Badge>
                          ))}
                          {analysis.components.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{analysis.components.length - 2}
                            </Badge>
                          )}
                        </div>
                        
                        <p className="text-xs text-foreground/70">
                          {new Date(analysis.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Scan className="w-12 h-12 text-foreground/20 mx-auto mb-4" />
                    <h3 className="font-medium text-foreground mb-1">No Previous Analyses</h3>
                    <p className="text-sm text-foreground/70">
                      Upload an image to analyze fabric composition
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