import { Star, AlertCircle, CheckCircle } from "lucide-react";

interface EcoScoreCardProps {
  score: number;
  title: string;
  description: string;
  certifications?: string[];
  breakdown?: {
    brandScore: number;
    materialScore: number;
    usageScore: number;
  };
}

export function EcoScoreCard({
  score,
  title,
  description,
  certifications = [],
  breakdown,
}: EcoScoreCardProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-blue-600";
    if (score >= 40) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return "bg-green-100";
    if (score >= 60) return "bg-blue-100";
    if (score >= 40) return "bg-yellow-100";
    return "bg-red-100";
  };

  return (
    <div className="card-base p-6 space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-foreground">{title}</h3>
          <p className="text-sm text-foreground/70">{description}</p>
        </div>
      </div>

      {/* Score Circle */}
      <div className="flex items-center gap-6">
        <div className={`${getScoreBgColor(score)} rounded-full w-24 h-24 flex items-center justify-center flex-shrink-0`}>
          <div className="text-center">
            <div className={`text-3xl font-bold ${getScoreColor(score)}`}>
              {score}
            </div>
            <div className="text-xs text-foreground/70">/100</div>
          </div>
        </div>

        <div className="flex-1">
          {breakdown && (
            <div className="space-y-3">
              <ScoreBar label="Brand" score={breakdown.brandScore} />
              <ScoreBar label="Material" score={breakdown.materialScore} />
              <ScoreBar label="Usage" score={breakdown.usageScore} />
            </div>
          )}
        </div>
      </div>

      {/* Certifications */}
      {certifications.length > 0 && (
        <div className="pt-4 border-t border-border/40">
          <p className="text-xs font-semibold text-foreground/70 mb-2">
            CERTIFICATIONS
          </p>
          <div className="flex flex-wrap gap-2">
            {certifications.map((cert) => (
              <span
                key={cert}
                className="px-2 py-1 bg-primary/10 text-primary rounded text-xs font-medium flex items-center gap-1"
              >
                <CheckCircle className="w-3 h-3" />
                {cert}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Status Message */}
      <div className={`p-3 rounded flex gap-2 ${
        score >= 60
          ? "bg-green-100 text-green-900"
          : score >= 40
          ? "bg-yellow-100 text-yellow-900"
          : "bg-red-100 text-red-900"
      }`}>
        {score >= 60 ? (
          <CheckCircle className="w-5 h-5 flex-shrink-0" />
        ) : (
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
        )}
        <p className="text-sm font-medium">
          {score >= 80 && "Excellent - Very sustainable choice!"}
          {score >= 60 && score < 80 && "Good - Decent sustainability"}
          {score >= 40 && score < 60 && "Fair - Consider more sustainable alternatives"}
          {score < 40 && "Poor - Look for more eco-friendly options"}
        </p>
      </div>
    </div>
  );
}

function ScoreBar({
  label,
  score,
}: {
  label: string;
  score: number;
}) {
  return (
    <div>
      <div className="flex justify-between items-center text-xs mb-1">
        <span className="text-foreground/70">{label}</span>
        <span className="font-semibold text-foreground">{score}/100</span>
      </div>
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-primary to-nature transition-all"
          style={{ width: `${score}%` }}
        />
      </div>
    </div>
  );
}
