// src/types/weather.ts
export interface WeatherForecastResponse {
    current: {
      temp: number;
      humidity: number;
      wind_speed: number;
      weather: Array<{ description: string }>;
    };
    daily: Array<{
      dt: number;
      temp: { day: number };
      weather: Array<{ description: string }>;
    }>;
  }
  
  export interface LocationResponse {
    name: string;
    country: string;
  }
  
  export interface APIResponse<T> {
    error?: string;
    data?: T;
  }
  