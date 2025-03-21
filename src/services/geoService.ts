import { GeoResponse } from '../types/geo';
export const getCurrentLocation = (): Promise<GeolocationPosition> => {
  if (!navigator.geolocation) {
    throw new Error('La géolocalisation n\'est pas supportée par votre navigateur');
  }
  
  return new Promise<GeolocationPosition>((resolve, reject) => 
    navigator.geolocation.getCurrentPosition(resolve, reject)
  );
};

export const getCityFromCoordinates = async (latitude: number, longitude: number): Promise<GeoResponse> => {
  try {
    const response = await fetch(
      `/geo/reverse?format=json&lat=${latitude}&lon=${longitude}`
    );
    
    if (!response.ok) {
      throw new Error(`Erreur HTTP ! status: ${response.status}`);
    }
    
    const data = await response.json();
    return {
      city: data.address.city || data.address.town || data.address.village,
      country: data.address.country
    };
  } catch (error) {
    throw new Error('Erreur lors de la récupération de la ville');
  }
}; 