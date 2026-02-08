import { useState, useEffect } from "react";
import { AlertTriangle, Cloud, Droplet, Wind, Wrench, Calendar, CheckCircle2, Clock } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface WeatherDay {
  date: string;
  temp: number;
  humidity: number;
  description: string;
  precip: number;
  windSpeed: number;
}

interface MaintenanceTask {
  id: string;
  garmentName: string;
  requiredAction: string;
  priority: "High" | "Medium" | "Low";
  reason: string;
  dueDate?: string;
  estimatedTime: string;
}

interface MaintenanceReport {
  weatherForecast: WeatherDay[];
  maintenanceTasks: MaintenanceTask[];
  summary: string;
}

export function EcoMaintenanceWidget() {
  const [report, setReport] = useState<MaintenanceReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedTask, setExpandedTask] = useState<string | null>(null);

  useEffect(() => {
    fetchMaintenanceReport();
  }, []);

  const fetchMaintenanceReport = async () => {
    try {
      const [reportRes, forecastRes] = await Promise.all([
        fetch("/api/features/maintenance-report"),
        fetch("/api/features/weather-forecast"),
      ]);

      if (!reportRes.ok) {
        throw new Error(`Maintenance report failed: ${reportRes.status}`);
      }
      if (!forecastRes.ok) {
        throw new Error(`Weather forecast failed: ${forecastRes.status}`);
      }

      const reportData = await reportRes.json();
      const forecastData = await forecastRes.json();

      setReport({
        ...reportData.data,
        weatherForecast: forecastData.data || reportData.data?.weatherForecast || [],
      });
    } catch (error) {
      console.error("Failed to fetch maintenance report:", error);
      // Set a fallback report to prevent UI crash
      setReport({
        weatherForecast: [],
        maintenanceTasks: [],
        summary: "Unable to load maintenance data. Please try again later.",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="card-base p-8 flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 rounded-full border-4 border-primary/20 border-t-primary animate-spin mx-auto" />
          <p className="text-foreground/70">Loading maintenance schedule...</p>
        </div>
      </div>
    );
  }

  if (!report) {
    return <div className="card-base p-8">Failed to load maintenance data</div>;
  }

  // Get next 7 days of weather
  const nextWeek = report.weatherForecast.slice(0, 7);

  // Prepare chart data
  const chartData = nextWeek.map((day) => ({
    date: new Date(day.date).toLocaleDateString("en-US", { weekday: "short" }),
    temp: day.temp,
    humidity: day.humidity,
  }));

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "text-red-600 bg-red-100 border-red-300";
      case "Medium":
        return "text-yellow-600 bg-yellow-100 border-yellow-300";
      case "Low":
        return "text-green-600 bg-green-100 border-green-300";
      default:
        return "text-gray-600 bg-gray-100 border-gray-300";
    }
  };

  const getWeatherIcon = (description: string) => {
    if (description.includes("Rainy")) return "🌧️";
    if (description.includes("Cloudy")) return "☁️";
    if (description.includes("Sunny")) return "☀️";
    return "🌤️";
  };

  return (
    <div className="space-y-8">
      {/* Summary Alert */}
      {report.maintenanceTasks.some((t) => t.priority === "High") && (
        <div className="p-4 bg-red-100 border border-red-300 rounded-lg flex gap-3">
          <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-red-900">Action Required</p>
            <p className="text-sm text-red-800">{report.summary}</p>
          </div>
        </div>
      )}

      {/* Weather Forecast */}
      <div className="card-base p-6 space-y-6">
        <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
          <Cloud className="w-6 h-6 text-primary" />
          14-Day Weather Forecast
        </h3>

        {/* Weather Chart */}
        <div className="space-y-4">
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="date" stroke="var(--muted-foreground)" />
              <YAxis stroke="var(--muted-foreground)" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "var(--card)",
                  border: `1px solid var(--border)`,
                  borderRadius: "0.75rem",
                }}
              />
              <Line
                type="monotone"
                dataKey="temp"
                stroke="var(--primary)"
                strokeWidth={2}
                dot={{ fill: "var(--primary)", r: 4 }}
                name="Temperature (°C)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Weekly Cards */}
        <div className="grid grid-cols-7 gap-2">
          {nextWeek.map((day, idx) => (
            <div
              key={idx}
              className="p-3 rounded-lg bg-muted/50 text-center text-sm space-y-1"
            >
              <p className="font-medium text-foreground/70">
                {new Date(day.date).toLocaleDateString("en-US", {
                  weekday: "short",
                })}
              </p>
              <p className="text-2xl">{getWeatherIcon(day.description)}</p>
              <p className="font-bold text-foreground">{day.temp}°C</p>
              {day.precip > 5 && (
                <p className="text-xs text-blue-600 font-semibold">
                  💧 {day.precip.toFixed(0)}mm
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Weather Summary */}
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-foreground/70">
              <Droplet className="w-4 h-4" />
              <span>Rainy Days</span>
            </div>
            <p className="text-2xl font-bold text-blue-600">
              {nextWeek.filter((d) => d.description.includes("Rainy")).length}
            </p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-foreground/70">
              <Wind className="w-4 h-4" />
              <span>Avg Humidity</span>
            </div>
            <p className="text-2xl font-bold text-primary">
              {Math.round(
                nextWeek.reduce((sum, d) => sum + d.humidity, 0) / nextWeek.length
              )}
              %
            </p>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-foreground/70">
              <Calendar className="w-4 h-4" />
              <span>Max Temp</span>
            </div>
            <p className="text-2xl font-bold text-orange-600">
              {Math.max(...nextWeek.map((d) => d.temp))}°C
            </p>
          </div>
        </div>
      </div>

      {/* Maintenance Tasks */}
      <div className="card-base p-6 space-y-6">
        <h3 className="text-xl font-semibold text-foreground flex items-center gap-2">
          <Wrench className="w-6 h-6 text-primary" />
          Maintenance Tasks
        </h3>

        <div className="space-y-3">
          {report.maintenanceTasks.map((task) => (
            <div
              key={task.id}
              className="border border-border rounded-lg overflow-hidden hover:border-primary/30 transition-colors"
            >
              <button
                onClick={() =>
                  setExpandedTask(expandedTask === task.id ? null : task.id)
                }
                className="w-full p-4 flex items-start gap-4 hover:bg-muted/30 transition-colors"
              >
                {/* Priority Icon */}
                <div
                  className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${getPriorityColor(
                    task.priority
                  ).split(" ")[1]} border ${getPriorityColor(task.priority).split(" ")[2]}`}
                >
                  {task.priority === "High" ? (
                    <AlertTriangle className="w-5 h-5" />
                  ) : (
                    <CheckCircle2 className="w-5 h-5" />
                  )}
                </div>

                {/* Task Details */}
                <div className="flex-1 text-left">
                  <h4 className="font-semibold text-foreground">
                    {task.garmentName}
                  </h4>
                  <p className="text-sm text-foreground/70">
                    {task.requiredAction}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <Clock className="w-4 h-4 text-foreground/50" />
                    <span className="text-xs text-foreground/60">
                      {task.estimatedTime}
                    </span>
                  </div>
                </div>

                {/* Priority Badge */}
                <div
                  className={`flex-shrink-0 px-3 py-1 rounded-full text-xs font-bold border ${getPriorityColor(
                    task.priority
                  )}`}
                >
                  {task.priority}
                </div>
              </button>

              {/* Expanded Details */}
              {expandedTask === task.id && (
                <div className="border-t border-border bg-muted/20 p-4 space-y-4 animate-slide-up">
                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-foreground">Why?</p>
                    <p className="text-sm text-foreground/70">{task.reason}</p>
                  </div>

                  {task.dueDate && (
                    <div className="space-y-2">
                      <p className="text-sm font-semibold text-foreground">
                        Due Date
                      </p>
                      <p className="text-sm text-foreground/70">
                        {new Date(task.dueDate).toLocaleDateString()}
                      </p>
                    </div>
                  )}

                  <button className="w-full py-2 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors">
                    Mark as Done
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Tips */}
      <div className="bg-gradient-to-r from-primary/10 to-nature/10 rounded-xl border border-primary/20 p-6 space-y-4">
        <h4 className="font-semibold text-foreground">💡 Maintenance Tips</h4>
        <ul className="space-y-2 text-sm text-foreground/70">
          <li>• Wash delicates by hand to extend their lifespan</li>
          <li>• Air dry whenever possible to preserve fabric quality</li>
          <li>• Address stains immediately for better removal</li>
          <li>• Store clothes in a cool, dry place to prevent mold</li>
          <li>• Rotate items in your wardrobe to reduce wear</li>
        </ul>
      </div>
    </div>
  );
}
