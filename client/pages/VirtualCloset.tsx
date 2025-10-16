import Layout from "@/components/Layout";
import { Upload, Grid3x3, Filter, Plus, ArrowRight } from "lucide-react";

export default function VirtualCloset() {
  return (
    <Layout>
      <section className="w-full bg-gradient-to-b from-primary/5 to-background border-b border-border/40 py-8 md:py-12">
        <div className="container max-w-7xl mx-auto px-4 md:px-6">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">
            Virtual Closet
          </h1>
          <p className="text-lg text-foreground/70 mt-2">
            Organize and manage your wardrobe digitally
          </p>
        </div>
      </section>

      <main className="w-full py-12 md:py-16">
        <div className="container max-w-7xl mx-auto px-4 md:px-6">
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {/* Upload Card */}
            <div className="card-base p-8 flex flex-col items-center justify-center text-center space-y-4 group hover:border-primary/30 cursor-pointer">
              <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <Upload className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">
                  Upload Items
                </h3>
                <p className="text-sm text-foreground/60 mt-1">
                  Drag and drop or click to add new clothing items
                </p>
              </div>
            </div>

            {/* Filter Card */}
            <div className="card-base p-8 flex flex-col items-center justify-center text-center space-y-4 group hover:border-primary/30">
              <div className="w-16 h-16 rounded-lg bg-nature/10 flex items-center justify-center group-hover:bg-nature/20 transition-colors">
                <Filter className="w-8 h-8 text-nature" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">
                  Filter & Organize
                </h3>
                <p className="text-sm text-foreground/60 mt-1">
                  Search by category, color, or occasion
                </p>
              </div>
            </div>

            {/* AI Tagging Card */}
            <div className="card-base p-8 flex flex-col items-center justify-center text-center space-y-4 group hover:border-primary/30">
              <div className="w-16 h-16 rounded-lg bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                <Grid3x3 className="w-8 h-8 text-accent" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">
                  AI Auto-Tagging
                </h3>
                <p className="text-sm text-foreground/60 mt-1">
                  Automatic clothing classification and categorization
                </p>
              </div>
            </div>
          </div>

          {/* Placeholder Grid */}
          <div className="card-base p-12 mb-12">
            <div className="text-center space-y-6">
              <div className="w-20 h-20 rounded-lg bg-muted flex items-center justify-center mx-auto">
                <Plus className="w-10 h-10 text-foreground/40" />
              </div>
              <div>
                <h2 className="text-2xl font-semibold text-foreground mb-2">
                  Your closet is empty
                </h2>
                <p className="text-foreground/70 max-w-md mx-auto">
                  Start by uploading photos of your clothing items. Our AI will automatically tag and organize them for you.
                </p>
              </div>
              <button className="inline-flex items-center justify-center px-8 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors group">
                Upload First Item
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* Features Preview */}
          <div className="bg-gradient-to-r from-primary/10 to-nature/10 rounded-xl border border-primary/20 p-8 md:p-12">
            <h2 className="text-2xl font-semibold text-foreground mb-8">
              What You Can Do Here
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="font-semibold text-foreground flex items-center gap-2">
                  <span className="text-lg">📸</span> Upload & Organize
                </h3>
                <p className="text-foreground/70">
                  Add your wardrobe items with photos, descriptions, and fabric information.
                </p>
              </div>
              <div className="space-y-4">
                <h3 className="font-semibold text-foreground flex items-center gap-2">
                  <span className="text-lg">🏷️</span> Auto-Tagging
                </h3>
                <p className="text-foreground/70">
                  AI automatically identifies colors, patterns, fit, and occasion tags.
                </p>
              </div>
              <div className="space-y-4">
                <h3 className="font-semibold text-foreground flex items-center gap-2">
                  <span className="text-lg">🔍</span> Smart Search
                </h3>
                <p className="text-foreground/70">
                  Filter by category, color, size, brand, or occasion instantly.
                </p>
              </div>
              <div className="space-y-4">
                <h3 className="font-semibold text-foreground flex items-center gap-2">
                  <span className="text-lg">📊</span> Analytics
                </h3>
                <p className="text-foreground/70">
                  Track your wardrobe composition and most-worn items.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
}
