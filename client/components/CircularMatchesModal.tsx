import { useState, useEffect } from "react";
import { X, Shuffle, Star, TrendingUp } from "lucide-react";
import { toast } from "sonner";

interface Match {
  id: string;
  garmentName: string;
  garmentImage: string;
  matchedUser: string;
  matchedUserId: string;
  matchScore: number;
  reason: string;
  sizeMatch: string;
  styleScore: number;
  condition: "like-new" | "excellent" | "good";
}

interface CircularMatchesModalProps {
  isOpen: boolean;
  onClose: () => void;
  userStyles?: string[];
}

export function CircularMatchesModal({
  isOpen,
  onClose,
  userStyles = ["casual", "minimalist"],
}: CircularMatchesModalProps) {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen && matches.length === 0) {
      fetchMatches();
    }
  }, [isOpen]);

  const fetchMatches = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      userStyles.forEach((style) => params.append("stylePreferences", style));

      const res = await fetch(`/api/features/circular-matches?${params}`);
      const data = await res.json();
      setMatches(data.data || []);
    } catch (error) {
      toast.error("Failed to load matches");
    } finally {
      setLoading(false);
    }
  };

  const handleProposeSwap = (match: Match) => {
    toast.success(
      `Swap proposal sent to ${match.matchedUser} for ${match.garmentName}!`
    );
  };

  if (!isOpen) return null;

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case "like-new":
        return "bg-green-100 text-green-800";
      case "excellent":
        return "bg-blue-100 text-blue-800";
      case "good":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-background rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border/40 sticky top-0 bg-background/95 backdrop-blur">
          <div className="flex items-center gap-3">
            <Shuffle className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold text-foreground">
              Circular Matches
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Description */}
        <div className="px-6 pt-4 pb-2">
          <p className="text-foreground/70 text-sm">
            Perfect swap opportunities based on style & size compatibility
          </p>
        </div>

        {/* Matches List */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center space-y-4">
                <div className="w-12 h-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin mx-auto" />
                <p className="text-foreground/70">Finding your perfect matches...</p>
              </div>
            </div>
          ) : matches.length > 0 ? (
            <div className="divide-y divide-border/40">
              {matches.map((match) => (
                <div
                  key={match.id}
                  className="p-6 hover:bg-muted/20 transition-colors group"
                >
                  <div className="flex gap-6">
                    {/* Image */}
                    <div className="relative flex-shrink-0">
                      <img
                        src={match.garmentImage}
                        alt={match.garmentName}
                        className="w-32 h-32 object-cover rounded-lg shadow-md group-hover:shadow-lg transition-shadow"
                      />
                      <div className={`absolute -top-2 -right-2 px-3 py-1 rounded-full text-xs font-bold ${getConditionColor(
                        match.condition
                      )}`}>
                        {match.condition}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 space-y-3">
                      <div>
                        <h3 className="text-lg font-semibold text-foreground">
                          {match.garmentName}
                        </h3>
                        <p className="text-sm text-foreground/70">
                          Matches with {match.matchedUser}
                        </p>
                      </div>

                      {/* Match Score - Large & Bold */}
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <div className="text-center">
                            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 border-2 border-primary/30">
                              <span className="text-4xl font-bold text-primary">
                                {match.matchScore}
                              </span>
                            </div>
                            <p className="text-xs text-foreground/70 mt-1">
                              Match Score
                            </p>
                          </div>
                        </div>

                        {/* Details */}
                        <div className="space-y-2 flex-1">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-foreground/70">Style Match</span>
                            <div className="flex items-center gap-1">
                              <div className="flex gap-1">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`w-4 h-4 ${
                                      i < Math.round(match.styleScore / 20)
                                        ? "fill-accent text-accent"
                                        : "text-foreground/20"
                                    }`}
                                  />
                                ))}
                              </div>
                              <span className="font-semibold text-foreground">
                                {match.styleScore}%
                              </span>
                            </div>
                          </div>
                          <div className="text-sm">
                            <p className="text-foreground/70">Size Match</p>
                            <p className="font-semibold text-foreground">
                              {match.sizeMatch}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Reason */}
                      <div className="p-3 bg-primary/5 rounded-lg border border-primary/20">
                        <p className="text-sm text-foreground/80">
                          💡 {match.reason}
                        </p>
                      </div>

                      {/* Action Button */}
                      <button
                        onClick={() => handleProposeSwap(match)}
                        className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 group/btn"
                      >
                        <Shuffle className="w-5 h-5 group-hover/btn:rotate-180 transition-transform" />
                        Propose Swap
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex items-center justify-center h-64">
              <div className="text-center space-y-4">
                <TrendingUp className="w-12 h-12 text-foreground/40 mx-auto" />
                <p className="text-foreground/70">No matches found yet</p>
                <p className="text-sm text-foreground/50">
                  Upload more items to improve recommendations
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-border/40 px-6 py-4 bg-muted/20">
          <button
            onClick={onClose}
            className="w-full py-2 border border-border rounded-lg font-medium hover:bg-muted/50 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
