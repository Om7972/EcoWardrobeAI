import Layout from "@/components/Layout";
import { Sparkles, Wand2, Heart, Share2, ArrowRight } from "lucide-react";

export default function OutfitGenerator() {
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
          {/* Generator Features */}
          <div className="grid md:grid-cols-3 gap-6">
            {/* Style Preference */}
            <div className="card-base p-8 space-y-4 group hover:border-primary/30">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <Sparkles className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">
                Style Preferences
              </h3>
              <p className="text-foreground/70">
                Tell us your style preferences, body type, and color palette for tailored suggestions.
              </p>
            </div>

            {/* Occasion Filtering */}
            <div className="card-base p-8 space-y-4 group hover:border-primary/30">
              <div className="w-12 h-12 rounded-lg bg-nature/10 flex items-center justify-center group-hover:bg-nature/20 transition-colors">
                <Wand2 className="w-6 h-6 text-nature" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">
                Occasion-Based
              </h3>
              <p className="text-foreground/70">
                Select occasion (work, casual, formal, party) and weather conditions for smart matching.
              </p>
            </div>

            {/* Weather Integration */}
            <div className="card-base p-8 space-y-4 group hover:border-primary/30">
              <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                <Share2 className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">
                Weather-Aware
              </h3>
              <p className="text-foreground/70">
                Our AI considers real-time weather data to suggest appropriate outfits.
              </p>
            </div>
          </div>

          {/* Main Generator Area */}
          <div className="card-base p-12 text-center space-y-8 border-2 border-dashed border-border">
            <div className="space-y-4">
              <div className="w-24 h-24 rounded-lg bg-gradient-to-br from-primary/20 to-nature/20 flex items-center justify-center mx-auto">
                <Wand2 className="w-12 h-12 text-primary" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                Ready to Generate Your Next Outfit?
              </h2>
              <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
                Start by selecting your style preferences, occasion, and weather conditions. Our AI will suggest the perfect outfit combinations from your closet.
              </p>
            </div>
            <button className="inline-flex items-center justify-center px-8 py-4 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors group text-lg shadow-lg">
              Generate Outfit
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* How It Works */}
          <div className="space-y-8">
            <h2 className="text-2xl font-bold text-foreground">How It Works</h2>
            <div className="grid md:grid-cols-4 gap-6">
              {[
                {
                  step: 1,
                  title: "Set Preferences",
                  desc: "Tell us about your style and what you're looking for",
                },
                {
                  step: 2,
                  title: "Choose Occasion",
                  desc: "Select the occasion and check the weather conditions",
                },
                {
                  step: 3,
                  title: "AI Analyzes",
                  desc: "Our AI analyzes your closet for perfect combinations",
                },
                {
                  step: 4,
                  title: "Get Suggestions",
                  desc: "View, rate, and save your outfit suggestions",
                },
              ].map((item) => (
                <div key={item.step} className="relative">
                  <div className="card-base p-6">
                    <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold mb-4 text-lg">
                      {item.step}
                    </div>
                    <h3 className="font-semibold text-foreground mb-2">
                      {item.title}
                    </h3>
                    <p className="text-sm text-foreground/70">{item.desc}</p>
                  </div>
                  {item.step < 4 && (
                    <div className="hidden md:block absolute top-1/2 -right-3 w-6 h-6 bg-background border-2 border-border rounded-full" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Features Highlight */}
          <div className="bg-gradient-to-r from-primary/10 to-nature/10 rounded-xl border border-primary/20 p-8 md:p-12">
            <h2 className="text-2xl font-semibold text-foreground mb-8">
              Advanced Features
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="flex gap-4">
                <Heart className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-foreground mb-1">
                    Save Favorites
                  </h3>
                  <p className="text-foreground/70">
                    Save your favorite outfit combinations and create personalized collections.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <Share2 className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-foreground mb-1">
                    Share & Compare
                  </h3>
                  <p className="text-foreground/70">
                    Share your outfits with friends and get feedback on your styling.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center space-y-6">
            <h2 className="text-3xl font-bold text-foreground">
              Need items in your closet first?
            </h2>
            <p className="text-lg text-foreground/70">
              Upload your wardrobe to the Virtual Closet to get the best outfit suggestions.
            </p>
            <a
              href="/closet"
              className="inline-flex items-center justify-center px-8 py-3 border border-border bg-background rounded-lg font-semibold text-foreground hover:bg-muted/50 transition-colors group"
            >
              Go to Virtual Closet
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </div>
      </main>
    </Layout>
  );
}
