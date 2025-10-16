import { useState } from "react";
import Layout from "@/components/Layout";
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
} from "lucide-react";

export default function Dashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState("week");

  // Mock data for charts
  const impactData = [
    { day: "Mon", water: 120, emissions: 45, waste: 23 },
    { day: "Tue", water: 140, emissions: 52, waste: 28 },
    { day: "Wed", water: 100, emissions: 38, waste: 18 },
    { day: "Thu", water: 160, emissions: 65, waste: 35 },
    { day: "Fri", water: 130, emissions: 48, waste: 24 },
    { day: "Sat", water: 180, emissions: 72, waste: 42 },
    { day: "Sun", water: 150, emissions: 58, waste: 31 },
  ];

  const categoryData = [
    { name: "Tops", value: 45 },
    { name: "Bottoms", value: 30 },
    { name: "Dresses", value: 15 },
    { name: "Accessories", value: 10 },
  ];

  const COLORS = ["#2d6f4c", "#4a9d6f", "#6db88f", "#8dd4ae"];

  const recentOutfits = [
    {
      id: 1,
      name: "Casual Weekend",
      items: 3,
      rating: 4.5,
      saved: true,
      emoji: "👕👖",
    },
    {
      id: 2,
      name: "Office Chic",
      items: 4,
      rating: 4.8,
      saved: true,
      emoji: "👔👗",
    },
    {
      id: 3,
      name: "Evening Out",
      items: 3,
      rating: 4.2,
      saved: false,
      emoji: "✨👗",
    },
  ];

  const activityFeed = [
    {
      id: 1,
      action: "Created outfit",
      item: "Casual Weekend",
      time: "2 hours ago",
      impact: "+450L water saved",
    },
    {
      id: 2,
      action: "Uploaded item",
      item: "Blue Denim Jacket",
      time: "5 hours ago",
      impact: "Catalogued",
    },
    {
      id: 3,
      action: "Saved outfit",
      item: "Office Chic",
      time: "1 day ago",
      impact: "+2.5kg CO2 avoided",
    },
    {
      id: 4,
      action: "Completed challenge",
      item: "7-Day No New Purchase",
      time: "2 days ago",
      impact: "+100 points",
    },
  ];

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
                <p className="text-3xl font-bold text-foreground">2.4K</p>
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
                <p className="text-3xl font-bold text-foreground">12.5</p>
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
                <p className="text-3xl font-bold text-foreground">127</p>
                <p className="text-sm text-foreground/60">Items Catalogued</p>
              </div>
              <div className="h-1 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-primary w-4/5 rounded-full" />
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
                <p className="text-3xl font-bold text-foreground">43</p>
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
                <LineChart data={impactData}>
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
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Quick Outfit Suggestions */}
            <div className="lg:col-span-2 card-base p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-foreground">
                  Suggested Outfits
                </h2>
                <a
                  href="#"
                  className="text-primary hover:text-primary/80 font-semibold flex items-center gap-1 transition-colors"
                >
                  View All
                  <ChevronRight className="w-4 h-4" />
                </a>
              </div>
              <div className="space-y-4">
                {recentOutfits.map((outfit) => (
                  <div
                    key={outfit.id}
                    className="flex items-center justify-between p-4 rounded-lg border border-border/40 hover:border-primary/30 hover:bg-muted/20 transition-all group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="text-4xl">{outfit.emoji}</div>
                      <div>
                        <h4 className="font-semibold text-foreground">
                          {outfit.name}
                        </h4>
                        <p className="text-sm text-foreground/60">
                          {outfit.items} items
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-accent text-accent" />
                        <span className="text-sm font-medium text-foreground">
                          {outfit.rating}
                        </span>
                      </div>
                      <button className="p-2 hover:bg-primary/10 rounded-lg transition-colors group-hover:opacity-100 opacity-0">
                        <Heart
                          className={`w-5 h-5 ${
                            outfit.saved
                              ? "fill-impact-positive text-impact-positive"
                              : "text-foreground/40"
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="card-base p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-foreground">
                  Recent Activity
                </h2>
                <Calendar className="w-5 h-5 text-foreground/40" />
              </div>
              <div className="space-y-4">
                {activityFeed.map((item) => (
                  <div key={item.id} className="space-y-2">
                    <div className="flex items-start gap-3">
                      <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">
                          {item.action}
                        </p>
                        <p className="text-xs text-foreground/60 truncate">
                          {item.item}
                        </p>
                      </div>
                    </div>
                    <div className="flex justify-between items-center ml-5">
                      <span className="text-xs text-foreground/50">
                        {item.time}
                      </span>
                      <span className="text-xs text-impact-positive font-medium">
                        {item.impact}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
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
        </div>
      </main>
    </Layout>
  );
}
