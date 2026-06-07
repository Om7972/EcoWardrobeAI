import { useState } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  Leaf,
  Droplet,
  Wind,
  TrendingUp,
  Award,
  Users,
  Book,
  ArrowRight,
  ArrowLeft,
  Calculator,
  Check,
  Plus,
  Minus,
  Sparkles
} from "lucide-react";

interface Challenge {
  id: number;
  title: string;
  participants: string;
  reward: string;
  points: number;
}

const initialChallenges: Challenge[] = [
  {
    id: 1,
    title: "7-Day No New Purchase",
    participants: "12.5K",
    reward: "100 points",
    points: 100,
  },
  {
    id: 2,
    title: "Sustainable September",
    participants: "8.3K",
    reward: "500 points + Badge",
    points: 500,
  },
  {
    id: 3,
    title: "Outfit Remix Master",
    participants: "15.2K",
    reward: "250 points",
    points: 250,
  },
];

export default function Sustainability() {
  const { toast } = useToast();
  
  // Dynamic stats
  const [waterSaved, setWaterSaved] = useState(2745200);
  const [co2Reduced, setCo2Reduced] = useState(150240);
  const [garmentsExtended, setGarmentsExtended] = useState(75180);
  const [userPoints, setUserPoints] = useState(350);

  // Challenges state
  const [joinedChallenges, setJoinedChallenges] = useState<number[]>([]);

  // Calculator state
  const [showCalculator, setShowCalculator] = useState(false);
  const [garmentCount, setGarmentCount] = useState(1);
  const [garmentType, setGarmentType] = useState("cotton");

  const handleJoinChallenge = (id: number, title: string, points: number) => {
    if (joinedChallenges.includes(id)) {
      // Complete challenge
      setJoinedChallenges(joinedChallenges.filter(cId => cId !== id));
      setUserPoints(prev => prev + points);
      toast({
        title: "Challenge Completed! 🎉",
        description: `You've completed the "${title}" challenge and earned ${points} points!`,
      });
    } else {
      // Join challenge
      setJoinedChallenges([...joinedChallenges, id]);
      toast({
        title: "Joined Challenge! 🌱",
        description: `You are now participating in the "${title}" challenge. Good luck!`,
      });
    }
  };

  const calculateSavings = () => {
    let waterPerGarment = 0;
    let co2PerGarment = 0;

    switch (garmentType) {
      case "cotton":
        waterPerGarment = 2700;
        co2PerGarment = 3.2;
        break;
      case "denim":
        waterPerGarment = 8000;
        co2PerGarment = 8.5;
        break;
      case "polyester":
        waterPerGarment = 50;
        co2PerGarment = 12.1;
        break;
      case "linen":
        waterPerGarment = 1000;
        co2PerGarment = 2.1;
        break;
      case "wool":
        waterPerGarment = 2000;
        co2PerGarment = 5.4;
        break;
      default:
        waterPerGarment = 1500;
        co2PerGarment = 4.0;
    }

    return {
      water: waterPerGarment * garmentCount,
      co2: Number((co2PerGarment * garmentCount).toFixed(1)),
    };
  };

  const savings = calculateSavings();

  const handleLogSavings = () => {
    setWaterSaved(prev => prev + savings.water);
    setCo2Reduced(prev => prev + savings.co2);
    setGarmentsExtended(prev => prev + garmentCount);
    setUserPoints(prev => prev + (garmentCount * 15));
    setShowCalculator(false);
    
    toast({
      title: "Impact Logged! 🌍",
      description: `Logged ${savings.water}L water saved, ${savings.co2}kg CO2 reduced, and earned ${garmentCount * 15} impact points!`,
    });
  };

  return (
    <Layout>
      {/* Back button */}
      <div className="container max-w-7xl mx-auto px-4 md:px-6 pt-6 -mb-6">
        <Link to="/dashboard" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Link>
      </div>

      <section className="w-full bg-gradient-to-b from-primary/5 to-background border-b border-border/40 py-8 md:py-12">
        <div className="container max-w-7xl mx-auto px-4 md:px-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
              Sustainability Hub
            </h1>
            <p className="text-lg text-foreground/70 mt-2">
              Track your environmental impact and join the sustainable fashion movement
            </p>
          </div>
          <div className="bg-primary/10 border border-primary/20 rounded-xl px-4 py-3 flex items-center gap-3">
            <Award className="w-6 h-6 text-primary" />
            <div>
              <p className="text-xs text-foreground/60">Your Impact Points</p>
              <p className="text-lg font-bold text-foreground">{userPoints} pts</p>
            </div>
          </div>
        </div>
      </section>

      <main className="w-full py-12">
        <div className="container max-w-7xl mx-auto px-4 md:px-6 space-y-12">
          {/* Impact Metrics */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Water Saved */}
            <div className="card-base p-6 space-y-4 group hover:border-primary/30 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full -mr-6 -mt-6 transition-all group-hover:scale-110" />
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                  <Droplet className="w-6 h-6 text-blue-500" />
                </div>
                <TrendingUp className="w-5 h-5 text-impact-positive animate-bounce" />
              </div>
              <div>
                <p className="text-3xl font-bold text-foreground">
                  {(waterSaved / 1000000).toFixed(2)}M
                </p>
                <p className="text-sm text-foreground/60">Liters Saved (Total)</p>
              </div>
            </div>

            {/* CO2 Avoided */}
            <div className="card-base p-6 space-y-4 group hover:border-primary/30 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-nature/5 rounded-full -mr-6 -mt-6 transition-all group-hover:scale-110" />
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-lg bg-nature/10 flex items-center justify-center group-hover:bg-nature/20 transition-colors">
                  <Wind className="w-6 h-6 text-nature" />
                </div>
                <TrendingUp className="w-5 h-5 text-impact-positive" />
              </div>
              <div>
                <p className="text-3xl font-bold text-foreground">
                  {(co2Reduced / 1000).toFixed(1)}K
                </p>
                <p className="text-sm text-foreground/60">kg CO2 Avoided</p>
              </div>
            </div>

            {/* Garments Extended */}
            <div className="card-base p-6 space-y-4 group hover:border-primary/30 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -mr-6 -mt-6 transition-all group-hover:scale-110" />
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Leaf className="w-6 h-6 text-primary" />
                </div>
                <TrendingUp className="w-5 h-5 text-impact-positive" />
              </div>
              <div>
                <p className="text-3xl font-bold text-foreground">
                  {(garmentsExtended / 1000).toFixed(1)}K
                </p>
                <p className="text-sm text-foreground/60">Garments Extended</p>
              </div>
            </div>

            {/* Community */}
            <div className="card-base p-6 space-y-4 group hover:border-primary/30 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-24 h-24 bg-accent/5 rounded-full -mr-6 -mt-6 transition-all group-hover:scale-110" />
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
            {/* Savings Calculator (Interactive Card) */}
            <div className="card-base p-8 space-y-4 group hover:border-primary/30 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-lg bg-nature/10 flex items-center justify-center group-hover:bg-nature/20 transition-colors">
                  <Calculator className="w-6 h-6 text-nature" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">
                  Savings Calculator
                </h3>
                <p className="text-foreground/70">
                  Calculate and log the resources saved by choosing circular fashion (swapping, buying pre-loved, repairs).
                </p>
              </div>
              <Button onClick={() => setShowCalculator(true)} className="w-fit mt-4">
                Calculate Now
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>

            {/* Educational Content */}
            <div className="card-base p-8 space-y-4 group hover:border-primary/30 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                  <Book className="w-6 h-6 text-accent" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">
                  Sustainability Feed & News
                </h3>
                <p className="text-foreground/70">
                  Stay up to date with global circular textile updates, eco tips, and brand innovations.
                </p>
              </div>
              <Link to="/sustainability-feed">
                <Button variant="outline" className="w-fit mt-4">
                  Read News
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Environmental Facts */}
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
              {initialChallenges.map((challenge) => {
                const isJoined = joinedChallenges.includes(challenge.id);
                return (
                  <div
                    key={challenge.id}
                    className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-lg border border-border/40 hover:border-primary/30 hover:bg-muted/20 transition-all gap-4 group"
                  >
                    <div>
                      <h4 className="font-semibold text-foreground">
                        {challenge.title}
                      </h4>
                      <p className="text-sm text-foreground/60">
                        {challenge.participants} participants
                      </p>
                    </div>
                    <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                      <span className="text-sm font-medium text-impact-positive">
                        {challenge.reward}
                      </span>
                      <Button
                        onClick={() => handleJoinChallenge(challenge.id, challenge.title, challenge.points)}
                        variant={isJoined ? "secondary" : "default"}
                        size="sm"
                        className="min-w-[100px]"
                      >
                        {isJoined ? (
                          <span className="flex items-center gap-1">
                            Complete
                          </span>
                        ) : (
                          "Join"
                        )}
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* CTA */}
          <div className="text-center space-y-6 max-w-2xl mx-auto pt-6">
            <h2 className="text-3xl font-bold text-foreground">
              Start Making an Impact Today
            </h2>
            <p className="text-lg text-foreground/70">
              Every outfit choice matters. Join our community and be part of the sustainable fashion revolution.
            </p>
            <Link
              to="/dashboard"
              className="inline-flex items-center justify-center px-8 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors group"
            >
              View Your Dashboard
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </main>

      {/* Savings Calculator Dialog */}
      <Dialog open={showCalculator} onOpenChange={setShowCalculator}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Calculator className="w-5 h-5 text-primary" />
              Sustainability Savings Calculator
            </DialogTitle>
            <DialogDescription>
              Calculate your water and carbon savings by opting for sustainable choices.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <Label htmlFor="garmentType">Garment / Fabric Type</Label>
              <select
                id="garmentType"
                value={garmentType}
                onChange={(e) => setGarmentType(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              >
                <option value="cotton">Organic Cotton T-Shirt</option>
                <option value="denim">Thrifted Denim Jeans</option>
                <option value="polyester">Recycled Polyester Fleece</option>
                <option value="linen">Linen Shirt</option>
                <option value="wool">Wool Sweater</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label>Quantity</Label>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setGarmentCount(prev => Math.max(1, prev - 1))}
                  disabled={garmentCount <= 1}
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <span className="text-lg font-bold w-12 text-center">{garmentCount}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setGarmentCount(prev => prev + 1)}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Results Display */}
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 space-y-3">
              <h4 className="font-semibold text-sm text-foreground flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-primary" />
                Estimated Environmental Savings
              </h4>
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="bg-blue-500/10 p-3 rounded-lg">
                  <p className="text-xs text-foreground/70">Water Saved</p>
                  <p className="font-bold text-lg text-blue-600">{savings.water} Liters</p>
                </div>
                <div className="bg-nature/10 p-3 rounded-lg">
                  <p className="text-xs text-foreground/70">CO2 Reduced</p>
                  <p className="font-bold text-lg text-nature">{savings.co2} kg</p>
                </div>
              </div>
            </div>

            <Button onClick={handleLogSavings} className="w-full">
              Log Action to my Impact Tracker
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
