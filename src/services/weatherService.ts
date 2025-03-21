import { Weather } from '../types/weather';

export const getWeatherByCity = async (city: string): Promise<Weather> => {
  try {
    const response = await fetch(`/api/v1/weathers?limit=1&search=${city}`);

    if (!response.ok) {
      throw new Error(`Erreur HTTP ! status: ${response.status}`);
    }
    const data = await response.json();
    const weatherData = Array.isArray(data) ? data[0] : data;
    
    if (!weatherData) {
      throw new Error('Aucune donnée météo trouvée pour cette ville');
    }
    
    return weatherData;
  } catch (error) {
    console.error('Erreur détaillée:', error);
    throw new Error('Erreur lors de la récupération des données météo');
  }
};

export const saveWeatherToLocalStorage = (weather: Weather): void => {
  localStorage.setItem('lastWeather', JSON.stringify(weather));
};

export const getWeatherFromLocalStorage = (): Weather | null => {
  const savedWeather = localStorage.getItem('lastWeather');
  return savedWeather ? JSON.parse(savedWeather) : null;
}; 