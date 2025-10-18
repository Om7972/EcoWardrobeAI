interface WeatherData {
  date: string;
  temp: number;
  humidity: number;
  description: string;
  precip: number; // mm
}

interface MaintenanceTask {
  id: string;
  garmentName: string;
  requiredAction: string;
  priority: "High" | "Medium" | "Low";
  reason: string;
  dueDate?: string;
  estimatedTime: string; // "15 mins", "1 hour", etc.
}

interface MaintenanceReport {
  weatherForecast: WeatherData[];
  maintenanceTasks: MaintenanceTask[];
  summary: string;
}

function generateWeatherForecast(days: number = 14): WeatherData[] {
  const forecast: WeatherData[] = [];
  for (let i = 0; i < days; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i);
    
    const temps = [18, 20, 22, 19, 21, 17, 19, 20, 22, 18, 19, 21, 20, 19];
    const conditions = [
      "Sunny",
      "Partly Cloudy",
      "Cloudy",
      "Rainy",
      "Sunny",
      "Cloudy",
      "Rainy",
      "Sunny",
      "Partly Cloudy",
      "Sunny",
      "Cloudy",
      "Rainy",
      "Sunny",
      "Partly Cloudy",
    ];

    forecast.push({
      date: date.toISOString().split("T")[0],
      temp: temps[i % temps.length],
      humidity: 50 + Math.random() * 40,
      description: conditions[i % conditions.length],
      precip: Math.random() > 0.6 ? Math.random() * 30 : 0,
    });
  }
  return forecast;
}

function generateMaintenanceTasks(forecast: WeatherData[]): MaintenanceTask[] {
  const tasks: MaintenanceTask[] = [];
  let taskId = 1;

  // Check for rainy days in forecast
  const rainyDays = forecast.filter((day) => day.description.includes("Rainy"));
  if (rainyDays.length > 2) {
    tasks.push({
      id: `task-${taskId++}`,
      garmentName: "Winter Coat",
      requiredAction: "Waterproofing Treatment",
      priority: "High",
      reason: "Multiple rainy days ahead. Coat needs reproofing for water resistance.",
      dueDate: rainyDays[0].date,
      estimatedTime: "30 mins",
    });
  }

  // General maintenance tasks
  tasks.push({
    id: `task-${taskId++}`,
    garmentName: "Wool Sweater",
    requiredAction: "Gentle Hand Wash",
    priority: "Medium",
    reason: "Hasn't been washed in 2 weeks. Hand wash before visible stains set.",
    estimatedTime: "20 mins",
  });

  tasks.push({
    id: `task-${taskId++}`,
    garmentName: "Jeans (Dark Blue)",
    requiredAction: "Zipper Repair",
    priority: "High",
    reason: "Zipper is sticking. Repair now to prevent complete failure.",
    estimatedTime: "15 mins",
  });

  tasks.push({
    id: `task-${taskId++}`,
    garmentName: "Silk Blouse",
    requiredAction: "Stain Removal",
    priority: "Medium",
    reason: "Small coffee stain noticed. Treat within 24 hours for best results.",
    estimatedTime: "10 mins",
  });

  tasks.push({
    id: `task-${taskId++}`,
    garmentName: "Leather Jacket",
    requiredAction: "Conditioning Treatment",
    priority: "Low",
    reason: "Leather is starting to dry. Monthly conditioning keeps it supple.",
    estimatedTime: "45 mins",
  });

  // Cold days recommendation
  const coldDays = forecast.filter((day) => day.temp < 15);
  if (coldDays.length > 3) {
    tasks.push({
      id: `task-${taskId++}`,
      garmentName: "Winter Boots",
      requiredAction: "Salt Stain Removal & Protection",
      priority: "High",
      reason: "Cold weather ahead. Prepare boots for winter conditions.",
      estimatedTime: "25 mins",
    });
  }

  // Humidity check
  const highHumidityDays = forecast.filter((day) => day.humidity > 75);
  if (highHumidityDays.length > 5) {
    tasks.push({
      id: `task-${taskId++}`,
      garmentName: "Cotton T-shirts",
      requiredAction: "Air Circulation in Storage",
      priority: "Medium",
      reason: "High humidity forecast. Ensure proper ventilation to prevent mold/mildew.",
      estimatedTime: "15 mins",
    });
  }

  return tasks.slice(0, 6); // Return up to 6 tasks
}

export function generateMaintenanceReport(): MaintenanceReport {
  const weatherForecast = generateWeatherForecast(14);
  const maintenanceTasks = generateMaintenanceTasks(weatherForecast);

  const highPriorityCount = maintenanceTasks.filter(
    (t) => t.priority === "High"
  ).length;
  const summary =
    highPriorityCount > 0
      ? `${highPriorityCount} urgent maintenance task(s) require attention. Start with high-priority items to extend garment lifespan.`
      : "Your wardrobe is in good shape! Continue with regular maintenance.";

  return {
    weatherForecast,
    maintenanceTasks,
    summary,
  };
}

export function getMaintenanceEstimate(
  taskId: string,
  allTasks: MaintenanceTask[]
): {
  task: MaintenanceTask | undefined;
  steps: string[];
} {
  const task = allTasks.find((t) => t.id === taskId);

  const stepsMap: Record<string, string[]> = {
    "Waterproofing Treatment": [
      "Ensure garment is clean and dry",
      "Apply waterproof treatment according to product instructions",
      "Allow to dry completely (2-4 hours)",
      "Test with water droplets",
    ],
    "Gentle Hand Wash": [
      "Fill bucket with cool water",
      "Add mild detergent designed for delicates",
      "Gently agitate garment in water",
      "Rinse thoroughly with clean water",
      "Gently squeeze out excess water",
      "Lay flat to dry",
    ],
    "Zipper Repair": [
      "Clean zipper teeth with soft brush",
      "Apply graphite pencil lubricant to teeth",
      "Gently move zipper up and down",
      "If still stuck, try professional repair",
    ],
    "Stain Removal": [
      "Blot stain (don't rub)",
      "Apply appropriate stain remover",
      "Let sit for 5-10 minutes",
      "Rinse with cool water",
      "Wash normally",
    ],
  };

  return {
    task,
    steps: stepsMap[task?.requiredAction || ""] || [
      "Follow standard garment care instructions",
    ],
  };
}
