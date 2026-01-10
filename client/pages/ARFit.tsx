import { useState, useRef } from "react";
import Layout from "@/components/Layout";
import { 
  Camera, 
  Upload,
  Shirt,
  Maximize2,
  RotateCw,
  Download,
  Share2,
  Sparkles,
  AlertCircle,
  CheckCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

export default function ARFit() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedGarment, setSelectedGarment] = useState<string | null>(null);
  const [processing, setProcessing] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const garments = [
    { id: "1", name: "White T-Shirt", category: "Tops", image: "/placeholder-tshirt.jpg", color: "White" },
    { id: "2", name: "Blue Jeans", category: "Bottoms", image: "/placeholder-jeans.jpg", color: "Blue" },
    { id: "3", name: "Black Dress", category: "Dresses", image: "/placeholder-dress.jpg", color: "Black" },
    { id: "4", name: "Gray Hoodie", category: "Tops", image: "/placeholder-hoodie.jpg", color: "Gray" },
    { id: "5", name: "Denim Jacket", category: "Outerwear", image: "/placeholder-jacket.jpg", color: "Blue" },
    { id: "6", name: "Red Sweater", category: "Tops", image: "/placeholder-sweater.jpg", color: "Red" }
  ];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast.error("Image size should be less than 10MB");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        setResult(null);
        toast.success("Image uploaded successfully!");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTryOn = async () => {
    if (!selectedImage || !selectedGarment) {
      toast.error("Please upload your photo and select a garment");
      return;
    }

    setProcessing(true);
    
    // Simulate AR processing
    setTimeout(() => {
      setResult(selectedImage); // In real implementation, this would be the AR result
      setProcessing(false);
      toast.success("Virtual try-on complete!");
    }, 2000);
  };

  const handleDownload = () => {
    if (!result) return;
    toast.success("Image downloaded!");
  };

  const handleShare = () => {
    if (!result) return;
    toast.success("Link copied to clipboard!");
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
        {/* Header */}
        <div className="bg-primary/5 border-b border-border/40">
          <div className="container max-w-7xl mx-auto px-4 py-12">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Camera className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-foreground">AR Virtual Try-On</h1>
                <p className="text-foreground/70 mt-1">See how clothes look on you before buying</p>
              </div>
            </div>
          </div>
        </div>

        <div className="container max-w-7xl mx-auto px-4 py-8">
          {/* Info Banner */}
          <Card className="mb-6 border-primary/20 bg-primary/5">
            <CardContent className="flex items-start gap-3 pt-6">
              <AlertCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="text-sm font-medium">How it works</p>
                <p className="text-sm text-muted-foreground">
                  Upload a full-body photo, select a garment from your wardrobe or our catalog, and see how it looks on you instantly using AI-powered virtual try-on technology.
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left: Upload & Selection */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Upload className="w-5 h-5 text-primary" />
                    Upload Your Photo
                  </CardTitle>
                  <CardDescription>
                    Upload a clear, full-body photo for best results
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div 
                    className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 transition-colors"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {selectedImage ? (
                      <div className="space-y-4">
                        <img 
                          src={selectedImage} 
                          alt="Uploaded" 
                          className="max-h-64 mx-auto rounded-lg object-contain"
                        />
                        <Button variant="outline" size="sm">
                          <Upload className="w-4 h-4 mr-2" />
                          Change Photo
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <Camera className="w-16 h-16 mx-auto text-muted-foreground" />
                        <div>
                          <p className="font-medium mb-1">Click to upload photo</p>
                          <p className="text-sm text-muted-foreground">
                            JPG, PNG up to 10MB
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shirt className="w-5 h-5 text-primary" />
                    Select Garment
                  </CardTitle>
                  <CardDescription>
                    Choose an item to try on
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="all">
                    <TabsList className="grid w-full grid-cols-4">
                      <TabsTrigger value="all">All</TabsTrigger>
                      <TabsTrigger value="tops">Tops</TabsTrigger>
                      <TabsTrigger value="bottoms">Bottoms</TabsTrigger>
                      <TabsTrigger value="dresses">Dresses</TabsTrigger>
                    </TabsList>
                    <TabsContent value="all" className="mt-4">
                      <div className="grid grid-cols-3 gap-3">
                        {garments.map(garment => (
                          <div
                            key={garment.id}
                            className={`border-2 rounded-lg p-2 cursor-pointer transition-all ${
                              selectedGarment === garment.id
                                ? "border-primary bg-primary/5"
                                : "border-border hover:border-primary/50"
                            }`}
                            onClick={() => setSelectedGarment(garment.id)}
                          >
                            <div className="aspect-square bg-muted rounded-md mb-2 flex items-center justify-center">
                              <Shirt className="w-8 h-8 text-muted-foreground" />
                            </div>
                            <p className="text-xs font-medium truncate">{garment.name}</p>
                            <Badge variant="outline" className="text-xs mt-1">
                              {garment.color}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>

              <Button 
                onClick={handleTryOn} 
                disabled={!selectedImage || !selectedGarment || processing}
                className="w-full h-12"
                size="lg"
              >
                {processing ? (
                  <>
                    <RotateCw className="w-5 h-5 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-2" />
                    Try On
                  </>
                )}
              </Button>
            </div>

            {/* Right: Result */}
            <div>
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Maximize2 className="w-5 h-5 text-primary" />
                      Preview
                    </span>
                    {result && (
                      <div className="flex gap-2">
                        <Button variant="ghost" size="icon" onClick={handleDownload}>
                          <Download className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={handleShare}>
                          <Share2 className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                  </CardTitle>
                  <CardDescription>
                    {result ? "Your virtual try-on result" : "Result will appear here"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {processing ? (
                    <div className="flex flex-col items-center justify-center py-20">
                      <RotateCw className="w-12 h-12 animate-spin text-primary mb-4" />
                      <p className="text-muted-foreground">Processing your virtual try-on...</p>
                      <p className="text-sm text-muted-foreground mt-2">This may take a few seconds</p>
                    </div>
                  ) : result ? (
                    <div className="space-y-4">
                      <div className="relative rounded-lg overflow-hidden border">
                        <img 
                          src={result} 
                          alt="Try-on result" 
                          className="w-full h-auto"
                        />
                        <div className="absolute top-4 right-4">
                          <Badge className="bg-primary/90">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            AR Applied
                          </Badge>
                        </div>
                      </div>
                      
                      <Card className="bg-muted/50">
                        <CardContent className="pt-6">
                          <div className="flex items-start gap-3">
                            <Sparkles className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                            <div>
                              <p className="text-sm font-medium mb-1">AI Fit Analysis</p>
                              <p className="text-sm text-muted-foreground">
                                This garment appears to fit well with your body type. The color complements your skin tone nicely.
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                      <Camera className="w-16 h-16 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-semibold mb-2">Ready to Try On</h3>
                      <p className="text-muted-foreground max-w-sm">
                        Upload your photo and select a garment to see how it looks on you
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
