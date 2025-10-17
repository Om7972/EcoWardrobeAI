import { useState } from "react";
import Layout from "@/components/Layout";
import {
  Wand2,
  Heart,
  Share2,
  ArrowRight,
  Sparkles,
  Cloud,
  Loader,
  Star,
  Download,
} from "lucide-react";
import { useGenerateOutfit, useGetUserOutfits, useToggleSaveOutfit, useRateOutfit } from "@/hooks/useApi";
import { toast } from "sonner";

const DEMO_USER_ID = "demo-user-123";

const occasions = [
  { id: "casual", label: "Casual", emoji: "👕" },
  { id: "work", label: "Work", emoji: "💼" },
  { id: "formal", label: "Formal", emoji: "🎩" },
  { id: "party", label: "Party", emoji: "🎉" },
  { id: "weekend", label: "Weekend", emoji: "🌞" },
];

const weatherOptions = [
  { id: "sunny", label: "Sunny", emoji: "☀️" },
  { id: "cloudy", label: "Cloudy", emoji: "☁️" },
  { id: "rainy", label: "Rainy", emoji: "🌧️" },
  { id: "cold", label: "Cold", emoji: "❄️" },
  { id: "hot", label: "Hot", emoji: "🔥" },
];

const stylePreferences = [
  "Minimalist",
  "Bohemian",
  "Classic",
  "Trendy",
  "Sporty",
  "Vintage",
  "Edgy",
  "Elegant",
];

export default function OutfitGenerator() {
  const [selectedOccasion, setSelectedOccasion] = useState<string | null>(null);
  const [selectedWeather, setSelectedWeather] = useState<string | null>(null);
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
  const [showResults, setShowResults] = useState(false);

  const generateMutation = useGenerateOutfit();
  const { data: outfitsData, refetch: refetchOutfits } = useGetUserOutfits(DEMO_USER_ID);
  const saveOutfitMutation = useToggleSaveOutfit();
  const rateOutfitMutation = useRateOutfit();

  const handleGenerateOutfit = () => {
    if (!selectedOccasion) {
      toast.error("Please select an occasion");
      return;
    }

    generateMutation.mutate(
      {
        userId: DEMO_USER_ID,
        occasion: selectedOccasion as any,
        weather: selectedWeather || "Sunny",
        stylePreferences: selectedStyles,
      },
      {
        onSuccess: () => {
          setShowResults(true);
          refetchOutfits();
          toast.success("Outfit generated successfully!");
        },
        onError: () => {
          toast.error("Failed to generate outfit");
        },
      }
    );
  };

  const handleToggleSaveOutfit = (outfitId: string) => {
    saveOutfitMutation.mutate(outfitId, {
      onSuccess: () => {
        refetchOutfits();
        toast.success("Outfit saved!");
      },
      onError: () => {
        toast.error("Failed to save outfit");
      },
    });
  };

  const handleRateOutfit = (outfitId: string, rating: number) => {
    rateOutfitMutation.mutate(
      { outfitId, rating },
      {
        onSuccess: () => {
          refetchOutfits();
          toast.success(`Rated ${rating}/5`);
        },
        onError: () => {
          toast.error("Failed to rate outfit");
        },
      }
    );
  };

  const toggleStyle = (style: string) => {
    setSelectedStyles((prev) =>
      prev.includes(style) ? prev.filter((s) => s !== style) : [...prev, style]
    );
  };

  const generatedOutfit = generateMutation.data?.data?.outfit;
  const outfitDescription = generateMutation.data?.data?.description;
  const suggestions = generateMutation.data?.data?.suggestions || [];
  const weatherInfo = generateMutation.data?.data?.weatherInfo;

  return (
    <Layout>
      <section className="w-full bg-gradient-to-b from-primary/5 to-background border-b border-border/40 py-8 md:py-12">
        <div className="container max-w-7xl mx-auto px-4 md:px-6">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">
            AI Outfit Generator
          </h1>
          <p className="text-lg text-foreground/70 mt-2">
            Get personalized outfit suggestions powered by AI
          </p>
        </div>
      </section>

      <main className="w-full py-12 md:py-16">
        <div className="container max-w-7xl mx-auto px-4 md:px-6 space-y-12">
          {!showResults ? (
            <>
              {/* Generator Form */}
              <div className="grid lg:grid-cols-3 gap-8">
                {/* Left: Preferences */}
                <div className="lg:col-span-1 space-y-8">
                  {/* Occasion Selection */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-primary" />
                      Occasion
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-2 gap-3">
                      {occasions.map((occ) => (
                        <button
                          key={occ.id}
                          onClick={() => setSelectedOccasion(occ.id)}
                          className={`p-4 rounded-lg font-medium transition-all flex flex-col items-center gap-2 ${
                            selectedOccasion === occ.id
                              ? "bg-primary text-primary-foreground shadow-lg"
                              : "bg-muted text-foreground hover:bg-muted/80 border border-border"
                          }`}
                        >
                          <span className="text-2xl">{occ.emoji}</span>
                          <span className="text-sm">{occ.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Weather Selection */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                      <Cloud className="w-5 h-5 text-accent" />
                      Weather
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-2 gap-3">
                      {weatherOptions.map((weather) => (
                        <button
                          key={weather.id}
                          onClick={() => setSelectedWeather(weather.id)}
                          className={`p-4 rounded-lg font-medium transition-all flex flex-col items-center gap-2 ${
                            selectedWeather === weather.id
                              ? "bg-accent text-accent-foreground shadow-lg"
                              : "bg-muted text-foreground hover:bg-muted/80 border border-border"
                          }`}
                        >
                          <span className="text-2xl">{weather.emoji}</span>
                          <span className="text-sm">{weather.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Style Preferences */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-foreground">
                      Style Preferences
                    </h3>
                    <div className="space-y-2">
                      {stylePreferences.map((style) => (
                        <button
                          key={style}
                          onClick={() => toggleStyle(style)}
                          className={`w-full px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                            selectedStyles.includes(style)
                              ? "bg-primary/20 text-primary border border-primary"
                              : "bg-muted text-foreground hover:bg-muted/80 border border-border"
                          }`}
                        >
                          {style}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right: Preview & Generate */}
                <div className="lg:col-span-2 space-y-6">
                  {/* Selection Summary */}
                  <div className="card-base p-8 space-y-6">
                    <h3 className="text-xl font-semibold text-foreground">
                      Your Preferences
                    </h3>

                    <div className="space-y-4">
                      <div>
                        <h4 className="text-sm font-medium text-foreground/70 mb-2">
                          Selected Occasion
                        </h4>
                        {selectedOccasion ? (
                          <div className="inline-block px-4 py-2 bg-primary/20 text-primary rounded-lg font-medium">
                            {occasions.find((o) => o.id === selectedOccasion)?.label}
                          </div>
                        ) : (
                          <p className="text-foreground/60 italic">Not selected</p>
                        )}
                      </div>

                      <div>
                        <h4 className="text-sm font-medium text-foreground/70 mb-2">
                          Weather Condition
                        </h4>
                        {selectedWeather ? (
                          <div className="inline-block px-4 py-2 bg-accent/20 text-accent rounded-lg font-medium">
                            {weatherOptions.find((w) => w.id === selectedWeather)?.label}
                          </div>
                        ) : (
                          <p className="text-foreground/60 italic">Not selected</p>
                        )}
                      </div>

                      <div>
                        <h4 className="text-sm font-medium text-foreground/70 mb-2">
                          Selected Styles ({selectedStyles.length})
                        </h4>
                        {selectedStyles.length > 0 ? (
                          <div className="flex flex-wrap gap-2">
                            {selectedStyles.map((style) => (
                              <span
                                key={style}
                                className="px-3 py-1 bg-muted text-foreground rounded-full text-sm"
                              >
                                {style}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <p className="text-foreground/60 italic">None selected</p>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={handleGenerateOutfit}
                      disabled={!selectedOccasion || generateMutation.isPending}
                      className="w-full py-4 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2 group"
                    >
                      {generateMutation.isPending ? (
                        <>
                          <Loader className="w-5 h-5 animate-spin" />
                          Generating Outfit...
                        </>
                      ) : (
                        <>
                          <Wand2 className="w-5 h-5" />
                          Generate Outfit
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </>
                      )}
                    </button>
                  </div>

                  {/* How It Works */}
                  <div className="bg-gradient-to-br from-primary/5 to-nature/5 rounded-xl p-6 space-y-4">
                    <h3 className="font-semibold text-foreground">How It Works</h3>
                    <ul className="space-y-2 text-sm text-foreground/70">
                      <li className="flex gap-3">
                        <span className="text-primary font-bold">1.</span>
                        <span>Select your occasion and weather conditions</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="text-primary font-bold">2.</span>
                        <span>Choose style preferences (optional)</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="text-primary font-bold">3.</span>
                        <span>Our AI analyzes your closet for perfect combinations</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="text-primary font-bold">4.</span>
                        <span>View, rate, and save your outfit suggestions</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Results View */}
              <div className="space-y-8">
                <div className="flex items-center justify-between">
                  <h2 className="text-3xl font-bold text-foreground">
                    Your Generated Outfit
                  </h2>
                  <button
                    onClick={() => setShowResults(false)}
                    className="px-6 py-2 border border-border rounded-lg font-medium hover:bg-muted/50 transition-colors"
                  >
                    Generate Another
                  </button>
                </div>

                {generatedOutfit ? (
                  <div className="grid lg:grid-cols-3 gap-8">
                    {/* Outfit Card */}
                    <div className="lg:col-span-2 space-y-6">
                      <div className="card-base overflow-hidden">
                        <div className="bg-gradient-to-br from-primary/10 to-nature/10 h-96 flex items-center justify-center relative overflow-hidden">
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-center space-y-4">
                              <div className="text-8xl">👗</div>
                              <h3 className="text-2xl font-bold text-foreground">
                                Perfect Outfit Combination
                              </h3>
                            </div>
                          </div>
                        </div>

                        <div className="p-8 space-y-6">
                          <div>
                            <h3 className="text-2xl font-bold text-foreground mb-3">
                              {generatedOutfit.title}
                            </h3>
                            <p className="text-foreground/70 leading-relaxed">
                              {outfitDescription}
                            </p>
                          </div>

                          {/* Weather Info */}
                          {weatherInfo && (
                            <div className="bg-muted/50 p-4 rounded-lg">
                              <h4 className="font-semibold text-foreground mb-2">
                                ☁️ Weather Information
                              </h4>
                              <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                  <span className="text-foreground/70">Condition:</span>
                                  <p className="font-medium text-foreground">
                                    {weatherInfo.description}
                                  </p>
                                </div>
                                <div>
                                  <span className="text-foreground/70">Temperature:</span>
                                  <p className="font-medium text-foreground">
                                    {weatherInfo.temp}°C
                                  </p>
                                </div>
                                <div>
                                  <span className="text-foreground/70">Humidity:</span>
                                  <p className="font-medium text-foreground">
                                    {weatherInfo.humidity}%
                                  </p>
                                </div>
                                <div>
                                  <span className="text-foreground/70">Wind Speed:</span>
                                  <p className="font-medium text-foreground">
                                    {weatherInfo.windSpeed} m/s
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Suggestions */}
                          <div>
                            <h4 className="font-semibold text-foreground mb-3">
                              💡 Styling Tips
                            </h4>
                            <ul className="space-y-2">
                              {suggestions.map((suggestion, idx) => (
                                <li
                                  key={idx}
                                  className="flex gap-3 text-sm text-foreground/70"
                                >
                                  <span className="text-primary font-bold min-w-[20px]">
                                    ✓
                                  </span>
                                  <span>{suggestion}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Actions */}
                          <div className="flex gap-3 pt-4 border-t border-border">
                            <button
                              onClick={() =>
                                handleToggleSaveOutfit(generatedOutfit._id)
                              }
                              className="flex-1 py-3 bg-primary/10 text-primary rounded-lg font-semibold hover:bg-primary/20 transition-colors flex items-center justify-center gap-2"
                            >
                              <Heart className="w-5 h-5" />
                              Save Outfit
                            </button>
                            <button className="flex-1 py-3 border border-border rounded-lg font-semibold hover:bg-muted/50 transition-colors flex items-center justify-center gap-2">
                              <Share2 className="w-5 h-5" />
                              Share
                            </button>
                            <button className="flex-1 py-3 border border-border rounded-lg font-semibold hover:bg-muted/50 transition-colors flex items-center justify-center gap-2">
                              <Download className="w-5 h-5" />
                              Download
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Rating & Details */}
                    <div className="space-y-6">
                      <div className="card-base p-6 space-y-4">
                        <h4 className="font-semibold text-foreground">
                          How do you like it?
                        </h4>
                        <div className="flex gap-2">
                          {[1, 2, 3, 4, 5].map((rating) => (
                            <button
                              key={rating}
                              onClick={() =>
                                handleRateOutfit(generatedOutfit._id, rating)
                              }
                              className="flex-1 py-3 rounded-lg bg-muted hover:bg-primary/20 transition-colors"
                            >
                              <Star
                                className={`w-5 h-5 mx-auto ${
                                  rating <= (generatedOutfit.rating || 0)
                                    ? "fill-accent text-accent"
                                    : "text-foreground/40"
                                }`}
                              />
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Outfit Details */}
                      <div className="card-base p-6 space-y-4">
                        <h4 className="font-semibold text-foreground">
                          Outfit Details
                        </h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-foreground/70">Occasion:</span>
                            <span className="font-medium text-foreground">
                              {occasions.find((o) => o.id === generatedOutfit.occasion)
                                ?.label || "N/A"}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-foreground/70">Weather:</span>
                            <span className="font-medium text-foreground">
                              {generatedOutfit.weather}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-foreground/70">Items:</span>
                            <span className="font-medium text-foreground">
                              {generatedOutfit.items?.length || 0}
                            </span>
                          </div>
                          {generatedOutfit.aiSuggestion?.confidence && (
                            <div className="flex justify-between">
                              <span className="text-foreground/70">Confidence:</span>
                              <span className="font-medium text-foreground">
                                {Math.round(
                                  generatedOutfit.aiSuggestion.confidence * 100
                                )}
                                %
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Previous Outfits */}
                      {outfitsData?.count > 0 && (
                        <div className="card-base p-6 space-y-4">
                          <h4 className="font-semibold text-foreground">
                            Recent Outfits
                          </h4>
                          <div className="space-y-2 max-h-64 overflow-y-auto">
                            {outfitsData.data?.slice(0, 5).map((outfit: any) => (
                              <div
                                key={outfit._id}
                                className="p-2 rounded bg-muted/50 text-xs cursor-pointer hover:bg-muted transition-colors"
                              >
                                <p className="font-medium text-foreground truncate">
                                  {outfit.title}
                                </p>
                                <p className="text-foreground/60">
                                  {outfit.occasion}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="card-base p-12 text-center">
                    <p className="text-foreground/70">Loading outfit...</p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </main>
    </Layout>
  );
}
