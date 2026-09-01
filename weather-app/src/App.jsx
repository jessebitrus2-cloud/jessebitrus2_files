import { useState } from "react";
import "./App.css";
import logo from "./assets/my-logo.png";
import codingImage from "./assets/me-coding.png";

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

  const [activePage, setActivePage] = useState("home");

  const showWeather = () => {
    setActivePage("weather");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scrollToHomeSection = (sectionId) => {
    setActivePage("home");

    setTimeout(() => {
      document.getElementById(sectionId)?.scrollIntoView({
        behavior: "smooth",
      });
    }, 0);
  };

const showHome = () => {
  setActivePage("home");
  window.scrollTo({ top: 0, behavior: "smooth" });
};

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
      <div className="site-shell">
  <nav className="navbar">
    <button className="brand" type="button" onClick={showHome}>
      <img src={logo} alt="JC logo" className="brand-logo" />
      <span>JC Weather App.</span>
    </button>

    <div className="nav-links">
      <button
        className={activePage === "home" ? "nav-link active" : "nav-link"}
        type="button"
        onClick={showHome}
      >
        Home
      </button>

      <button
        className={activePage === "weather" ? "nav-link active" : "nav-link"}
        type="button"
        onClick={showWeather}
      >
        Check Weather
      </button>

      <button
      className="nav-link"
      type="button"
      onClick={() => scrollToHomeSection("about")}
    >
      About Us
    </button>

    <button
      className="nav-link"
      type="button"
      onClick={() => scrollToHomeSection("contact")}
    >
      Contact Us
    </button>

    </div>
  </nav>

    {activePage === "home" && (
      <main className="home-page">
        <section className="home-hero">
          <div className="hero-copy">
            <p className="eyebrow">JC WEATHER APP.</p>
            <h1>Check Your Weather information, wherever you are.</h1>
            <p>
              Search any city or use your current location to view live weather
              conditions and a seven-day forecast.
            </p>

            <button className="weather-cta" type="button" onClick={showWeather}>
              Check Weather
            </button>
          </div>

          <div className="hero-visual">
            <img
              src={codingImage}
              alt="Developer working on a computer"
              className="hero-image"
            />

            <div className="hero-contact">
              <p>
                <strong>Jesse Bitrus</strong>
              </p>

              <a href="tel:08068684778">Phone: 08068684778</a>

              <a
                href="https://wa.me/2348025536255"
                target="_blank"
                rel="noreferrer"
              >
                WhatsApp: 08025536255
              </a>
            </div>

          </div>
    </section>

      <section id="about" className="about-section">
  <div className="about-content">
    <p className="section-label">ABOUT JC WEATHER APP.</p>

    <h2>Simple, reliable weather information for everyone.</h2>

    <p className="about-description">
      JC Weather-app helps you check current weather conditions and a seven-day
      forecast for cities around the world. Search for a city or use your
      current location to plan your day with confidence.
    </p>

    <div className="about-features">
      <article className="about-card">
        <span>🌍</span>
        <h3>Worldwide Search</h3>
        <p>Check weather conditions for cities across the globe.</p>
      </article>

      <article className="about-card">
        <span>📍</span>
        <h3>Use Your Location</h3>
        <p>Get weather information for where you are right now.</p>
      </article>

      <article className="about-card">
        <span>📅</span>
        <h3>7-Day Forecast</h3>
        <p>Prepare ahead with a clear weekly weather forecast.</p>
      </article>
    </div>
  </div>
</section>

      <section id="contact" className="contact-section">
        <div className="contact-content">
          <p className="section-label">CONTACT US</p>

          <h2>Need weather information? Get in touch.</h2>

          <p className="contact-description">
            Reach out by phone or WhatsApp. We will be glad to hear from you.
          </p>

          <div className="contact-actions">
            <a className="contact-card" href="tel:08068684778">
              <span>📞</span>
              <div>
                <h3>Phone</h3>
                <p>08068684778</p>
              </div>
            </a>

            <a
              className="contact-card"
              href="https://wa.me/2348025536255"
              target="_blank"
              rel="noreferrer"
            >
              <span>💬</span>
              <div>
                <h3>WhatsApp</h3>
                <p>08025536255</p>
              </div>
            </a>
          </div>
        </div>
      </section>


    <footer className="site-footer">
      <div className="footer-content">
        <div className="footer-brand">
          <div>
            <h2>JC Weather</h2>
            <p>Phone/WhatsApp: +234 806 868 4778</p>
            <p>Weather information, wherever you are.</p>
          </div>
        </div>

        <div className="footer-links">
          <h3>Quick Links</h3>

          <button type="button" onClick={showHome}>
            Home
          </button>

          <button type="button" onClick={showWeather}>
            Check Weather
          </button>
        </div>

        <div className="footer-socials">
          <h3>Follow Us</h3>

          <a
            href="https://facebook.com/your-handle"
            target="_blank"
            rel="noreferrer"
          >
            Facebook
          </a>

          <a
            href="https://instagram.com/your-handle"
            target="_blank"
            rel="noreferrer"
          >
            Instagram
          </a>

          <a
            href="https://wa.me/2340000000000"
            target="_blank"
            rel="noreferrer"
          >
            WhatsApp
          </a>

          <a
            href="https://x.com/your-handle"
            target="_blank"
            rel="noreferrer"
          >
            X (Twitter)
          </a>

          <a
            href="https://linkedin.com/in/your-handle"
            target="_blank"
            rel="noreferrer"
          >
            LinkedIn
          </a>
        </div>
      </div>

      <p className="footer-bottom">
        © {new Date().getFullYear()} JC Weather. All rights reserved.
      </p>
    </footer>
  </main>
)}


  <div
    className={`app weather-page ${
      activePage === "weather" ? "weather-page--active" : ""
    }`}
  ></div>

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