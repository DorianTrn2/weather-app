import { useState, useEffect } from 'react'
import { WeatherState, ThemeState } from './types/weather'
import { getClothingSuggestions, adjustSuggestionsForWeather } from './services/clothingSuggestions'
import { getWeatherByCity } from './services/weatherService'
import { getCurrentLocation, getCityFromCoordinates } from './services/geoService'
import { MagnifyingGlassIcon, SunIcon, MoonIcon } from '@heroicons/react/24/solid'
import './App.css'

function App() {
  const [weather, setWeather] = useState<WeatherState>({ data: null, loading: false, error: null })
  const [city, setCity] = useState<string>('')
  const [theme, setTheme] = useState<ThemeState>(() => {
    const savedTheme = localStorage.getItem('theme')
    return { isDark: savedTheme === 'dark' }
  })
  const [suggestions, setSuggestions] = useState<string[]>([])

  useEffect(() => {
    document.body.className = theme.isDark ? 'dark' : 'light'
    localStorage.setItem('theme', theme.isDark ? 'dark' : 'light')
  }, [theme.isDark])

  useEffect(() => {
    const lastCity = localStorage.getItem('lastCity')
    if (lastCity) {
      setCity(lastCity)
      getWeather(lastCity)
    } else {
      handleGeolocation()
    }
  }, [])

  useEffect(() => {
    if (weather.data) {
      const baseSuggestions = getClothingSuggestions(weather.data.temperature)
      const adjustedSuggestions = adjustSuggestionsForWeather(baseSuggestions, weather.data.weather_description)
      setSuggestions(adjustedSuggestions)
    }
  }, [weather.data])

  const getWeather = async (searchCity: string) => {
    try {
      setWeather(state => ({ ...state, loading: true, error: null }))
      const weatherData = await getWeatherByCity(searchCity)
      
      setWeather({
        data: weatherData,
        loading: false,
        error: null
      })
      
      localStorage.setItem('lastCity', searchCity)
    } catch (error) {
      setWeather(state => ({
        ...state,
        loading: false,
        error: 'Erreur lors de la récupération des données météo'
      }))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (city.trim()) {
      getWeather(city)
    }
  }

  const handleGeolocation = async () => {
    try {
      const position = await getCurrentLocation()
      const { city: locationCity } = await getCityFromCoordinates(
        position.coords.latitude,
        position.coords.longitude
      )
      
      setCity(locationCity)
      getWeather(locationCity)
    } catch (error) {
      setWeather(state => ({
        ...state,
        error: 'Erreur lors de la géolocalisation'
      }))
    }
  }

  const toggleTheme = () => {
    setTheme(prev => ({ isDark: !prev.isDark }))
  }

  return (
    <div className={`app ${theme.isDark ? 'dark' : 'light'}`}>
      <button onClick={toggleTheme} className="theme-toggle" aria-label="Toggle theme">
        {theme.isDark ? (
          <SunIcon className="icon" />
        ) : (
          <MoonIcon className="icon" />
        )}
      </button>

      <form onSubmit={handleSubmit} className="search-form">
        <MagnifyingGlassIcon className="search-icon" />
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="Rechercher"
        />
      </form>

      {weather.loading && <div className="loading">Chargement...</div>}
      {weather.error && <div className="error">{weather.error}</div>}
      
      {weather.data && (
        <div className="weather-info">
          <h2>{weather.data.city} · {weather.data.country}</h2>
          <hr />
          <div className="temperature">{weather.data.temperature}°C</div>
          <div className="description">{weather.data.weather_description}</div>
          <hr />
          <div className="details">
            <div>Humidité: {weather.data.humidity}%</div>
            <div>Vent: {weather.data.wind_speed} km/h</div>
          </div>

          {suggestions.length > 0 && (
            <div className="clothing-suggestions">
              <h3>Suggestions de tenue</h3>
              <ul>
                {suggestions.map((suggestion, index) => (
                  <li key={index}>{suggestion}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default App
