import { mapForecast } from './lib/weather';

const GEO_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const WX_URL = 'https://api.open-meteo.com/v1/forecast';

export async function searchCities(name, signal) {
  const res = await fetch(
    `${GEO_URL}?name=${encodeURIComponent(name)}&count=6&language=en&format=json`,
    { signal }
  );
  if (!res.ok) throw new Error('geocoding failed');
  const json = await res.json();
  return (json.results || []).map((r) => ({
    id: r.id,
    name: r.name,
    region: [r.admin1, r.country].filter(Boolean).join(', '),
    lat: r.latitude,
    lon: r.longitude,
  }));
}

export async function fetchWeather(lat, lon, units = 'c') {
  const params = new URLSearchParams({
    latitude: lat,
    longitude: lon,
    current: 'temperature_2m,relative_humidity_2m,apparent_temperature,is_day,weather_code,wind_speed_10m',
    hourly: 'temperature_2m,precipitation_probability,weather_code',
    daily: 'weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset,precipitation_probability_max',
    timezone: 'auto',
    forecast_days: '7',
    temperature_unit: units === 'f' ? 'fahrenheit' : 'celsius',
    wind_speed_unit: units === 'f' ? 'mph' : 'kmh',
  });
  const res = await fetch(`${WX_URL}?${params}`);
  if (!res.ok) throw new Error('forecast failed');
  return mapForecast(await res.json(), units);
}
