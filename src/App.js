import React, { useState } from 'react';
import axios from 'axios';
import './App.css'; 

function WeatherApp() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState('');

  const handleCityChange = (event) => {
    setCity(event.target.value);
  };

  const fetchCoordinates = async (cityName) => {
    try {
      const response = await axios.get('https://nominatim.openstreetmap.org/search', {
        params: {
          q: cityName,
          format: 'json', 
          addressdetails: 1,  
        },
      });

      console.log(response.data);

      if (response.data.length === 0) {
        throw new Error('No results found for this city');
      }

      const { lat, lon } = response.data[0];
      return { lat, lon };
    } catch (error) {
      setError('City not found or Geocoding API error');
      console.error(error);
      return null;
    }
  };

  const fetchWeather = async () => {
    setWeather(null);
    setError('');
  
    try {
      const coordinates = await fetchCoordinates(city);
  
      if (coordinates) {
        const { lat, lon } = coordinates;
  
        const weatherResponse = await axios.get('https://api.open-meteo.com/v1/forecast', {
          params: {
            latitude: lat,
            longitude: lon,
            current_weather: true, 
          },
        });
  
        console.log('Weather Response:', weatherResponse.data);
  
        if (weatherResponse.data.current_weather) {
          const { temperature, windspeed, humidity } = weatherResponse.data.current_weather;
  
          console.log('Temperature:', temperature);
          console.log('Wind Speed:', windspeed);
          console.log('Humidity:', humidity);
  
          setWeather({
            temperature,
            windspeed,
            humidity,
          });
          setError('');
        } else {
          setError('Unable to retrieve weather data');
        }
      }
    } catch (error) {
      setError('Weather data retrieval failed');
      console.error(error);
    }
  };
  

  return (
    <div className="weather-app">
      <h1>Current Weather</h1>
      
      <input
        type="text"
        value={city}
        onChange={handleCityChange}
        placeholder="Enter city"
        className="city-input"
      />
      
      <button onClick={fetchWeather} className="weather-btn">Get Weather</button>

      {error && <p className="error">{error}</p>}

      {weather && (
        <div className="weather-info">
          <p>Temperature: {weather.temperature}°C</p>
          <p>Wind Speed: {weather.windspeed} km/h</p>
          <p>Humidity: {weather.humidity}%</p>
        </div>
      )}
    </div>
  );
}

export default WeatherApp;
