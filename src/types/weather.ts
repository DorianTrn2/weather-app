export interface Weather {
  id: number;
  city: string;
  country: string;
  temperature: number;
  description: string;
  humidity: number;
  wind_speed: number;
  weather_description: string;
  latitude: number;
  longitude: number;
}

export interface WeatherState {
  data: Weather | null;
  loading: boolean;
  error: string | null;
}

export interface ThemeState {
  isDark: boolean;
} 