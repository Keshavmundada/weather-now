<<<<<<< HEAD
Weather Now
===========

Simple React + Tailwind weather app using Open-Meteo (no API key).

Features:
- Search weather by city (Open-Meteo geocoding -> forecast)
- Auto-detect location (browser geolocation)
- Shows temperature, wind speed, humidity, and a friendly weather condition
- Responsive, simple UI, and error handling

Run locally:
1. Install dependencies:
   npm install

2. Start dev server:
   npm run dev

3. Open the URL printed by Vite (usually http://localhost:5173).

Build:
  npm run build
Preview production build:
  npm run preview

Deploy:
- You can drop this project into CodeSandbox (Import from GitHub or upload) or StackBlitz.
- If deploying from a repo, configure the hosting to run `npm run build` and serve the `dist` folder.

Notes:
- Uses Open-Meteo APIs:
  - Geocoding: https://geocoding-api.open-meteo.com/v1/search?name={city}
  - Forecast: https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&current_weather=true&hourly=relativehumidity_2m&timezone=auto
=======
# weather-now4
Weather Now 🌤️  Weather Now is a responsive web application that provides real-time weather information for any location. Built with Vite, React, and Tailwind CSS, it fetches live weather data from a public API and displays it in a clean, user-friendly interface.
>>>>>>> 0a2b95af1af6f1a6ee3a8223590a69b5f87d0730
