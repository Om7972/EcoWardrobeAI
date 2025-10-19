import { useState } from "react";
import Layout from "@/components/Layout";
import {
  Upload,
  Zap,
  AlertCircle,
  CheckCircle2,
  Image as ImageIcon,
  Leaf,
  Droplet,
  Flame,
} from "lucide-react";
import { toast } from "sonner";

interface FabricAnalysis {
  fabricType: string;
  sustainability: {
    score: number;
    rating: "excellent" | "good" | "moderate" | "poor";
  };
  properties: {
    durability: string;
    breathability: string;
    care: string;
  };
  impacts: {
    water: string;
    carbon: string;
    chemicals: string;
  };
  recommendations: string[];
  icon: string;
}

const fabricDatabase: Record<string, FabricAnalysis> = {
  "organic cotton": {
    fabricType: "🌿 Organic Cotton",
    sustainability: {
      score: 92,
      rating: "excellent",
    },
    properties: {
      durability: "High - Lasts 5+ years with proper care",
      breathability: "Excellent - Natural fiber comfort",
      care: "Machine wash, air dry recommended",
    },
    impacts: {
      water: "Minimal - Grown without excessive irrigation",
      carbon: "Low - No synthetic pesticides",
      chemicals: "None - Certified organic process",
    },
    recommendations: [
      "Excellent sustainability choice",
      "Versatile for all seasons",
      "Invest in quality pieces - worth the cost",
      "Store with care to maximize lifespan",
    ],
    icon: "🌾",
  },
  polyester: {
    fabricType: "⚠️ Polyester",
    sustainability: {
      score: 45,
      rating: "moderate",
    },
    properties: {
      durability: "Very High - Lasts 10+ years",
      breathability: "Poor - Synthetic material",
      care: "Machine wash, tumble dry safe",
    },
    impacts: {
      water: "Moderate - Uses water in production",
      carbon: "High - Petroleum-based plastic",
      chemicals: "Moderate - Synthetic dyes used",
    },
    recommendations: [
      "Look for recycled polyester alternatives",
      "Choose blends with natural fibers",
      "Maximize garment lifespan to offset impact",
      "Consider bio-based alternatives like mylo or lab-grown leather",
    ],
    icon: "♻️",
  },
  linen: {
    fabricType: "🌿 Linen",
    sustainability: {
      score: 88,
      rating: "excellent",
    },
    properties: {
      durability: "Very High - Improves with age",
      breathability: "Excellent - Best for hot weather",
      care: "Hand wash, air dry recommended",
    },
    impacts: {
      water: "Low - Minimal water required",
      carbon: "Low - Flax plant cultivation",
      chemicals: "Minimal - Few pesticides needed",
    },
    recommendations: [
      "Premium sustainable choice",
      "Perfect for summer clothing",
      "Natural wrinkles add character",
      "Becomes softer with each wash",
    ],
    icon: "👕",
  },
  wool: {
    fabricType: "🧶 Wool",
    sustainability: {
      score: 85,
      rating: "excellent",
    },
    properties: {
      durability: "Very High - Lasts 10+ years",
      breathability: "Good - Natural temperature regulation",
      care: "Hand wash, lay flat dry",
    },
    impacts: {
      water: "Moderate - Sheep grazing systems",
      carbon: "Moderate - Animal farming impact",
      chemicals: "Variable - Depends on processing",
    },
    recommendations: [
      "Choose ethical sourcing (RWS certified)",
      "Excellent insulation properties",
      "Invest in quality for longevity",
      "Check for mulesing-free certification",
    ],
    icon: "🐑",
  },
  silk: {
    fabricType: "✨ Silk",
    sustainability: {
      score: 78,
      rating: "good",
    },
    properties: {
      durability: "High - Lasts 5+ years",
      breathability: "Excellent - Luxurious drape",
      care: "Hand wash, dry cleaning recommended",
    },
    impacts: {
      water: "Moderate - Sericulture water use",
      carbon: "Low - Natural protein fiber",
      chemicals: "Varies - Dye processing impact",
    },
    recommendations: [
      "Luxury sustainable choice",
      "Support ethical sericulture",
      "Perfect for special occasions",
      "Requires gentle care for longevity",
    ],
    icon: "🎀",
  },
  "recycled polyester": {
    fabricType: "♻️ Recycled Polyester",
    sustainability: {
      score: 72,
      rating: "good",
    },
    properties: {
      durability: "Very High - Lasts 10+ years",
      breathability: "Poor - Synthetic material",
      care: "Machine wash, tumble dry safe",
    },
    impacts: {
      water: "Low - Recycled content",
      carbon: "Moderate - Production energy",
      chemicals: "Minimal - Secondary material",
    },
    recommendations: [
      "Much better than virgin polyester",
      "Supports circular economy",
      "Blend with natural fibers for comfort",
      "Encourages waste reduction",
    ],
    icon: "♻️",
  },
};

export default function FabricScanner() {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [detectedFabric, setDetectedFabric] = useState<FabricAnalysis | null>(
    null,
  );
  const [loading, setLoading] = useState(false);
  const [manualInput, setManualInput] = useState("");

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      processFile(files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setUploadedImage(event.target?.result as string);
      analyzeFabric();
    };
    reader.readAsDataURL(file);
  };

  const analyzeFabric = async () => {
    setLoading(true);
    // Simulate AI analysis
    setTimeout(() => {
      const fabrics = Object.keys(fabricDatabase);
      const randomFabric = fabrics[Math.floor(Math.random() * fabrics.length)];
      setDetectedFabric(fabricDatabase[randomFabric]);
      setLoading(false);
      toast.success("Fabric analysis complete!");
    }, 2000);
  };

  const detectFromInput = () => {
    if (!manualInput.trim()) {
      toast.error("Please enter a fabric type");
      return;
    }

    const lowerInput = manualInput.toLowerCase();
    const matches = Object.keys(fabricDatabase).filter(
      (fabric) => fabric.includes(lowerInput) || lowerInput.includes(fabric),
    );

    if (matches.length > 0) {
      setDetectedFabric(fabricDatabase[matches[0]]);
    } else {
      toast.error(
        `Fabric "${manualInput}" not in database. Try: organic cotton, polyester, linen, wool, silk, or recycled polyester`,
      );
    }
  };

  const getSustainabilityColor = (rating: string) => {
    switch (rating) {
      case "excellent":
        return "text-green-600 bg-green-100 border-green-300";
      case "good":
        return "text-blue-600 bg-blue-100 border-blue-300";
      case "moderate":
        return "text-yellow-600 bg-yellow-100 border-yellow-300";
      case "poor":
        return "text-red-600 bg-red-100 border-red-300";
      default:
        return "text-gray-600 bg-gray-100 border-gray-300";
    }
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="w-full bg-gradient-to-b from-primary/10 to-background border-b border-border/40 py-12 md:py-16">
        <div className="container max-w-7xl mx-auto px-4 md:px-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Zap className="w-8 h-8 text-primary" />
              <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                Fabric Intelligence Scanner
              </h1>
            </div>
            <p className="text-lg text-foreground/70 max-w-2xl">
              Upload a clothing tag or receipt. AI detects fabric type and rates
              sustainability impact
            </p>
          </div>
        </div>
      </section>

      <main className="w-full py-12 md:py-16">
        <div className="container max-w-4xl mx-auto px-4 md:px-6 space-y-8">
          {/* Upload Zone */}
          <section className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                📸 Scan Fabric Tag
              </h2>
              <p className="text-foreground/70">
                Upload an image or enter fabric type manually
              </p>
            </div>

            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-xl p-12 text-center transition-all ${
                dragActive
                  ? "border-primary bg-primary/5"
                  : "border-border/50 bg-muted/20 hover:border-primary/50"
              } cursor-pointer`}
              onClick={() => document.getElementById("fileInput")?.click()}
            >
              <input
                id="fileInput"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />

              <div className="space-y-4">
                <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center mx-auto">
                  <Upload className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-foreground">
                    Drag & drop your fabric tag image
                  </h3>
                  <p className="text-foreground/70 mt-1">
                    Or click to browse from your device
                  </p>
                </div>
                <p className="text-sm text-foreground/50">
                  Supports JPG, PNG, WebP (Max 10MB)
                </p>
              </div>
            </div>

            {/* Manual Input */}
            <div className="space-y-3">
              <p className="text-center text-foreground/70 font-medium">
                Or enter fabric type manually
              </p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={manualInput}
                  onChange={(e) => setManualInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && detectFromInput()}
                  placeholder="e.g., organic cotton, polyester, linen..."
                  className="flex-1 px-4 py-3 bg-muted border border-border/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                />
                <button
                  onClick={detectFromInput}
                  className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-all"
                >
                  Analyze
                </button>
              </div>
            </div>

            {/* Uploaded Image */}
            {uploadedImage && (
              <div className="rounded-lg overflow-hidden border border-border/50">
                <img
                  src={uploadedImage}
                  alt="Uploaded fabric tag"
                  className="w-full max-h-96 object-cover"
                />
              </div>
            )}
          </section>

          {/* Analysis Results */}
          {loading && (
            <div className="card-base p-12 text-center space-y-4">
              <div className="w-12 h-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin mx-auto" />
              <p className="text-foreground/70 font-medium">
                Analyzing fabric composition...
              </p>
            </div>
          )}

          {detectedFabric && !loading && (
            <div className="space-y-8 animate-slide-up">
              {/* Main Result */}
              <div className="card-base p-8 space-y-6 bg-gradient-to-br from-primary/5 to-nature/5 border-2 border-primary/20">
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Fabric Type & Score */}
                  <div className="space-y-6">
                    <div className="space-y-3">
                      <div className="text-5xl">{detectedFabric.icon}</div>
                      <h3 className="text-3xl font-bold text-foreground">
                        {detectedFabric.fabricType}
                      </h3>
                    </div>

                    {/* Sustainability Score */}
                    <div className="space-y-3">
                      <p className="text-sm font-semibold text-foreground/70">
                        Sustainability Score
                      </p>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-2xl font-bold text-foreground">
                            {detectedFabric.sustainability.score}/100
                          </span>
                          <span
                            className={`px-4 py-2 rounded-full font-semibold text-sm border ${getSustainabilityColor(
                              detectedFabric.sustainability.rating,
                            )}`}
                          >
                            {detectedFabric.sustainability.rating.toUpperCase()}
                          </span>
                        </div>
                        <div className="w-full bg-border/30 rounded-full h-2 overflow-hidden">
                          <div
                            className="bg-gradient-to-r from-green-500 to-primary h-full transition-all"
                            style={{
                              width: `${detectedFabric.sustainability.score}%`,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Environmental Impacts */}
                  <div className="space-y-3">
                    <h4 className="font-bold text-foreground mb-4">
                      Environmental Impacts
                    </h4>
                    <div className="space-y-3">
                      <div className="p-4 bg-blue-50/50 border border-blue-200/50 rounded-lg space-y-2">
                        <div className="flex items-center gap-2">
                          <Droplet className="w-5 h-5 text-blue-600" />
                          <p className="font-semibold text-blue-900">
                            Water Use
                          </p>
                        </div>
                        <p className="text-sm text-blue-800">
                          {detectedFabric.impacts.water}
                        </p>
                      </div>

                      <div className="p-4 bg-orange-50/50 border border-orange-200/50 rounded-lg space-y-2">
                        <div className="flex items-center gap-2">
                          <Flame className="w-5 h-5 text-orange-600" />
                          <p className="font-semibold text-orange-900">
                            Carbon
                          </p>
                        </div>
                        <p className="text-sm text-orange-800">
                          {detectedFabric.impacts.carbon}
                        </p>
                      </div>

                      <div className="p-4 bg-red-50/50 border border-red-200/50 rounded-lg space-y-2">
                        <div className="flex items-center gap-2">
                          <AlertCircle className="w-5 h-5 text-red-600" />
                          <p className="font-semibold text-red-900">
                            Chemicals
                          </p>
                        </div>
                        <p className="text-sm text-red-800">
                          {detectedFabric.impacts.chemicals}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Properties */}
              <div className="grid md:grid-cols-3 gap-6">
                <div className="card-base p-6 space-y-3 hover:shadow-lg transition-all">
                  <h4 className="font-bold text-foreground flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                    Durability
                  </h4>
                  <p className="text-sm text-foreground/70">
                    {detectedFabric.properties.durability}
                  </p>
                </div>

                <div className="card-base p-6 space-y-3 hover:shadow-lg transition-all">
                  <h4 className="font-bold text-foreground flex items-center gap-2">
                    <Leaf className="w-5 h-5 text-primary" />
                    Breathability
                  </h4>
                  <p className="text-sm text-foreground/70">
                    {detectedFabric.properties.breathability}
                  </p>
                </div>

                <div className="card-base p-6 space-y-3 hover:shadow-lg transition-all">
                  <h4 className="font-bold text-foreground flex items-center gap-2">
                    <ImageIcon className="w-5 h-5 text-primary" />
                    Care Instructions
                  </h4>
                  <p className="text-sm text-foreground/70">
                    {detectedFabric.properties.care}
                  </p>
                </div>
              </div>

              {/* Recommendations */}
              <div className="card-base p-8 space-y-6 bg-gradient-to-r from-primary/5 to-nature/5 border-2 border-primary/20">
                <h3 className="text-xl font-bold text-foreground">
                  💡 Recommendations
                </h3>
                <div className="space-y-3">
                  {detectedFabric.recommendations.map((rec, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3 p-3 bg-card border border-border/50 rounded-lg"
                    >
                      <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <p className="text-foreground/80 text-sm">{rec}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Fabric Reference */}
              <div className="card-base p-8 space-y-6">
                <h3 className="text-xl font-bold text-foreground">
                  📚 Other Fabrics in Database
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {Object.entries(fabricDatabase).map(([key, fabric]) => (
                    <button
                      key={key}
                      onClick={() => {
                        setDetectedFabric(fabric);
                        setUploadedImage(null);
                        setManualInput("");
                      }}
                      className="p-4 rounded-lg border border-border/50 bg-muted/20 hover:border-primary/50 text-center transition-all text-sm"
                    >
                      <div className="text-2xl mb-1">{fabric.icon}</div>
                      <div className="font-semibold text-foreground line-clamp-1">
                        {key}
                      </div>
                      <div className="text-xs text-foreground/60">
                        Score: {fabric.sustainability.score}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </Layout>
  );
}
