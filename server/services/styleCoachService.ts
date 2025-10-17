import { WeatherData, getMockWeather } from "./weatherService";

interface CalendarEvent {
  title: string;
  time: string;
  type: "work" | "casual" | "formal" | "party" | "exercise" | "travel";
}

interface StyleCoachSuggestion {
  occasion: string;
  timeOfDay: string;
  weather: string;
  suggestion: string;
  tips: string[];
  confidence: number;
}

interface DailySuggestions {
  date: string;
  weather: WeatherData;
  events: CalendarEvent[];
  suggestions: StyleCoachSuggestion[];
  generalAdvice: string;
}

// Mock calendar events database
const mockCalendarEvents: Record<string, CalendarEvent[]> = {
  today: [
    { title: "Team Meeting", time: "9:00 AM", type: "work" },
    { title: "Lunch with Friends", time: "12:30 PM", type: "casual" },
    { title: "Gym", time: "5:00 PM", type: "exercise" },
  ],
  tomorrow: [
    { title: "Client Presentation", time: "10:00 AM", type: "formal" },
    { title: "Casual Coffee", time: "3:00 PM", type: "casual" },
  ],
};

// Style templates based on occasion and weather
const styleTemplates: Record<string, Record<string, string>> = {
  work: {
    warm: "Business casual: Lightweight blouse/shirt with tailored trousers or skirt, comfortable flats or heels",
    cold: "Professional: Long-sleeve shirt with blazer, trousers, and a warm cardigan or structured coat",
    rainy: "Practical professional: Water-resistant jacket over business casual, closed-toe shoes",
  },
  casual: {
    warm: "Relaxed: T-shirt or tank top with jeans or shorts, sneakers, light accessories",
    cold: "Cozy casual: Sweater or hoodie with jeans, comfortable sneakers, light scarf",
    rainy: "Practical casual: Waterproof jacket, jeans, water-resistant shoes",
  },
  formal: {
    warm: "Elegant: Lightweight dress or suit, dress shoes, statement jewelry",
    cold: "Sophisticated: Formal gown or suit with structured coat, heels",
    rainy: "Classy: Formal dress with elegant umbrella and water-resistant shoes",
  },
  party: {
    warm: "Fun: Dress or stylish outfit with heels, bold accessories",
    cold: "Festive: Dress with warm coat, elegant boots, statement pieces",
    rainy: "Trendy: Stylish outfit with waterproof heels or boots, umbrella",
  },
  exercise: {
    warm: "Athletic: Breathable workout wear, moisture-wicking top, shorts/leggings, sneakers",
    cold: "Layered: Long-sleeve athletic top, warm leggings, jacket, sports shoes",
    rainy: "Protected: Waterproof jacket over workout wear, water-resistant shoes",
  },
  travel: {
    warm: "Comfortable: Light layers, comfortable shoes, sun protection",
    cold: "Practical: Warm layers, comfortable walking shoes, transit-friendly clothes",
    rainy: "Smart: Weather-appropriate jacket, practical shoes, compact accessories",
  },
};

const styleTips: Record<string, string[]> = {
  morning: [
    "Start with a base layer suitable for the weather",
    "Consider the first activity of your day",
    "Think about layering for temperature changes",
    "Ensure your shoes are comfortable for multiple activities",
  ],
  afternoon: [
    "Check what's next on your schedule",
    "Consider if you'll have time to change",
    "Maintain comfort throughout the day",
    "Accessorize to transition between activities",
  ],
  evening: [
    "Dress for the evening activity",
    "Consider going out vs. staying home",
    "Think about social settings",
    "Prioritize comfort but stay polished",
  ],
};

function getWeatherCategory(weather: WeatherData): string {
  if (weather.description.includes("Rain")) return "rainy";
  if (weather.temp > 25) return "warm";
  if (weather.temp < 10) return "cold";
  return "warm";
}

function getTimeOfDay(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "morning";
  if (hour < 17) return "afternoon";
  return "evening";
}

function generateOccasionSuggestion(
  event: CalendarEvent,
  weather: WeatherData
): StyleCoachSuggestion {
  const weatherCategory = getWeatherCategory(weather);
  const suggestion =
    styleTemplates[event.type]?.[weatherCategory] ||
    "Wear something comfortable and appropriate for the occasion";

  return {
    occasion: event.title,
    timeOfDay: event.time,
    weather: weather.description,
    suggestion,
    tips: styleTips[getTimeOfDay()] || [],
    confidence: 0.92,
  };
}

export async function generateDailySuggestions(
  date: "today" | "tomorrow" = "today"
): Promise<DailySuggestions> {
  const weather = getMockWeather();
  const events = mockCalendarEvents[date] || [];
  const suggestions = events.map((event) =>
    generateOccasionSuggestion(event, weather)
  );

  const generalAdvice =
    weather.temp > 25
      ? "Light, breathable fabrics will keep you comfortable throughout the day"
      : weather.temp < 10
      ? "Layer up! Multiple light layers are more effective than one heavy piece"
      : "A light jacket or sweater should do the trick";

  return {
    date: date === "today" ? new Date().toISOString().split("T")[0] : "tomorrow",
    weather,
    events,
    suggestions,
    generalAdvice,
  };
}

export async function getPersonalizedOutfitAdvice(
  userPreferences: {
    colorPalette: string[];
    stylePreferences: string[];
    bodyType?: string;
  },
  occasion: string
): Promise<{
  recommendation: string;
  colors: string[];
  items: string[];
  tips: string[];
}> {
  const weather = getMockWeather();
  const weatherCategory = getWeatherCategory(weather);

  return {
    recommendation: `Based on your preferences and ${occasion}, here's a personalized outfit:`,
    colors: userPreferences.colorPalette,
    items: [
      "Base layer (shirt/top)",
      "Bottom (pants/skirt/dress)",
      "Outer layer (jacket/cardigan)",
      "Shoes",
      "Accessories",
    ],
    tips: [
      `Your color palette (${userPreferences.colorPalette.join(", ")}) works great for ${occasion}`,
      "Consider the weather: " + weather.description,
      "Mix and match pieces you already own",
      "Prioritize comfort and confidence",
      "Accessorize to complete the look",
    ],
  };
}

export function getWeeklyOutfitInsights(): {
  weekDays: string[];
  recommendations: string[];
  sustainabilityTip: string;
} {
  return {
    weekDays: [
      "Monday (Work Focus)",
      "Tuesday (Casual Day)",
      "Wednesday (Meeting Heavy)",
      "Thursday (Mixed Activities)",
      "Friday (Relaxed Friday)",
    ],
    recommendations: [
      "Plan your outfits the night before to save time",
      "Create outfit combinations that work together",
      "Rotate pieces to maximize your wardrobe",
      "Keep accessories to freshen up outfits",
      "Layer for temperature changes throughout the day",
    ],
    sustainabilityTip:
      "By carefully planning outfits, you wear each item more often, extending its lifespan and reducing the need for new purchases",
  };
}

export function getSeasonalAdvice(season: "spring" | "summer" | "fall" | "winter"): {
  colors: string[];
  fabrics: string[];
  essentials: string[];
  tips: string[];
} {
  const seasonalGuides: Record<string, any> = {
    spring: {
      colors: ["Pastels", "Light greens", "Soft pinks", "Warm neutrals"],
      fabrics: ["Linen", "Cotton", "Light wool", "Chiffon"],
      essentials: [
        "Lightweight layers",
        "Cardigans",
        "Light jackets",
        "Breathable tops",
      ],
      tips: [
        "Layer for unpredictable weather",
        "Transition from winter to summer gradually",
        "Choose breathable fabrics as temperatures rise",
      ],
    },
    summer: {
      colors: ["Bright", "Vibrant", "Pastels", "Whites and neutrals"],
      fabrics: ["Cotton", "Linen", "Silk", "Lightweight blends"],
      essentials: [
        "T-shirts",
        "Shorts",
        "Dresses",
        "Sunglasses",
        "Hat",
      ],
      tips: [
        "Prioritize breathable, lightweight fabrics",
        "Wear sunscreen and UV-protective clothing",
        "Keep colors light to reflect heat",
      ],
    },
    fall: {
      colors: ["Burgundy", "Olive", "Mustard", "Warm browns"],
      fabrics: ["Wool", "Cotton", "Tweed", "Suede"],
      essentials: [
        "Sweaters",
        "Jackets",
        "Long pants",
        "Boots",
        "Scarves",
      ],
      tips: [
        "Layer pieces for temperature transitions",
        "Invest in quality sweaters and jackets",
        "Mix warm colors and textures",
      ],
    },
    winter: {
      colors: ["Deep jewel tones", "Blacks", "Grays", "Metallics"],
      fabrics: ["Wool", "Cashmere", "Fleece", "Heavy cotton"],
      essentials: [
        "Coat",
        "Sweaters",
        "Thermal layers",
        "Boots",
        "Gloves",
        "Scarf",
      ],
      tips: [
        "Layer smartly for warmth and style",
        "Invest in a quality winter coat",
        "Choose darker colors to retain heat",
      ],
    },
  };

  return seasonalGuides[season] || seasonalGuides.spring;
}
