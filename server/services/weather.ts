import axios from "axios";

// Ensure dotenv is loaded
import dotenv from "dotenv";
dotenv.config();

const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;
const OPENWEATHER_BASE_URL = "https://api.openweathermap.org/data/2.5";

export interface WeatherData {
  temperature: number;
  feelsLike: number;
  humidity: number;
  description: string;
  main: string;
  windSpeed: number;
  visibility: number;
  uvIndex?: number;
  location: string;
  timestamp: Date;
}

export interface WeatherForecast {
  date: string;
  temperature: {
    min: number;
    max: number;
  };
  description: string;
  main: string;
  humidity: number;
  windSpeed: number;
}

export interface OutfitRecommendation {
  layers: string[];
  materials: string[];
  accessories: string[];
  footwear: string[];
  tips: string[];
}

class WeatherService {
  private isConfigured(): boolean {
    return Boolean(OPENWEATHER_API_KEY);
  }

  private buildMockWeatherData(location: string): WeatherData {
    return {
      temperature: 22,
      feelsLike: 24,
      humidity: 65,
      description: "partly cloudy",
      main: "Clouds",
      windSpeed: 5.2,
      visibility: 10000,
      uvIndex: 6,
      location,
      timestamp: new Date()
    };
  }

  private buildMockForecast(): WeatherForecast[] {
    const days = ['Today', 'Tomorrow', 'Day 3', 'Day 4', 'Day 5'];
    return days.map((day, index) => ({
      date: day,
      temperature: {
        min: 18 + index,
        max: 25 + index,
      },
      description: index % 2 === 0 ? "sunny" : "partly cloudy",
      main: index % 2 === 0 ? "Clear" : "Clouds",
      humidity: 60 + index * 5,
      windSpeed: 3 + index
    }));
  }

  async getCurrentWeather(location: string): Promise<WeatherData> {
    if (!this.isConfigured()) {
      console.warn("OpenWeather API key not configured. Returning mock data.");
      return this.buildMockWeatherData(location);
    }

    try {
      const response = await axios.get(
        `${OPENWEATHER_BASE_URL}/weather`,
        {
          params: {
            q: location,
            appid: OPENWEATHER_API_KEY,
            units: "metric"
          }
        }
      );

      const data = response.data;
      return {
        temperature: Math.round(data.main.temp),
        feelsLike: Math.round(data.main.feels_like),
        humidity: data.main.humidity,
        description: data.weather[0].description,
        main: data.weather[0].main,
        windSpeed: data.wind.speed,
        visibility: data.visibility,
        location: data.name,
        timestamp: new Date()
      };
    } catch (error: any) {
      console.error("Weather API Error:", error.message);
      return this.buildMockWeatherData(location);
    }
  }

  async getWeatherForecast(location: string, days: number = 5): Promise<WeatherForecast[]> {
    if (!this.isConfigured()) {
      console.warn("OpenWeather API key not configured. Returning mock forecast.");
      return this.buildMockForecast();
    }

    try {
      const response = await axios.get(
        `${OPENWEATHER_BASE_URL}/forecast`,
        {
          params: {
            q: location,
            appid: OPENWEATHER_API_KEY,
            units: "metric",
            cnt: days * 8 // 8 forecasts per day (every 3 hours)
          }
        }
      );

      const forecasts: WeatherForecast[] = [];
      const dailyData: { [key: string]: any[] } = {};

      // Group forecasts by date
      response.data.list.forEach((item: any) => {
        const date = new Date(item.dt * 1000).toDateString();
        if (!dailyData[date]) {
          dailyData[date] = [];
        }
        dailyData[date].push(item);
      });

      // Process daily forecasts
      Object.keys(dailyData).slice(0, days).forEach(date => {
        const dayForecasts = dailyData[date];
        const temps = dayForecasts.map(f => f.main.temp);
        const mainWeather = dayForecasts[Math.floor(dayForecasts.length / 2)];

        forecasts.push({
          date: new Date(date).toLocaleDateString(),
          temperature: {
            min: Math.round(Math.min(...temps)),
            max: Math.round(Math.max(...temps))
          },
          description: mainWeather.weather[0].description,
          main: mainWeather.weather[0].main,
          humidity: mainWeather.main.humidity,
          windSpeed: mainWeather.wind.speed
        });
      });

      return forecasts;
    } catch (error: any) {
      console.error("Weather Forecast API Error:", error.message);
      return this.buildMockForecast();
    }
  }

  getOutfitRecommendationForWeather(weather: WeatherData): OutfitRecommendation {
    const temp = weather.temperature;
    const isRainy = weather.main.toLowerCase().includes('rain');
    const isWindy = weather.windSpeed > 10;
    const isHumid = weather.humidity > 70;

    const recommendation: OutfitRecommendation = {
      layers: [],
      materials: [],
      accessories: [],
      footwear: [],
      tips: []
    };

    // Temperature-based recommendations
    if (temp < 5) {
      recommendation.layers = ['thermal base layer', 'warm sweater', 'heavy coat', 'scarf'];
      recommendation.materials = ['wool', 'fleece', 'down insulation'];
      recommendation.footwear = ['insulated boots', 'warm socks'];
      recommendation.accessories = ['warm hat', 'gloves', 'scarf'];
    } else if (temp < 15) {
      recommendation.layers = ['light base layer', 'cardigan or light jacket'];
      recommendation.materials = ['cotton blend', 'light wool', 'denim'];
      recommendation.footwear = ['closed-toe shoes', 'ankle boots'];
      recommendation.accessories = ['light scarf', 'crossbody bag'];
    } else if (temp < 25) {
      recommendation.layers = ['comfortable top', 'light cardigan (optional)'];
      recommendation.materials = ['cotton', 'linen blend', 'breathable fabrics'];
      recommendation.footwear = ['sneakers', 'loafers', 'comfortable flats'];
      recommendation.accessories = ['sunglasses', 'light bag'];
    } else {
      recommendation.layers = ['breathable top', 'light bottoms'];
      recommendation.materials = ['linen', 'cotton', 'moisture-wicking fabrics'];
      recommendation.footwear = ['sandals', 'breathable sneakers'];
      recommendation.accessories = ['sun hat', 'sunglasses', 'light tote'];
    }

    // Weather condition adjustments
    if (isRainy) {
      recommendation.layers.push('waterproof jacket');
      recommendation.footwear = ['waterproof shoes', 'rain boots'];
      recommendation.accessories.push('umbrella');
      recommendation.tips.push('Choose quick-dry materials');
    }

    if (isWindy) {
      recommendation.tips.push('Avoid loose, flowing garments');
      recommendation.tips.push('Secure accessories and hair');
    }

    if (isHumid) {
      recommendation.materials = recommendation.materials.filter(m => 
        ['linen', 'cotton', 'moisture-wicking fabrics', 'breathable fabrics'].includes(m)
      );
      recommendation.tips.push('Choose breathable, natural fabrics');
    }

    // Sustainability tips
    recommendation.tips.push('Layer pieces you already own');
    recommendation.tips.push('Choose versatile items that work for multiple occasions');

    return recommendation;
  }

  async getWeatherBasedOutfitSuggestion(
    location: string,
    userPreferences: any = {}
  ): Promise<{
    weather: WeatherData;
    recommendation: OutfitRecommendation;
    suggestion: string;
  }> {
    const weather = await this.getCurrentWeather(location);
    const recommendation = this.getOutfitRecommendationForWeather(weather);

    const suggestion = this.buildOutfitSuggestionText(weather, recommendation, userPreferences);

    return {
      weather,
      recommendation,
      suggestion
    };
  }

  private buildOutfitSuggestionText(
    weather: WeatherData,
    recommendation: OutfitRecommendation,
    userPreferences: any
  ): string {
    const { temperature, description, location } = weather;
    const preferredColors = userPreferences.favoriteColors || ['neutral tones'];
    const stylePreference = userPreferences.stylePreferences?.[0] || 'comfortable';

    return [
      `Weather-based outfit for ${location}:`,
      `Current conditions: ${temperature}°C, ${description}`,
      '',
      'Recommended outfit:',
      `• Layers: ${recommendation.layers.join(', ')}`,
      `• Materials: ${recommendation.materials.join(', ')}`,
      `• Footwear: ${recommendation.footwear.join(' or ')}`,
      `• Accessories: ${recommendation.accessories.join(', ')}`,
      '',
      'Styling tips:',
      ...recommendation.tips.map(tip => `• ${tip}`),
      `• Incorporate your preferred ${preferredColors.join(' and ')} colors`,
      `• Keep your ${stylePreference} style preference in mind`,
      '',
      'Sustainable fashion tip: Choose pieces that can transition from this weather to other conditions with simple layering adjustments.'
    ].join('\n');
  }
}

export const weatherService = new WeatherService();