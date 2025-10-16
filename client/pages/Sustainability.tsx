import Layout from "@/components/Layout";
import {
  Leaf,
  Droplet,
  Wind,
  TrendingUp,
  Award,
  Users,
  Book,
  ArrowRight,
} from "lucide-react";

export default function Sustainability() {
  return (
    <Layout>
      <section className="w-full bg-gradient-to-b from-primary/5 to-background border-b border-border/40 py-8 md:py-12">
        <div className="container max-w-7xl mx-auto px-4 md:px-6">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">
            Sustainability Hub
          </h1>
          <p className="text-lg text-foreground/70 mt-2">
            Track your environmental impact and join the sustainable fashion movement
          </p>
        </div>
      </section>

      <main className="w-full py-12 md:py-16">
        <div className="container max-w-7xl mx-auto px-4 md:px-6 space-y-12">
          {/* Impact Metrics */}
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
                <p className="text-3xl font-bold text-foreground">2.7M</p>
                <p className="text-sm text-foreground/60">Liters Saved</p>
              </div>
            </div>

            {/* CO2 Avoided */}
            <div className="card-base p-6 space-y-4 group hover:border-primary/30">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-lg bg-nature/10 flex items-center justify-center group-hover:bg-nature/20 transition-colors">
                  <Wind className="w-6 h-6 text-nature" />
                </div>
                <TrendingUp className="w-5 h-5 text-impact-positive" />
              </div>
              <div>
                <p className="text-3xl font-bold text-foreground">150K</p>
                <p className="text-sm text-foreground/60">kg CO2 Reduced</p>
              </div>
            </div>

            {/* Garments Extended */}
            <div className="card-base p-6 space-y-4 group hover:border-primary/30">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Leaf className="w-6 h-6 text-primary" />
                </div>
                <TrendingUp className="w-5 h-5 text-impact-positive" />
              </div>
              <div>
                <p className="text-3xl font-bold text-foreground">75K</p>
                <p className="text-sm text-foreground/60">Garments Extended</p>
              </div>
            </div>

            {/* Community */}
            <div className="card-base p-6 space-y-4 group hover:border-primary/30">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                  <Users className="w-6 h-6 text-accent" />
                </div>
                <TrendingUp className="w-5 h-5 text-impact-positive" />
              </div>
              <div>
                <p className="text-3xl font-bold text-foreground">50K</p>
                <p className="text-sm text-foreground/60">Active Members</p>
              </div>
            </div>
          </div>

          {/* Hub Sections */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Impact Dashboard */}
            <div className="card-base p-8 space-y-4 group hover:border-primary/30">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <TrendingUp className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">
                Impact Dashboard
              </h3>
              <p className="text-foreground/70">
                Visualize your personal environmental impact and contributions over time.
              </p>
              <button className="text-primary hover:text-primary/80 font-semibold flex items-center gap-2 transition-colors group/btn">
                View Dashboard
                <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Savings Calculator */}
            <div className="card-base p-8 space-y-4 group hover:border-primary/30">
              <div className="w-12 h-12 rounded-lg bg-nature/10 flex items-center justify-center group-hover:bg-nature/20 transition-colors">
                <Leaf className="w-6 h-6 text-nature" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">
                Savings Calculator
              </h3>
              <p className="text-foreground/70">
                Calculate the resources and money saved by choosing sustainable fashion.
              </p>
              <button className="text-primary hover:text-primary/80 font-semibold flex items-center gap-2 transition-colors group/btn">
                Calculate Now
                <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Educational Content */}
            <div className="card-base p-8 space-y-4 group hover:border-primary/30">
              <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                <Book className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">
                Educational Content
              </h3>
              <p className="text-foreground/70">
                Learn about sustainable fashion, climate impact, and ethical practices.
              </p>
              <button className="text-primary hover:text-primary/80 font-semibold flex items-center gap-2 transition-colors group/btn">
                Read Blog
                <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
              </button>
            </div>

            {/* Community Challenges */}
            <div className="card-base p-8 space-y-4 group hover:border-primary/30">
              <div className="w-12 h-12 rounded-lg bg-impact-positive/10 flex items-center justify-center group-hover:bg-impact-positive/20 transition-colors">
                <Award className="w-6 h-6 text-impact-positive" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">
                Community Challenges
              </h3>
              <p className="text-foreground/70">
                Participate in sustainability challenges and earn badges and rewards.
              </p>
              <button className="text-primary hover:text-primary/80 font-semibold flex items-center gap-2 transition-colors group/btn">
                View Challenges
                <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* Impact Information */}
          <div className="bg-gradient-to-r from-primary/10 to-nature/10 rounded-xl border border-primary/20 p-8 md:p-12">
            <h2 className="text-2xl font-semibold text-foreground mb-8">
              Environmental Impact Facts
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="space-y-3">
                <h3 className="font-semibold text-foreground flex items-center gap-2">
                  <Droplet className="w-5 h-5 text-blue-500" />
                  Water Usage
                </h3>
                <p className="text-foreground/70 text-sm">
                  The fashion industry uses 92 trillion liters of water annually. By wearing items longer, we can significantly reduce this consumption.
                </p>
              </div>
              <div className="space-y-3">
                <h3 className="font-semibold text-foreground flex items-center gap-2">
                  <Wind className="w-5 h-5 text-nature" />
                  Carbon Emissions
                </h3>
                <p className="text-foreground/70 text-sm">
                  The fashion industry accounts for 10% of global carbon emissions. Sustainable choices directly reduce your carbon footprint.
                </p>
              </div>
              <div className="space-y-3">
                <h3 className="font-semibold text-foreground flex items-center gap-2">
                  <Leaf className="w-5 h-5 text-primary" />
                  Waste Reduction
                </h3>
                <p className="text-foreground/70 text-sm">
                  85% of textiles end up in landfills yearly. Extending wardrobe lifespans helps reduce textile waste significantly.
                </p>
              </div>
            </div>
          </div>

          {/* Challenge Section */}
          <div className="card-base p-8 md:p-12 space-y-6">
            <h2 className="text-2xl font-semibold text-foreground">
              Current Challenges
            </h2>
            <div className="space-y-4">
              {[
                {
                  title: "7-Day No New Purchase",
                  participants: "12.5K",
                  reward: "100 points",
                },
                {
                  title: "Sustainable September",
                  participants: "8.3K",
                  reward: "500 points + Badge",
                },
                {
                  title: "Outfit Remix Master",
                  participants: "15.2K",
                  reward: "250 points",
                },
              ].map((challenge, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-4 rounded-lg border border-border/40 hover:border-primary/30 hover:bg-muted/20 transition-all group"
                >
                  <div>
                    <h4 className="font-semibold text-foreground">
                      {challenge.title}
                    </h4>
                    <p className="text-sm text-foreground/60">
                      {challenge.participants} participants
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-medium text-impact-positive">
                      {challenge.reward}
                    </span>
                    <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors opacity-0 group-hover:opacity-100">
                      Join
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="text-center space-y-6">
            <h2 className="text-3xl font-bold text-foreground">
              Start Making an Impact Today
            </h2>
            <p className="text-lg text-foreground/70 max-w-2xl mx-auto">
              Every outfit choice matters. Join our community and be part of the sustainable fashion revolution.
            </p>
            <a
              href="/dashboard"
              className="inline-flex items-center justify-center px-8 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors group"
            >
              View Your Impact
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </div>
      </main>
    </Layout>
  );
}
