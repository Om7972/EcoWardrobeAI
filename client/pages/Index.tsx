import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import {
  ArrowRight,
  Leaf,
  Zap,
  Heart,
  TrendingUp,
  Users,
  Sparkles,
  Wind,
  Droplet,
  Award,
} from "lucide-react";

export default function Index() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative w-full overflow-hidden bg-gradient-to-b from-primary/5 via-background to-background">
        {/* Decorative background elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-nature/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "1s" }} />
        </div>

        <div className="relative container max-w-7xl mx-auto px-4 md:px-6 py-20 md:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left content */}
            <div className="flex flex-col justify-center space-y-6 animate-slide-up">
              <div className="inline-flex items-center gap-2 w-fit px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
                <Sparkles className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary">
                  Powered by Advanced AI
                </span>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                Revolutionize Your Wardrobe
                <span className="block text-primary mt-2">Sustainably</span>
              </h1>

              <p className="text-lg text-foreground/70 max-w-md">
                Use AI to maximize your existing wardrobe, discover new outfit combinations, and embrace sustainable fashion. Every outfit counts towards a better planet.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Link
                  to="/dashboard"
                  className="inline-flex items-center justify-center px-8 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 active:bg-eco-700 transition-all duration-200 group shadow-lg hover:shadow-xl"
                >
                  Get Started
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <a
                  href="#features"
                  className="inline-flex items-center justify-center px-8 py-3 border border-border bg-background rounded-lg font-semibold text-foreground hover:bg-muted/50 transition-colors duration-200"
                >
                  Learn More
                </a>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 pt-8 border-t border-border/40">
                <div>
                  <p className="text-2xl font-bold text-primary">50K+</p>
                  <p className="text-sm text-foreground/60">Active Users</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-nature">1M+</p>
                  <p className="text-sm text-foreground/60">Outfits Generated</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-impact-positive">500T</p>
                  <p className="text-sm text-foreground/60">Water Saved</p>
                </div>
              </div>
            </div>

            {/* Right visual */}
            <div className="relative h-96 md:h-full flex items-center justify-center">
              <div className="relative w-full h-full max-w-sm">
                {/* Floating cards animation */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative w-64 h-80 animate-float">
                    {/* Card 1 */}
                    <div className="absolute inset-0 bg-gradient-to-br from-eco-50 to-eco-100 rounded-xl border border-eco-200 shadow-lg transform hover:shadow-2xl transition-shadow p-6 flex flex-col justify-between">
                      <div>
                        <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center mb-3">
                          <Heart className="w-5 h-5 text-primary" />
                        </div>
                        <h3 className="font-semibold text-foreground mb-1">
                          Smart Matching
                        </h3>
                        <p className="text-sm text-foreground/60">
                          AI-powered outfit combinations
                        </p>
                      </div>
                    </div>

                    {/* Card 2 - positioned offset */}
                    <div className="absolute top-12 -right-12 w-64 h-80 bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl border border-primary/20 shadow-lg transform translate-x-8 translate-y-4 hover:shadow-2xl transition-shadow p-6 flex flex-col justify-between animate-float" style={{ animationDelay: "1s" }}>
                      <div>
                        <div className="w-8 h-8 rounded-lg bg-nature/20 flex items-center justify-center mb-3">
                          <Leaf className="w-5 h-5 text-nature" />
                        </div>
                        <h3 className="font-semibold text-foreground mb-1">
                          Eco Impact
                        </h3>
                        <p className="text-sm text-foreground/60">
                          Track your sustainability metrics
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="w-full py-20 md:py-32 bg-muted/20">
        <div className="container max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Powerful Features
            </h2>
            <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
              Everything you need to transform your fashion choices and embrace sustainable living
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="card-base p-8 group hover:border-primary/30">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <Sparkles className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-foreground">
                AI Outfit Generator
              </h3>
              <p className="text-foreground/70">
                Let AI analyze your closet and suggest stunning outfit combinations based on your style, occasion, and weather.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="card-base p-8 group hover:border-primary/30">
              <div className="w-12 h-12 rounded-lg bg-nature/10 flex items-center justify-center mb-4 group-hover:bg-nature/20 transition-colors">
                <Leaf className="w-6 h-6 text-nature" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-foreground">
                Virtual Closet
              </h3>
              <p className="text-foreground/70">
                Organize and manage your wardrobe digitally. Upload items, auto-tag with AI, and keep everything organized in one place.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="card-base p-8 group hover:border-primary/30">
              <div className="w-12 h-12 rounded-lg bg-impact-positive/10 flex items-center justify-center mb-4 group-hover:bg-impact-positive/20 transition-colors">
                <TrendingUp className="w-6 h-6 text-impact-positive" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-foreground">
                Sustainability Tracker
              </h3>
              <p className="text-foreground/70">
                Monitor your environmental impact. Track CO2 saved, water conserved, and clothing waste reduced through sustainable choices.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="card-base p-8 group hover:border-primary/30">
              <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors">
                <Zap className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-foreground">
                Smart Recommendations
              </h3>
              <p className="text-foreground/70">
                Get personalized outfit suggestions based on your preferences, body type, color palette, and seasonal trends.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="card-base p-8 group hover:border-primary/30">
              <div className="w-12 h-12 rounded-lg bg-eco-200/30 flex items-center justify-center mb-4 group-hover:bg-eco-200/50 transition-colors">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-foreground">
                Community Challenges
              </h3>
              <p className="text-foreground/70">
                Join sustainability challenges, compete with friends, and earn badges while making a positive environmental impact.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="card-base p-8 group hover:border-primary/30">
              <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors">
                <Award className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-foreground">
                Gamified Rewards
              </h3>
              <p className="text-foreground/70">
                Earn points and unlock achievements for making sustainable fashion choices and achieving your wardrobe goals.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className="w-full py-20 md:py-32 bg-primary/5">
        <div className="container max-w-7xl mx-auto px-4 md:px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                Your Impact Matters
              </h2>
              <p className="text-lg text-foreground/70">
                Every outfit you create with EcoWardrobe AI contributes to a more sustainable future. See the difference you're making.
              </p>

              <div className="space-y-4">
                {/* Impact item 1 */}
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-impact-positive/10 flex items-center justify-center">
                    <Droplet className="w-5 h-5 text-impact-positive" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">
                      Water Conservation
                    </h4>
                    <p className="text-foreground/70">
                      By wearing more existing items, you save thousands of liters of water per garment.
                    </p>
                  </div>
                </div>

                {/* Impact item 2 */}
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-impact-positive/10 flex items-center justify-center">
                    <Wind className="w-5 h-5 text-impact-positive" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">
                      Reduced Emissions
                    </h4>
                    <p className="text-foreground/70">
                      Minimize carbon footprint by extending garment lifecycles and reducing new purchases.
                    </p>
                  </div>
                </div>

                {/* Impact item 3 */}
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-impact-positive/10 flex items-center justify-center">
                    <Leaf className="w-5 h-5 text-impact-positive" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-1">
                      Less Waste
                    </h4>
                    <p className="text-foreground/70">
                      Reduce landfill waste by maximizing your current wardrobe and avoiding impulse purchases.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              {/* Stat card 1 */}
              <div className="card-base p-8 space-y-4">
                <p className="text-4xl font-bold text-impact-positive">2.7M</p>
                <p className="text-sm text-foreground/70">Liters of Water Saved</p>
              </div>

              {/* Stat card 2 */}
              <div className="card-base p-8 space-y-4">
                <p className="text-4xl font-bold text-nature">150K</p>
                <p className="text-sm text-foreground/70">CO2 Kg Reduced</p>
              </div>

              {/* Stat card 3 */}
              <div className="card-base p-8 space-y-4">
                <p className="text-4xl font-bold text-primary">75K</p>
                <p className="text-sm text-foreground/70">Garments Extended</p>
              </div>

              {/* Stat card 4 */}
              <div className="card-base p-8 space-y-4">
                <p className="text-4xl font-bold text-accent">50K</p>
                <p className="text-sm text-foreground/70">Active Community</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-20 md:py-32 bg-gradient-to-r from-primary/10 to-nature/10 border-t border-border/40">
        <div className="container max-w-4xl mx-auto px-4 md:px-6 text-center space-y-8">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Ready to Transform Your Wardrobe?
          </h2>
          <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
            Join thousands of sustainable fashion enthusiasts and start creating the outfits you love while saving the planet.
          </p>
          <Link
            to="/dashboard"
            className="inline-flex items-center justify-center px-8 py-4 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 active:bg-eco-700 transition-all duration-200 group shadow-lg hover:shadow-xl text-lg"
          >
            Start Your Journey
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>
    </Layout>
  );
}
