import { useState } from "react";
import "./App.css";

const getWeatherDescription = (code) => {
  if (code === 0) return "☀️ Clear sky";
  if (code >= 1 && code <= 3) return "🌤️ Partly cloudy";
  if (code >= 45 && code <= 48) return "🌫️ Fog";
  if (code >= 51 && code <= 57) return "🌦️ Drizzle";
  if (code >= 61 && code <= 67) return "🌧️ Rain";
  if (code >= 71 && code <= 77) return "❄️ Snow";
  if (code >= 80 && code <= 82) return "🌦️ Rain showers";
  if (code === 95) return "⛈️ Thunderstorm";

  if (code >= 96 && code <= 99) {
    return "⛈️ Thunderstorm with hail";
  }

  return "🌤️ Unknown weather";
};


function App() {
  const [city, setCity] = useState("");
  const [location, setLocation] = useState(null);
  const [weather, setWeather] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [unit, setUnit] = useState("C");

  const convertTemperature = (celsius) => {
    if (unit === "C") {
      return Math.round(celsius);
    }

    return Math.round((celsius * 9) / 5 + 32);
  };

 const getMyLocation = () => {
      if (!navigator.geolocation) {
        setError("Geolocation is not supported by your browser.");
        return;
      }

      setError("");
      setLoading(true);

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;

        const locationResponse = await fetch(
  `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10&addressdetails=1`
);

const locationData = await locationResponse.json();

const locationName =
  locationData.address?.city ||
  locationData.address?.town ||
  locationData.address?.village ||
  locationData.address?.city_district ||
  "My Location";

setCity(locationName);

          try {
            const weatherResponse = await fetch(
              `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset&timezone=auto`
            );

            const weatherData = await weatherResponse.json();

            setWeather({
              current: weatherData.current,
              daily: weatherData.daily,
              timezone: weatherData.timezone,
            });

            setLocation({
              name: "My Location",
              country: "",
              latitude,
              longitude,
            });
          } catch (error) {
            setError("Could not get weather for your location.");
          } finally {
            setLoading(false);
          }
        },

       () => {
          setLoading(false);
          setError("Unable to access your location.");
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    };

  const searchLocation = async () => {
    if (!city.trim()) {
      setError("Please enter a city name.");
      return;
    }

    setError("");
    setLocation(null);
    setWeather(null);
    setLoading(true);

    try {
      const locationResponse = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
          city
        )}&count=1&language=en&format=json`
      );

      const locationData = await locationResponse.json();
     
      console.log("Reverse Geocoding Result:", locationData);

     if (!locationData.results || locationData.results.length === 0) {
      setError("Location not found.");
      setLoading(false);
      return;
    }

      const foundLocation = locationData.results[0];

      setLocation(foundLocation);

 const weatherResponse = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${foundLocation.latitude}&longitude=${foundLocation.longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset&timezone=auto`
      );

      const weatherData = await weatherResponse.json();

      setWeather({
        current: weatherData.current,
        daily: weatherData.daily,
        timezone: weatherData.timezone,
      });
    } catch (error) {
  setError("Something went wrong. Please try again.");
} finally {
  setLoading(false);
}
  };

  return (
    <div className="app">
      <div className="weather-container">

        <header className="header">
          <h1>🌤️ World Weather</h1>
          <p>Check the weather anywhere in the world</p>
        </header>

        <div className="search-area">
          <input
            type="text"
            placeholder="Enter a city..."
            value={city}
            onChange={(e) => setCity(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                searchLocation();
              }
            }}
          />

        <button onClick={searchLocation} disabled={loading}>
          {loading ? "⏳ Searching..." : "Search"}
        </button>

        </div>

        <button
          className="location-button"
          onClick={getMyLocation}
          disabled={loading}
        >
          {loading ? "📍 Finding Location..." : "📍 Use My Location"}
        </button>

        <div className="unit-switch">
          <button
            className={unit === "C" ? "active" : ""}
            onClick={() => setUnit("C")}
          >
            °C
          </button>

          <button
            className={unit === "F" ? "active" : ""}
            onClick={() => setUnit("F")}
          >
            °F
          </button>
        </div>

        {error && <p className="error">{error}</p>}

      {loading && (
        <div className="loading">
          <div className="spinner"></div>
          <p>Checking the weather...</p>
        </div>
      )}

        {location && weather && (
          <main className="weather-content">

            <section className="location-card">
              <h2>
                {location.name}, {location.country}
              </h2>

              <p>
                📍 {location.latitude.toFixed(2)},{" "}
                {location.longitude.toFixed(2)}
              </p>
            </section>

            <section className="current-weather">

              <div className="temperature">
                <span>
                  {convertTemperature(weather.current.temperature_2m)}
                </span>
                <sup>°{unit}</sup>
              </div>

              <h2>
                {getWeatherDescription(weather.current.weather_code)}
              </h2>

             <p>
              Feels like{" "}
              {convertTemperature(weather.current.apparent_temperature)}°{unit}
            </p>

            </section>

            <section className="weather-details">

              <div className="weather-card">
                <span>💧</span>
                <h3>Humidity</h3>
                <p>
                  {weather.current.relative_humidity_2m}%
                </p>
              </div>

              <div className="weather-card">
                <span>💨</span>
                <h3>Wind Speed</h3>
                <p>
                  {weather.current.wind_speed_10m} km/h
                </p>
              </div>

              <div className="weather-card">
                <span>🌅</span>
                <h3>Sunrise</h3>
                <p>
                  {new Date(
                    weather.daily.sunrise[0]
                  ).toLocaleTimeString()}
                </p>
              </div>

              <div className="weather-card">
                <span>🌇</span>
                <h3>Sunset</h3>
                <p>
                  {new Date(
                    weather.daily.sunset[0]
                  ).toLocaleTimeString()}
                </p>
              </div>

                        </section>

            <section className="forecast-section">
  <h2>📅 7-Day Forecast</h2>

  <div className="forecast-container">
    {weather.daily.time.map((date, index) => {
      const weatherDescription = getWeatherDescription(
        weather.daily.weather_code[index]
      );

      const weatherParts = weatherDescription.split(" ");
      const weatherIcon = weatherParts[0];
      const weatherText = weatherParts.slice(1).join(" ");

      const isToday = index === 0;

      return (
        <div
          className={`forecast-card ${isToday ? "today" : ""}`}
          key={date}
        >
          {isToday && <div className="today-label">TODAY</div>}

          <h3>
            {new Date(date + "T12:00:00").toLocaleDateString("en-US", {
              weekday: "short",
            })}
          </h3>

          <p className="forecast-date">
            {new Date(date + "T12:00:00").toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
            })}
          </p>

          <div className="forecast-icon">
            {weatherIcon}
          </div>

          <p className="forecast-weather">
            {weatherText}
          </p>
            <p className="forecast-temperature">
              <strong>
                {convertTemperature(weather.daily.temperature_2m_max[index])}°{unit}
              </strong>

              <span> / </span>

              {convertTemperature(weather.daily.temperature_2m_min[index])}°{unit}
            </p>
      
        </div>
      );
    })}
  </div>
</section>

            <p className="timezone">
              🌍 Timezone: {weather.timezone}
            </p>

          </main>
        )}

      </div>
    </div>
  );
}

export default App;