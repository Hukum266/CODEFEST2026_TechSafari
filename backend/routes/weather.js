/**
 * GET /api/weather/:city
 * Fetches a 7-day weather forecast using the free Open-Meteo API.
 * Also derives an irrigation advisory from the forecast.
 *
 * Geocoding uses Open-Meteo's free geocoding API (no API key needed).
 */

const express = require('express');
const router = express.Router();

// Open-Meteo URLs (free, no key required)
const GEO_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const FORECAST_URL = 'https://api.open-meteo.com/v1/forecast';

// City coordinates for common Nepali cities (fast fallback)
const CITY_COORDS = {
  kathmandu:  { lat: 27.7172, lon: 85.3240 },
  pokhara:    { lat: 28.2096, lon: 83.9856 },
  biratnagar: { lat: 26.4525, lon: 87.2718 },
  butwal:     { lat: 27.7006, lon: 83.4532 },
  dang:       { lat: 28.0000, lon: 82.3333 },
  chitwan:    { lat: 27.5291, lon: 84.3542 },
  lalitpur:   { lat: 27.6644, lon: 85.3188 },
  bharatpur:  { lat: 27.6833, lon: 84.4333 },
  dhangadhi:  { lat: 28.6833, lon: 80.6000 },
  birgunj:    { lat: 27.0000, lon: 84.8667 },
};

router.get('/:city', async (req, res) => {
  const cityRaw = req.params.city.trim().toLowerCase();
  let lat, lon, resolvedCity;

  try {
    // Try known coords first (fastest)
    if (CITY_COORDS[cityRaw]) {
      ({ lat, lon } = CITY_COORDS[cityRaw]);
      resolvedCity = cityRaw.charAt(0).toUpperCase() + cityRaw.slice(1);
    } else {
      // Geocode via Open-Meteo
      const geoResp = await fetch(
        `${GEO_URL}?name=${encodeURIComponent(req.params.city)}&count=1&language=en&format=json`
      );
      const geoData = await geoResp.json();
      if (!geoData.results || geoData.results.length === 0) {
        return res.status(404).json({ error: `City "${req.params.city}" not found. Try a major city name.` });
      }
      lat = geoData.results[0].latitude;
      lon = geoData.results[0].longitude;
      resolvedCity = geoData.results[0].name;
    }

    // Fetch 7-day forecast
    const forecastResp = await fetch(
      `${FORECAST_URL}?latitude=${lat}&longitude=${lon}` +
      `&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,windspeed_10m_max,weathercode` +
      `&hourly=relativehumidity_2m,soil_moisture_0_to_7cm` +
      `&current_weather=true` +
      `&timezone=Asia%2FKathmandu` +
      `&forecast_days=7`
    );
    const forecast = await forecastResp.json();

    // Process daily data
    const daily = forecast.daily;
    const days = daily.time.map((date, i) => ({
      date,
      temp_max: daily.temperature_2m_max[i],
      temp_min: daily.temperature_2m_min[i],
      precipitation_mm: daily.precipitation_sum[i],
      rain_probability: daily.precipitation_probability_max[i],
      windspeed_max: daily.windspeed_10m_max[i],
      weather_code: daily.weathercode[i],
      condition: wmoCodeToCondition(daily.weathercode[i]),
    }));

    // Average humidity from hourly (today)
    const hourlyHumidity = forecast.hourly?.relativehumidity_2m?.slice(0, 24) || [];
    const avgHumidity = hourlyHumidity.length
      ? Math.round(hourlyHumidity.reduce((a, b) => a + b, 0) / hourlyHumidity.length)
      : null;

    // Soil moisture today
    const soilMoisture = forecast.hourly?.soil_moisture_0_to_7cm?.[12] ?? null;

    // Irrigation advisory from forecast
    const totalRainNext3Days = days.slice(0, 3).reduce((s, d) => s + (d.precipitation_mm || 0), 0);
    const irrigationAdvisory = buildIrrigationAdvisory(days, totalRainNext3Days, avgHumidity);

    // Disease risk hint from weather
    const diseaseRiskHint = buildDiseaseRiskHint(days, avgHumidity);

    return res.json({
      success: true,
      location: {
        city: resolvedCity,
        latitude: lat,
        longitude: lon,
      },
      current: forecast.current_weather || null,
      humidity_avg_today: avgHumidity,
      soil_moisture_today: soilMoisture ? Math.round(soilMoisture * 100) : null,
      forecast: days,
      irrigation_advisory: irrigationAdvisory,
      disease_risk_hint: diseaseRiskHint,
    });
  } catch (err) {
    console.error('[weather] Error:', err);
    return res.status(500).json({ error: 'Failed to fetch weather data. Please try again.' });
  }
});

// ── WMO Weather code → human condition ──────────────────────────────────────
function wmoCodeToCondition(code) {
  if (code === 0) return 'Clear sky';
  if (code <= 3) return 'Partly cloudy';
  if (code <= 9) return 'Overcast';
  if (code <= 29) return 'Fog';
  if (code <= 39) return 'Drizzle';
  if (code <= 49) return 'Freezing drizzle';
  if (code <= 59) return 'Rain';
  if (code <= 69) return 'Freezing rain';
  if (code <= 79) return 'Snow';
  if (code <= 84) return 'Rain showers';
  if (code <= 94) return 'Thunderstorm';
  return 'Heavy thunderstorm';
}

// ── Irrigation advisory from 7-day data ─────────────────────────────────────
function buildIrrigationAdvisory(days, totalRain3Days, humidity) {
  const today = days[0];
  const alerts = [];

  if (totalRain3Days > 20) {
    alerts.push({ level: 'pause', message: `${Math.round(totalRain3Days)}mm of rain expected in 3 days — pause all irrigation.` });
  } else if (totalRain3Days > 8) {
    alerts.push({ level: 'reduce', message: `${Math.round(totalRain3Days)}mm of rain expected — reduce irrigation by 50%.` });
  } else {
    alerts.push({ level: 'irrigate', message: 'Low rainfall expected — maintain regular irrigation schedule.' });
  }

  if (humidity && humidity > 80) {
    alerts.push({ level: 'warning', message: `High humidity (${humidity}%) increases disease risk — use drip irrigation only.` });
  }
  if (today.temp_max > 38) {
    alerts.push({ level: 'warning', message: `Extreme heat (${today.temp_max}°C) — irrigate in early morning or evening only.` });
  }

  return { alerts, total_rain_3_days_mm: Math.round(totalRain3Days) };
}

// ── Disease risk hint from weather ───────────────────────────────────────────
function buildDiseaseRiskHint(days, humidity) {
  const risks = [];
  const avgRain = days.slice(0, 5).reduce((s, d) => s + (d.precipitation_mm || 0), 0) / 5;
  const avgTemp = days.slice(0, 5).reduce((s, d) => s + (d.temp_max || 25), 0) / 5;

  if (humidity > 75 && avgTemp > 18 && avgTemp < 30) {
    risks.push({ disease: 'Powdery Mildew', risk: 'high', reason: 'Warm, humid conditions are ideal for powdery mildew.' });
  }
  if (avgRain > 5 && avgTemp > 20) {
    risks.push({ disease: 'Early Blight', risk: 'moderate', reason: 'Warm, wet weather promotes early blight in solanaceous crops.' });
  }
  if (avgRain > 8 && avgTemp < 22) {
    risks.push({ disease: 'Late Blight', risk: 'high', reason: 'Cool, rainy weather is prime late blight conditions.' });
  }

  return risks.length ? risks : [{ disease: 'None', risk: 'low', reason: 'Current weather conditions present low disease risk.' }];
}

module.exports = router;
