import { useState } from "react";
import Layout from "@/components/Layout";
import { CircularMatchesModal } from "@/components/CircularMatchesModal";
import { EcoMaintenanceWidget } from "@/components/EcoMaintenanceWidget";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Leaf,
  Droplet,
  Wind,
  Zap,
  TrendingUp,
  Calendar,
  Heart,
  Star,
  ArrowRight,
  ChevronRight,
  Award,
  Sparkles,
  Shuffle,
} from "lucide-react";
import { useGetImpactMetrics, useGetAchievements, useGetUserCloset, useGetUserOutfits } from "@/hooks/useApi";
import { EcoScoreCard } from "@/components/EcoScoreCard";

const DEMO_USER_ID = "demo-user-123";

export default function Dashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState("week");
  const [showCircularMatches, setShowCircularMatches] = useState(false);

  const { data: impactData } = useGetImpactMetrics(DEMO_USER_ID);
  const { data: achievementsData } = useGetAchievements(DEMO_USER_ID);
  const { data: closetData } = useGetUserCloset(DEMO_USER_ID);
  const { data: outfitsData } = useGetUserOutfits(DEMO_USER_ID);

  const impactChartData = [
    { day: "Mon", water: 120, emissions: 45, waste: 23 },
    { day: "Tue", water: 140, emissions: 52, waste: 28 },
    { day: "Wed", water: 100, emissions: 38, waste: 18 },
    { day: "Thu", water: 160, emissions: 65, waste: 35 },
    { day: "Fri", water: 130, emissions: 48, waste: 24 },
    { day: "Sat", water: 180, emissions: 72, waste: 42 },
    { day: "Sun", water: 150, emissions: 58, waste: 31 },
  ];

  const categoryData = closetData?.data?.length > 0 
    ? [
        {
          name: "Tops",
          value: closetData.data.filter((item: any) => item.category === "tops").length,
        },
        {
          name: "Bottoms",
          value: closetData.data.filter((item: any) => item.category === "bottoms").length,
        },
        {
          name: "Dresses",
          value: closetData.data.filter((item: any) => item.category === "dresses").length,
        },
        {
          name: "Shoes",
          value: closetData.data.filter((item: any) => item.category === "shoes").length,
        },
      ]
    : [];

  const COLORS = ["#2d6f4c", "#4a9d6f", "#6db88f", "#8dd4ae"];

  const topEcoScoreItems = closetData?.data
    ?.sort((a: any, b: any) => b.ecoScore - a.ecoScore)
    ?.slice(0, 3) || [];

  const recentOutfits = outfitsData?.data?.slice(0, 3) || [];

  return (
    <Layout>
      {/* Header */}
      <section className="w-full bg-gradient-to-b from-primary/5 to-background border-b border-border/40 py-8 md:py-12">
        <div className="container max-w-7xl mx-auto px-4 md:px-6">
          <div className="space-y-4">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
              Welcome Back! 👋
            </h1>
            <p className="text-lg text-foreground/70">
              Here's what's happening with your wardrobe this week
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="w-full py-12 md:py-16">
        <div className="container max-w-7xl mx-auto px-4 md:px-6 space-y-8">
          {/* Sustainability Metrics Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Water Saved */}
            <div className="card-base p-6 space-y-4 group hover:border-primary/30">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                  <Droplet className="w-6 h-6 text-blue-500" />
                </div>
                <TrendingUp className="w-5 h-5 text-impact-positive" />
              </div>
              <div>
                <p className="text-3xl font-bold text-foreground">
                  {impactData?.data?.waterSaved
                    ? (impactData.data.waterSaved / 1000).toFixed(1)
                    : "2.4"}
                  K
                </p>
                <p className="text-sm text-foreground/60">Liters Saved This Week</p>
              </div>
              <div className="h-1 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 w-3/4 rounded-full" />
              </div>
            </div>

            {/* CO2 Reduced */}
            <div className="card-base p-6 space-y-4 group hover:border-primary/30">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-lg bg-nature/10 flex items-center justify-center group-hover:bg-nature/20 transition-colors">
                  <Wind className="w-6 h-6 text-nature" />
                </div>
                <TrendingUp className="w-5 h-5 text-impact-positive" />
              </div>
              <div>
                <p className="text-3xl font-bold text-foreground">
                  {impactData?.data?.co2Reduced
                    ? (impactData.data.co2Reduced / 1000).toFixed(1)
                    : "12.5"}
                </p>
                <p className="text-sm text-foreground/60">kg CO2 Avoided</p>
              </div>
              <div className="h-1 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-nature w-2/3 rounded-full" />
              </div>
            </div>

            {/* Items in Closet */}
            <div className="card-base p-6 space-y-4 group hover:border-primary/30">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Leaf className="w-6 h-6 text-primary" />
                </div>
                <TrendingUp className="w-5 h-5 text-impact-positive" />
              </div>
              <div>
                <p className="text-3xl font-bold text-foreground">
                  {closetData?.count || 0}
                </p>
                <p className="text-sm text-foreground/60">Items Catalogued</p>
              </div>
              <div className="h-1 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary w-4/5 rounded-full"
                  style={{ width: `${Math.min(100, (closetData?.count || 0) * 5)}%` }}
                />
              </div>
            </div>

            {/* Outfits Created */}
            <div className="card-base p-6 space-y-4 group hover:border-primary/30">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                  <Zap className="w-6 h-6 text-accent" />
                </div>
                <TrendingUp className="w-5 h-5 text-impact-positive" />
              </div>
              <div>
                <p className="text-3xl font-bold text-foreground">
                  {outfitsData?.count || 0}
                </p>
                <p className="text-sm text-foreground/60">Outfits This Week</p>
              </div>
              <div className="h-1 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-accent w-3/4 rounded-full" />
              </div>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Impact Trend Chart */}
            <div className="lg:col-span-2 card-base p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-foreground">
                  Impact Trend
                </h2>
                <div className="flex gap-2">
                  {["week", "month", "year"].map((period) => (
                    <button
                      key={period}
                      onClick={() => setSelectedPeriod(period)}
                      className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                        selectedPeriod === period
                          ? "bg-primary/20 text-primary"
                          : "text-foreground/60 hover:text-foreground hover:bg-muted/50"
                      }`}
                    >
                      {period.charAt(0).toUpperCase() + period.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={impactChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="day" stroke="var(--muted-foreground)" />
                  <YAxis stroke="var(--muted-foreground)" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "var(--card)",
                      border: `1px solid var(--border)`,
                      borderRadius: "0.75rem",
                    }}
                    textStyle={{ color: "var(--foreground)" }}
                  />
                  <Line
                    type="monotone"
                    dataKey="water"
                    stroke="#0ea5e9"
                    strokeWidth={2}
                    dot={{ fill: "#0ea5e9", r: 4 }}
                    name="Water Saved (L)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Closet Composition */}
            {categoryData.length > 0 && (
              <div className="card-base p-6 flex flex-col">
                <h2 className="text-xl font-semibold text-foreground mb-6">
                  Closet Composition
                </h2>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "var(--card)",
                        border: `1px solid var(--border)`,
                        borderRadius: "0.75rem",
                      }}
                      textStyle={{ color: "var(--foreground)" }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="space-y-2 mt-6">
                  {categoryData.map((item, index) => (
                    <div key={item.name} className="flex items-center gap-3">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: COLORS[index] }}
                      />
                      <span className="text-sm text-foreground/70">
                        {item.name}
                      </span>
                      <span className="ml-auto text-sm font-semibold text-foreground">
                        {item.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Top Eco Score Items */}
            {topEcoScoreItems.length > 0 && (
              <div className="lg:col-span-1">
                <h2 className="text-xl font-semibold text-foreground mb-4">
                  Most Sustainable Items
                </h2>
                <div className="space-y-4">
                  {topEcoScoreItems.map((item: any) => (
                    <div
                      key={item._id}
                      className="card-base p-4 space-y-2"
                    >
                      <div className="flex items-start justify-between">
                        <h4 className="font-semibold text-foreground text-sm">
                          {item.title}
                        </h4>
                        <span className="px-2 py-1 bg-primary/10 text-primary rounded text-xs font-bold">
                          {item.ecoScore}
                        </span>
                      </div>
                      <p className="text-xs text-foreground/60">
                        {item.brand || "No brand"}
                      </p>
                      <div className="h-1 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-primary to-nature"
                          style={{ width: `${item.ecoScore}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Outfit Suggestions */}
            <div className={recentOutfits.length > 0 ? "lg:col-span-2" : "lg:col-span-3"}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-foreground">
                  Recent Outfits
                </h2>
                <a
                  href="/outfit-generator"
                  className="text-primary hover:text-primary/80 font-semibold flex items-center gap-1 transition-colors"
                >
                  View All
                  <ChevronRight className="w-4 h-4" />
                </a>
              </div>
              {recentOutfits.length > 0 ? (
                <div className="space-y-4">
                  {recentOutfits.map((outfit: any) => (
                    <div
                      key={outfit._id}
                      className="flex items-center justify-between p-4 rounded-lg border border-border/40 hover:border-primary/30 hover:bg-muted/20 transition-all group card-base"
                    >
                      <div className="flex items-center gap-4">
                        <div className="text-4xl">👗</div>
                        <div>
                          <h4 className="font-semibold text-foreground">
                            {outfit.title}
                          </h4>
                          <p className="text-sm text-foreground/60">
                            {outfit.items?.length || 0} items
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        {outfit.rating && (
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-accent text-accent" />
                            <span className="text-sm font-medium text-foreground">
                              {outfit.rating}
                            </span>
                          </div>
                        )}
                        <button className="p-2 hover:bg-primary/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100">
                          <Heart className="w-5 h-5 text-foreground/40" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="card-base p-8 text-center space-y-4">
                  <Sparkles className="w-8 h-8 text-foreground/40 mx-auto" />
                  <p className="text-foreground/70">
                    No outfits generated yet. Start with the AI Outfit Generator!
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Achievements Section */}
          {achievementsData?.data?.length > 0 && (
            <div className="card-base p-8 space-y-6">
              <div className="flex items-center gap-2">
                <Award className="w-6 h-6 text-accent" />
                <h2 className="text-2xl font-bold text-foreground">
                  Achievements
                </h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {achievementsData.data.map((achievement: any) => (
                  <div
                    key={achievement.id}
                    className="text-center p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                  >
                    <div className="text-4xl mb-2">{achievement.icon}</div>
                    <h4 className="font-semibold text-foreground text-sm">
                      {achievement.title}
                    </h4>
                    <p className="text-xs text-foreground/60 mt-1">
                      {achievement.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Circular Matches Promotion */}
          <div className="card-base p-8 md:p-12 space-y-6 border-l-4 border-primary bg-gradient-to-r from-primary/5 to-transparent">
            <div className="flex items-center justify-between">
              <div className="space-y-3">
                <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
                  <Shuffle className="w-7 h-7 text-primary" />
                  Circular Matches
                </h2>
                <p className="text-foreground/70">
                  Discover perfect swap opportunities with compatible users based on style and size!
                </p>
              </div>
              <button
                onClick={() => setShowCircularMatches(true)}
                className="px-8 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors whitespace-nowrap"
              >
                Explore Matches
              </button>
            </div>
          </div>

          {/* Eco-Maintenance Section */}
          <div className="border-t border-border/40 pt-12">
            <EcoMaintenanceWidget />
          </div>

          {/* CTA Section */}
          <div className="bg-gradient-to-r from-primary/10 to-nature/10 rounded-xl border border-primary/20 p-8 md:p-12">
            <div className="max-w-2xl">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                Ready to explore more?
              </h2>
              <p className="text-foreground/70 mb-6">
                Visit your virtual closet to add more items, or generate new outfit ideas with our AI-powered suggestion engine.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href="/closet"
                  className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors group"
                >
                  Virtual Closet
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>
                <a
                  href="/outfit-generator"
                  className="inline-flex items-center justify-center px-6 py-3 border border-border bg-background rounded-lg font-semibold text-foreground hover:bg-muted/50 transition-colors group"
                >
                  AI Generator
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            </div>
          </div>

          {/* Circular Matches Modal */}
          <CircularMatchesModal
            isOpen={showCircularMatches}
            onClose={() => setShowCircularMatches(false)}
            userStyles={["casual", "minimalist", "vintage"]}
          />
        </div>
      </main>
    </Layout>
  );
}
