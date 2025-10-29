🌤️ Weather Now

Weather Now is a responsive web application that provides real-time weather information for any location.
Built with Vite, React, and Tailwind CSS, it fetches live weather data from the Open-Meteo API — no API key required.

https://5mvwfy-5173.csb.app/ -- use this link to see the live website

🚀 Features

✅ Search weather by city (Open-Meteo Geocoding → Forecast)
✅ Auto-detect location (using browser Geolocation API)
✅ Displays:

Temperature 🌡️

Wind Speed 💨

Humidity 💧

Weather Condition with emoji ☀️🌧️❄️
✅ Responsive, clean, and modern UI
✅ Dark/Light mode toggle
✅ Error handling and loading animations

🧭 APIs Used

Geocoding API:
https://geocoding-api.open-meteo.com/v1/search?name={city}

Forecast API:
https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&current_weather=true&hourly=relativehumidity_2m&timezone=auto

🧰 Run Locally

1. Clone or download the project

git clone https://github.com/your-username/weather-now.git
cd weather-now

2. Install dependencies

npm install

3. Start development server

npm run dev

4. Open in browser
   Usually runs at:
   👉 http://localhost:5173/
   or your sandbox URL (e.g. 5mvwfy-5173.csb.app)

5. Build for production

npm run build

6. Preview build

npm run preview

🌎 Deployment

You can easily deploy using:

CodeSandbox

StackBlitz

GitHub Pages, Netlify, or Vercel

If deploying from a repo, configure hosting to run:

npm run build

and serve the dist/ folder.

💡 Future Enhancements

🌫️ Air Quality Index (AQI)

Display PM2.5, PM10, and overall air quality rating.

🧥 Smart Clothing Suggestions

Recommend what to wear based on temperature and conditions (e.g., “Carry a jacket, it’s cold today”).

📈 24-Hour Forecast

Show upcoming temperature and precipitation trends in charts.

🌍 Multi-language Support

Allow users to view weather info in their preferred language.

🔔 Notifications

Enable alerts for sudden weather changes or extreme conditions.

⚡ Tech Stack

Frontend: React + Vite

Styling: Tailwind CSS

API: Open-Meteo

Icons & Emojis: Native + Custom logics
