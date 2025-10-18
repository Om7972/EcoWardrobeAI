import { useState } from "react";
import { Loader, AlertCircle, CheckCircle, Info } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, ResponsiveContainer } from "recharts";

interface FootprintResult {
  materials: Array<{
    name: string;
    percentage: number;
    waterUsage: number;
    microplasticRisk: "Low" | "Medium" | "High";
    durabilityScore: number;
  }>;
  totalWaterUsage: number;
  overallMicroplasticRisk: "Low" | "Medium" | "High";
  averageDurabilityScore: number;
  analysis: string;
  recommendations: string[];
  carbonFootprint: number;
}

export function MaterialFootprintAnalyzer() {
  const [composition, setComposition] = useState("");
  const [result, setResult] = useState<FootprintResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!composition.trim()) {
      setError("Please enter material composition");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/features/analyze-footprint", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ materialComposition: composition }),
      });

      if (!res.ok) throw new Error("Failed to analyze");

      const data = await res.json();
      setResult(data.data);
    } catch (err) {
      setError("Failed to analyze material composition");
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "Low":
        return "text-green-600";
      case "Medium":
        return "text-yellow-600";
      case "High":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const getRiskBgColor = (risk: string) => {
    switch (risk) {
      case "Low":
        return "bg-green-100";
      case "Medium":
        return "bg-yellow-100";
      case "High":
        return "bg-red-100";
      default:
        return "bg-gray-100";
    }
  };

  const getDurabilityColor = (score: number) => {
    if (score >= 8) return "text-green-600";
    if (score >= 6) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="space-y-8">
      {/* Input Section */}
      <div className="card-base p-8 space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Material Footprint Analyzer
          </h2>
          <p className="text-foreground/70">
            Analyze environmental impact of clothing materials
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">
              Material Composition
            </label>
            <p className="text-xs text-foreground/60 mb-3">
              Examples: "100% Cotton", "50% Cotton, 50% Polyester", "100% Organic Linen"
            </p>
            <input
              type="text"
              value={composition}
              onChange={(e) => setComposition(e.target.value)}
              placeholder="Enter material composition..."
              className="w-full px-4 py-3 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>

          <button
            onClick={handleAnalyze}
            disabled={loading || !composition.trim()}
            className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                Analyzing...
              </>
            ) : (
              "Analyze Footprint"
            )}
          </button>
        </div>

        {error && (
          <div className="p-4 bg-red-100 text-red-900 rounded-lg flex gap-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}
      </div>

      {/* Results Section */}
      {result && (
        <div className="space-y-6 animate-slide-up">
          {/* Analysis Summary */}
          <div className={`card-base p-6 border-l-4 ${
            result.analysis.includes("Excellent")
              ? "border-green-500"
              : result.analysis.includes("⚠️")
              ? "border-red-500"
              : "border-yellow-500"
          }`}>
            <div className="flex gap-4">
              {result.analysis.includes("Excellent") ? (
                <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0" />
              ) : result.analysis.includes("⚠️") ? (
                <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0" />
              ) : (
                <Info className="w-6 h-6 text-yellow-600 flex-shrink-0" />
              )}
              <div>
                <p className="text-foreground font-semibold mb-2">Analysis</p>
                <p className="text-foreground/70">{result.analysis}</p>
              </div>
            </div>
          </div>

          {/* Key Metrics - Gauges */}
          <div className="grid md:grid-cols-3 gap-6">
            {/* Water Usage Gauge */}
            <div className="card-base p-6 space-y-4">
              <h3 className="font-semibold text-foreground">Water Usage</h3>
              <div className="flex items-center justify-center py-8">
                <div className="text-center">
                  <div className="text-5xl font-bold text-blue-600">
                    {result.totalWaterUsage.toLocaleString()}
                  </div>
                  <p className="text-sm text-foreground/70 mt-2">Litres per garment</p>
                </div>
              </div>
              <div className="bg-blue-100 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-blue-600 h-full transition-all"
                  style={{
                    width: Math.min((result.totalWaterUsage / 5000) * 100, 100) + "%",
                  }}
                />
              </div>
              <p className="text-xs text-foreground/60">
                {result.totalWaterUsage > 3000
                  ? "High water intensity - extend garment lifespan"
                  : "Moderate water usage"}
              </p>
            </div>

            {/* Microplastic Risk */}
            <div className="card-base p-6 space-y-4">
              <h3 className="font-semibold text-foreground">Microplastic Risk</h3>
              <div className={`flex items-center justify-center py-8 rounded-lg ${getRiskBgColor(
                result.overallMicroplasticRisk
              )}`}>
                <div className="text-center">
                  <div className={`text-5xl font-bold ${getRiskColor(
                    result.overallMicroplasticRisk
                  )}`}>
                    {result.overallMicroplasticRisk}
                  </div>
                  <p className="text-sm mt-2 text-foreground/70">
                    {result.overallMicroplasticRisk === "High"
                      ? "Use filter when washing"
                      : "Monitor during washing"}
                  </p>
                </div>
              </div>
              <div className="h-8 bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 rounded flex items-center justify-between px-2 text-xs text-white font-semibold">
                <span>Low</span>
                <span>Med</span>
                <span>High</span>
              </div>
            </div>

            {/* Durability Score */}
            <div className="card-base p-6 space-y-4">
              <h3 className="font-semibold text-foreground">Durability Score</h3>
              <div className="flex items-center justify-center py-8">
                <div className="text-center">
                  <div className={`text-5xl font-bold ${getDurabilityColor(
                    result.averageDurabilityScore
                  )}`}>
                    {result.averageDurabilityScore}
                    <span className="text-2xl">/10</span>
                  </div>
                  <p className="text-sm text-foreground/70 mt-2">
                    {result.averageDurabilityScore >= 8
                      ? "Highly durable"
                      : result.averageDurabilityScore >= 6
                      ? "Moderately durable"
                      : "Lower durability"}
                  </p>
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-foreground/70">Durability</span>
                  <span className="font-semibold">{result.averageDurabilityScore}/10</span>
                </div>
                <div className="h-3 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary to-nature"
                    style={{
                      width: (result.averageDurabilityScore / 10) * 100 + "%",
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Carbon Footprint */}
          <div className="card-base p-6">
            <h3 className="font-semibold text-foreground mb-4">Carbon Footprint</h3>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-4xl font-bold text-primary">
                  {result.carbonFootprint.toFixed(1)}
                </p>
                <p className="text-sm text-foreground/70">kg CO2 equivalent</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-foreground/70 mb-2">Equivalent to:</p>
                <p className="text-sm font-semibold text-foreground">
                  {(result.carbonFootprint * 4).toFixed(1)} km driving
                </p>
              </div>
            </div>
          </div>

          {/* Material Breakdown */}
          <div className="card-base p-6 space-y-6">
            <h3 className="font-semibold text-foreground">Material Breakdown</h3>

            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={result.materials}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="name" stroke="var(--muted-foreground)" />
                <YAxis stroke="var(--muted-foreground)" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "var(--card)",
                    border: `1px solid var(--border)`,
                    borderRadius: "0.75rem",
                  }}
                  textStyle={{ color: "var(--foreground)" }}
                />
                <Bar dataKey="durabilityScore" fill="var(--primary)" name="Durability" />
              </BarChart>
            </ResponsiveContainer>

            <div className="space-y-3">
              {result.materials.map((material) => (
                <div key={material.name} className="p-4 bg-muted/30 rounded-lg space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-foreground capitalize">
                      {material.name}
                    </span>
                    <span className="px-3 py-1 bg-primary/20 text-primary rounded-full text-sm font-bold">
                      {material.percentage}%
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-foreground/70">Water: {material.waterUsage}L</p>
                    </div>
                    <div>
                      <p className={`font-medium ${getRiskColor(material.microplasticRisk)}`}>
                        Microplastic: {material.microplasticRisk}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recommendations */}
          <div className="card-base p-6 space-y-4 border-l-4 border-primary">
            <h3 className="font-semibold text-foreground">Care Recommendations</h3>
            <ul className="space-y-2">
              {result.recommendations.map((rec, idx) => (
                <li key={idx} className="flex gap-3 text-foreground/70">
                  <span className="text-primary font-bold flex-shrink-0">✓</span>
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
