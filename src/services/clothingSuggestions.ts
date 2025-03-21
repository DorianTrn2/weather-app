export const getClothingSuggestions = (temperature: number): string[] => {
  if (temperature <= 0) {
    return ['Manteau chaud', 'Écharpe', 'Gants', 'Bonnet']
  }
  if (temperature <= 10) {
    return ['Manteau', 'Pull chaud', 'Écharpe']
  }
  if (temperature <= 15) {
    return ['Veste', 'Pull léger']
  }
  if (temperature <= 20) {
    return ['Pull léger', 'T-shirt']
  }
  if (temperature <= 25) {
    return ['T-shirt', 'Short ou pantalon léger']
  }
  return ['T-shirt', 'Short', 'Chapeau']
}

export const adjustSuggestionsForWeather = (suggestions: string[], description: string): string[] => {
  const lowerDescription = description.toLowerCase()
  
  if (lowerDescription.includes('pluie')) {
    return [...suggestions, 'Parapluie', 'Imperméable']
  }
  
  if (lowerDescription.includes('neige')) {
    return [...suggestions, 'Bottes imperméables']
  }
  
  return suggestions
} 