const OPENWEATHER_API_KEY =
  process.env.OPENWEATHER_API_KEY || "3bbdc5d0e15ec391444b1a5ecd7ee207";
const OPENWEATHER_API_URL = "https://api.openweathermap.org/data/2.5/weather";

export interface WeatherData {
  temp: number;
  description: string;
  humidity: number;
  windSpeed: number;
  icon: string;
}

export async function getWeather(
  lat: number,
  lon: number
): Promise<WeatherData | null> {
  try {
    const response = await fetch(
      `${OPENWEATHER_API_URL}?lat=${lat}&lon=${lon}&appid=${OPENWEATHER_API_KEY}&units=metric`
    );

    if (!response.ok) {
      throw new Error(
        `Weather API Error: ${response.status} - ${response.statusText}`
      );
    }

    const data = await response.json();

    return {
      temp: data.main.temp,
      description: data.weather[0].main,
      humidity: data.main.humidity,
      windSpeed: data.wind.speed,
      icon: data.weather[0].icon,
    };
  } catch (error) {
    console.error("Weather Service Error:", error);
    return null;
  }
}

export function getWeatherBasedRecommendations(
  weather: WeatherData
): string[] {
  const recommendations: string[] = [];

  if (weather.temp < 10) {
    recommendations.push("Wear warm layers and a heavy coat");
    recommendations.push("Consider thermal undergarments");
  } else if (weather.temp < 20) {
    recommendations.push("Light layers recommended");
    recommendations.push("A jacket or cardigan would be helpful");
  } else if (weather.temp > 25) {
    recommendations.push("Breathable fabrics are ideal");
    recommendations.push("Consider light colors to reflect heat");
  }

  if (weather.description.includes("Rain")) {
    recommendations.push("Bring waterproof outerwear");
    recommendations.push("Waterproof shoes recommended");
  }

  if (weather.windSpeed > 20) {
    recommendations.push("Secure your outfit with layers that won't blow away");
    recommendations.push("Avoid loose fabrics");
  }

  return recommendations;
}

export function getMockWeather(): WeatherData {
  return {
    temp: 22,
    description: "Partly Cloudy",
    humidity: 65,
    windSpeed: 12,
    icon: "02d",
  };
}
