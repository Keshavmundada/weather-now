import React, { useState, useEffect } from "react";

const weatherCodeToCondition = (code) => {
  if (code === 0) return { condition: "Clear Sky", emoji: "☀️", bgLight: "from-slate-50 via-gray-50 to-zinc-50", bgDark: "from-slate-900 via-gray-900 to-zinc-900" };
  if (code === 1 || code === 2 || code === 3) return { condition: "Partly Cloudy", emoji: "⛅", bgLight: "from-slate-100 via-gray-100 to-zinc-100", bgDark: "from-slate-800 via-gray-800 to-zinc-800" };
  if (code === 45 || code === 48) return { condition: "Foggy", emoji: "🌫️", bgLight: "from-gray-200 via-slate-200 to-zinc-200", bgDark: "from-gray-700 via-slate-700 to-zinc-700" };
  if (code >= 51 && code <= 67) return { condition: "Rainy", emoji: "🌧️", bgLight: "from-slate-200 via-gray-200 to-blue-100", bgDark: "from-slate-700 via-gray-700 to-blue-900" };
  if (code >= 71 && code <= 77) return { condition: "Snowy", emoji: "❄️", bgLight: "from-blue-50 via-slate-50 to-gray-50", bgDark: "from-blue-950 via-slate-900 to-gray-900" };
  if (code >= 80 && code <= 82) return { condition: "Showers", emoji: "🌦️", bgLight: "from-slate-100 via-blue-50 to-gray-100", bgDark: "from-slate-800 via-blue-950 to-gray-800" };
  if (code >= 85 && code <= 86) return { condition: "Snow Showers", emoji: "🌨️", bgLight: "from-blue-100 via-slate-100 to-gray-100", bgDark: "from-blue-900 via-slate-800 to-gray-800" };
  if (code >= 95 && code <= 99) return { condition: "Thunderstorm", emoji: "⛈️", bgLight: "from-slate-300 via-gray-300 to-zinc-300", bgDark: "from-slate-600 via-gray-600 to-zinc-600" };
  return { condition: "Unknown", emoji: "🌈", bgLight: "from-slate-100 via-gray-100 to-zinc-100", bgDark: "from-slate-800 via-gray-800 to-zinc-800" };
};

export default function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [bgGradient, setBgGradient] = useState("from-slate-100 via-gray-100 to-zinc-100");

  useEffect(() => {
    if (weather) {
      const weatherInfo = weatherCodeToCondition(weather.code);
      setBgGradient(darkMode ? weatherInfo.bgDark : weatherInfo.bgLight);
    } else {
      setBgGradient(darkMode ? "from-slate-900 via-gray-900 to-zinc-900" : "from-slate-100 via-gray-100 to-zinc-100");
    }
  }, [weather, darkMode]);

  const fetchCoordsForCity = async (cityName) => {
    const res = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
        cityName
      )}&count=1`
    );
    const data = await res.json();
    if (!data.results || data.results.length === 0) return null;
    const { latitude, longitude, name, country } = data.results[0];
    return { latitude, longitude, name, country };
  };

  const fetchLocationName = async (lat, lon) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=10`
      );
      const data = await res.json();
      
      if (data && data.address) {
        const city = data.address.city || data.address.town || data.address.village || data.address.county;
        const country = data.address.country;
        
        if (city && country) {
          return `${city}, ${country}`;
        } else if (city) {
          return city;
        } else if (data.display_name) {
          const parts = data.display_name.split(',');
          return parts.slice(0, 2).join(',').trim();
        }
      }
      return "Your Location";
    } catch {
      return "Your Location";
    }
  };

  const fetchWeatherByCoords = async (lat, lon) => {
    const res = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&hourly=relativehumidity_2m&timezone=auto`
    );
    const data = await res.json();
    return data;
  };

  const handleSearch = async () => {
    setError(null);
    setWeather(null);

    if (!city.trim()) {
      setError("Please enter a city name.");
      return;
    }

    setLoading(true);
    try {
      const coords = await fetchCoordsForCity(city.trim());
      if (!coords) {
        setError("City not found. Try adding country code (e.g., Paris, FR)");
        return;
      }

      const weatherData = await fetchWeatherByCoords(
        coords.latitude,
        coords.longitude
      );

      const cw = weatherData.current_weather;
      let humidity = null;
      if (weatherData.hourly?.time && weatherData.hourly?.relativehumidity_2m) {
        const idx = weatherData.hourly.time.findIndex((t) => t === cw.time);
        humidity =
          idx !== -1
            ? weatherData.hourly.relativehumidity_2m[idx]
            : weatherData.hourly.relativehumidity_2m[0];
      }

      setWeather({
        place: `${coords.name}, ${coords.country}`,
        temperature: cw.temperature,
        windspeed: cw.windspeed,
        winddir: cw.winddirection,
        code: cw.weathercode,
        time: cw.time,
        humidity,
      });
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleAutoDetect = () => {
    if (!navigator.geolocation) {
      setError("Geolocation not supported by your browser.");
      return;
    }

    setError(null);
    setWeather(null);
    setLoading(true);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;
          const weatherData = await fetchWeatherByCoords(latitude, longitude);
          const locationName = await fetchLocationName(latitude, longitude);

          const cw = weatherData.current_weather;
          let humidity = null;
          if (weatherData.hourly?.time && weatherData.hourly?.relativehumidity_2m) {
            const idx = weatherData.hourly.time.findIndex((t) => t === cw.time);
            humidity =
              idx !== -1
                ? weatherData.hourly.relativehumidity_2m[idx]
                : weatherData.hourly.relativehumidity_2m[0];
          }

          setWeather({
            place: locationName,
            temperature: cw.temperature,
            windspeed: cw.windspeed,
            winddir: cw.winddirection,
            code: cw.weathercode,
            time: cw.time,
            humidity,
          });
        } catch {
          setError("Unable to fetch weather for your location.");
        } finally {
          setLoading(false);
        }
      },
      () => {
        setError("Unable to access your location.");
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const weatherInfo = weather ? weatherCodeToCondition(weather.code) : null;

  return (
    <div className={`min-h-screen bg-gradient-to-br ${bgGradient} flex items-center justify-center p-4 sm:p-6 transition-all duration-700`}>
      <div className="w-full max-w-xl">
        {/* Header with Theme Toggle */}
        <div className="text-center mb-6 sm:mb-10 relative">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`absolute right-0 top-0 ${darkMode ? 'bg-slate-700 text-yellow-400' : 'bg-slate-200 text-slate-700'} p-2 sm:p-3 rounded-full hover:scale-110 transition-all shadow-lg text-xl sm:text-2xl`}
            title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {darkMode ? "☀️" : "🌙"}
          </button>

          <h1 className={`text-4xl sm:text-6xl font-light ${darkMode ? 'text-slate-100' : 'text-slate-800'} tracking-tight mb-2 font-serif`}>
            Weather Now
          </h1>
          <div className="flex justify-center gap-1 mb-3">
            <div className={`h-px w-8 sm:w-12 ${darkMode ? 'bg-slate-500' : 'bg-slate-400'}`}></div>
            <div className={`h-px w-8 sm:w-12 ${darkMode ? 'bg-slate-600' : 'bg-slate-300'}`}></div>
            <div className={`h-px w-8 sm:w-12 ${darkMode ? 'bg-slate-700' : 'bg-slate-200'}`}></div>
          </div>
          <p className={`${darkMode ? 'text-slate-400' : 'text-slate-600'} text-xs sm:text-sm font-light tracking-widest uppercase px-4`}>Real-time weather information</p>
        </div>

        {/* Main Card */}
        <div className={`${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'} rounded-2xl shadow-lg overflow-hidden border transition-colors duration-700`}>
          {/* Search Section */}
          <div className="p-4 sm:p-8">
            <div className="flex flex-col sm:flex-row gap-3 mb-4">
              <input
                className={`flex-1 ${darkMode ? 'bg-slate-700 border-slate-600 text-slate-100 placeholder-slate-400 focus:border-slate-500 focus:bg-slate-600' : 'bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400 focus:border-slate-400 focus:bg-white'} border rounded-lg px-4 py-3 focus:outline-none transition-all text-base`}
                placeholder="Enter city name..."
                value={city}
                onChange={(e) => setCity(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              <button
                onClick={handleSearch}
                className={`${darkMode ? 'bg-slate-600 hover:bg-slate-500 text-slate-100' : 'bg-slate-800 hover:bg-slate-700 text-white'} px-6 py-3 rounded-lg font-medium text-base transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed`}
                disabled={loading}
              >
                Search
              </button>
            </div>

            <button
              onClick={handleAutoDetect}
              className={`w-full ${darkMode ? 'bg-slate-700 hover:bg-slate-600 text-slate-200 border-slate-600' : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'} px-4 py-3 rounded-lg font-medium text-base transition-all border disabled:opacity-50 disabled:cursor-not-allowed`}
              disabled={loading}
            >
              📍 Use My Location
            </button>
          </div>

          {/* Divider */}
          <div className={`h-px ${darkMode ? 'bg-slate-700' : 'bg-slate-200'}`}></div>

          {/* Loading State */}
          {loading && (
            <div className="p-8 sm:p-16 text-center">
              <div className="inline-flex gap-2 mb-4">
                <div className={`w-2 h-2 ${darkMode ? 'bg-slate-400' : 'bg-slate-400'} rounded-full animate-bounce`}></div>
                <div className={`w-2 h-2 ${darkMode ? 'bg-slate-400' : 'bg-slate-400'} rounded-full animate-bounce`} style={{ animationDelay: "0.1s" }}></div>
                <div className={`w-2 h-2 ${darkMode ? 'bg-slate-400' : 'bg-slate-400'} rounded-full animate-bounce`} style={{ animationDelay: "0.2s" }}></div>
              </div>
              <p className={`${darkMode ? 'text-slate-400' : 'text-slate-600'} text-sm font-light`}>Loading weather data...</p>
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="p-4 sm:p-8">
              <div className={`${darkMode ? 'bg-red-900 border-red-700 text-red-200' : 'bg-red-50 border-red-200 text-red-700'} border px-4 py-3 rounded-lg text-sm`}>
                {error}
              </div>
            </div>
          )}

          {/* Weather Display */}
          {weather && !loading && (
            <div className="p-4 sm:p-8">
              {/* Main Weather Info */}
              <div className="text-center mb-6 sm:mb-8">
                <div className="text-6xl sm:text-8xl mb-4">{weatherInfo.emoji}</div>
                <h2 className={`text-2xl sm:text-3xl font-light ${darkMode ? 'text-slate-100' : 'text-slate-800'} mb-2 px-2`}>{weather.place}</h2>
                <p className={`${darkMode ? 'text-slate-400' : 'text-slate-500'} text-xs sm:text-sm font-light px-2`}>
                  {new Date(weather.time).toLocaleString('en-US', {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>

              {/* Temperature & Condition */}
              <div className={`${darkMode ? 'bg-slate-700 border-slate-600' : 'bg-slate-50 border-slate-200'} rounded-xl p-6 sm:p-8 text-center mb-4 sm:mb-6 border`}>
                <div className={`text-5xl sm:text-7xl font-extralight ${darkMode ? 'text-slate-100' : 'text-slate-800'} mb-2`}>
                  {Math.round(weather.temperature)}°
                </div>
                <div className={`text-lg sm:text-xl ${darkMode ? 'text-slate-300' : 'text-slate-600'} font-light tracking-wide`}>
                  {weatherInfo.condition}
                </div>
              </div>

              {/* Weather Details */}
              <div className="grid grid-cols-3 gap-2 sm:gap-4">
                <div className={`${darkMode ? 'bg-slate-700 border-slate-600' : 'bg-slate-50 border-slate-200'} rounded-xl p-3 sm:p-5 text-center border`}>
                  <div className="text-2xl sm:text-3xl mb-1 sm:mb-2 opacity-60">💨</div>
                  <div className={`${darkMode ? 'text-slate-400' : 'text-slate-500'} text-[10px] sm:text-xs font-light mb-1 sm:mb-2 uppercase tracking-wider`}>Wind</div>
                  <div className={`text-xl sm:text-2xl font-light ${darkMode ? 'text-slate-100' : 'text-slate-800'}`}>{weather.windspeed}</div>
                  <div className={`${darkMode ? 'text-slate-500' : 'text-slate-400'} text-[10px] sm:text-xs mt-1 font-light`}>km/h</div>
                </div>

                <div className={`${darkMode ? 'bg-slate-700 border-slate-600' : 'bg-slate-50 border-slate-200'} rounded-xl p-3 sm:p-5 text-center border`}>
                  <div className="text-2xl sm:text-3xl mb-1 sm:mb-2 opacity-60">💧</div>
                  <div className={`${darkMode ? 'text-slate-400' : 'text-slate-500'} text-[10px] sm:text-xs font-light mb-1 sm:mb-2 uppercase tracking-wider`}>Humidity</div>
                  <div className={`text-xl sm:text-2xl font-light ${darkMode ? 'text-slate-100' : 'text-slate-800'}`}>
                    {weather.humidity !== null ? weather.humidity : "—"}
                  </div>
                  <div className={`${darkMode ? 'text-slate-500' : 'text-slate-400'} text-[10px] sm:text-xs mt-1 font-light`}>%</div>
                </div>

                <div className={`${darkMode ? 'bg-slate-700 border-slate-600' : 'bg-slate-50 border-slate-200'} rounded-xl p-3 sm:p-5 text-center border`}>
                  <div className="text-2xl sm:text-3xl mb-1 sm:mb-2 opacity-60">🧭</div>
                  <div className={`${darkMode ? 'text-slate-400' : 'text-slate-500'} text-[10px] sm:text-xs font-light mb-1 sm:mb-2 uppercase tracking-wider`}>Direction</div>
                  <div className={`text-xl sm:text-2xl font-light ${darkMode ? 'text-slate-100' : 'text-slate-800'}`}>{weather.winddir}°</div>
                  <div className={`${darkMode ? 'text-slate-500' : 'text-slate-400'} text-[10px] sm:text-xs mt-1 font-light`}>degrees</div>
                </div>
              </div>
            </div>
          )}

          {/* Empty State */}
          {!weather && !loading && !error && (
            <div className="p-8 sm:p-16 text-center">
              <div className="text-5xl sm:text-7xl mb-4 sm:mb-6 opacity-40">🌤️</div>
              <h3 className={`text-lg sm:text-xl font-light ${darkMode ? 'text-slate-300' : 'text-slate-700'} mb-2 sm:mb-3 px-4`}>Ready to Check Weather?</h3>
              <p className={`${darkMode ? 'text-slate-400' : 'text-slate-500'} text-xs sm:text-sm font-light max-w-xs mx-auto leading-relaxed px-4`}>
                Enter a city name or use your location to view current weather conditions
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-6 sm:mt-8">
          <p className={`${darkMode ? 'text-slate-500' : 'text-slate-500'} text-xs font-light tracking-wide`}>Powered by Open-Meteo API</p>
        </div>
      </div>
    </div>
  );
}
