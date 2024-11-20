import React from 'react';

function WeatherDisplay({ weather }) {
  return (
    <div className="weather-display">
      <h2>Current Weather</h2>
      <p>Temperature: {weather.temperature}°C</p>
      <p>Wind Speed: {weather.windspeed} km/h</p>
      <p>Humidity: {weather.humidity}%</p>
    </div>
  );
}

export default WeatherDisplay;

