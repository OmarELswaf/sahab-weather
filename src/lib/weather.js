// Pure mapping helpers for Open-Meteo payloads. No network here, so the
// mapping is unit-testable (see test/weather.test.js).

export const WMO_CODES = {
  0: { label: 'Clear sky', icon: 'clear' },
  1: { label: 'Mainly clear', icon: 'clear' },
  2: { label: 'Partly cloudy', icon: 'partly' },
  3: { label: 'Overcast', icon: 'cloud' },
  45: { label: 'Fog', icon: 'fog' },
  48: { label: 'Icy fog', icon: 'fog' },
  51: { label: 'Light drizzle', icon: 'drizzle' },
  53: { label: 'Drizzle', icon: 'drizzle' },
  55: { label: 'Heavy drizzle', icon: 'drizzle' },
  56: { label: 'Freezing drizzle', icon: 'drizzle' },
  57: { label: 'Freezing drizzle', icon: 'drizzle' },
  61: { label: 'Light rain', icon: 'rain' },
  63: { label: 'Rain', icon: 'rain' },
  65: { label: 'Heavy rain', icon: 'rain' },
  66: { label: 'Freezing rain', icon: 'rain' },
  67: { label: 'Freezing rain', icon: 'rain' },
  71: { label: 'Light snow', icon: 'snow' },
  73: { label: 'Snow', icon: 'snow' },
  75: { label: 'Heavy snow', icon: 'snow' },
  77: { label: 'Snow grains', icon: 'snow' },
  80: { label: 'Light showers', icon: 'rain' },
  81: { label: 'Showers', icon: 'rain' },
  82: { label: 'Heavy showers', icon: 'rain' },
  85: { label: 'Snow showers', icon: 'snow' },
  86: { label: 'Snow showers', icon: 'snow' },
  95: { label: 'Thunderstorm', icon: 'storm' },
  96: { label: 'Storm with hail', icon: 'storm' },
  99: { label: 'Storm with hail', icon: 'storm' },
};

export function describeCode(code) {
  return WMO_CODES[code] || { label: 'Unknown', icon: 'cloud' };
}

export function unitLabels(units) {
  return units === 'f'
    ? { temp: '°F', wind: 'mph' }
    : { temp: '°C', wind: 'km/h' };
}

function hourLabel(iso) {
  return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function dayLabel(iso, index) {
  if (index === 0) return 'Today';
  return new Date(iso + 'T12:00:00').toLocaleDateString([], { weekday: 'short' });
}

// Map the raw Open-Meteo forecast payload to the view model.
export function mapForecast(json, units = 'c') {
  const u = unitLabels(units);
  const current = {
    temp: Math.round(json.current.temperature_2m),
    feels: Math.round(json.current.apparent_temperature),
    humidity: json.current.relative_humidity_2m,
    wind: Math.round(json.current.wind_speed_10m),
    isDay: json.current.is_day === 1,
    ...describeCode(json.current.weather_code),
  };

  // next 24 hourly points starting at the current hour
  const nowIso = json.current.time;
  const startIdx = Math.max(0, json.hourly.time.findIndex((t) => t >= nowIso));
  const hourly = json.hourly.time.slice(startIdx, startIdx + 24).map((t, i) => ({
    time: hourLabel(t),
    temp: Math.round(json.hourly.temperature_2m[startIdx + i]),
    rain: json.hourly.precipitation_probability
      ? json.hourly.precipitation_probability[startIdx + i]
      : null,
  }));

  const daily = json.daily.time.map((t, i) => ({
    day: dayLabel(t, i),
    min: Math.round(json.daily.temperature_2m_min[i]),
    max: Math.round(json.daily.temperature_2m_max[i]),
    rain: json.daily.precipitation_probability_max
      ? json.daily.precipitation_probability_max[i]
      : null,
    sunrise: hourLabel(json.daily.sunrise[i]),
    sunset: hourLabel(json.daily.sunset[i]),
    ...describeCode(json.daily.weather_code[i]),
  }));

  return { current, hourly, daily, units: u, timezone: json.timezone };
}
