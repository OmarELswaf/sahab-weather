import { useCallback, useEffect, useState } from 'react';
import { fetchWeather } from './api';
import SearchBar from './components/SearchBar';
import CurrentCard from './components/CurrentCard';
import HourlyChart from './components/HourlyChart';
import DailyList from './components/DailyList';

const DEFAULT_PLACE = { name: 'Cairo', region: 'Egypt', lat: 30.0444, lon: 31.2357 };

export default function App() {
  const [place, setPlace] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('sahab-place')) || DEFAULT_PLACE;
    } catch {
      return DEFAULT_PLACE;
    }
  });
  const [units, setUnits] = useState(() => localStorage.getItem('sahab-units') || 'c');
  const [wx, setWx] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [locating, setLocating] = useState(false);

  const load = useCallback(async (p, u) => {
    setLoading(true);
    setError(null);
    try {
      setWx(await fetchWeather(p.lat, p.lon, u));
    } catch {
      setError('Could not load the forecast. Check your connection and try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load(place, units);
  }, [place, units, load]);

  const selectPlace = (city) => {
    setPlace(city);
    localStorage.setItem('sahab-place', JSON.stringify(city));
  };

  const toggleUnits = () => {
    const next = units === 'c' ? 'f' : 'c';
    setUnits(next);
    localStorage.setItem('sahab-units', next);
  };

  const locate = () => {
    if (!navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const p = {
          name: 'My location',
          region: `${pos.coords.latitude.toFixed(2)}, ${pos.coords.longitude.toFixed(2)}`,
          lat: pos.coords.latitude,
          lon: pos.coords.longitude,
        };
        setLocating(false);
        selectPlace(p);
      },
      () => setLocating(false),
      { timeout: 8000 }
    );
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-line bg-panel/70 backdrop-blur px-4 sm:px-6 py-3">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-accent/20 text-accent grid place-items-center font-bold">S</div>
            <div>
              <h1 className="font-semibold text-slate-100 leading-tight">Sahab</h1>
              <p className="text-xs text-slate-500">Weather dashboard - Open-Meteo</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={toggleUnits}
              className="text-xs border border-line rounded-lg px-3 py-1.5 text-slate-300 hover:border-accent hover:text-accent transition-colors"
            >
              {units === 'c' ? '°C → °F' : '°F → °C'}
            </button>
            <a
              href="https://github.com/OmarELswaf/sahab-weather"
              target="_blank"
              rel="noreferrer"
              className="text-xs text-slate-400 hover:text-accent border border-line rounded-lg px-3 py-1.5 transition-colors"
            >
              Source on GitHub
            </a>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 py-6 space-y-5">
        <SearchBar onSelect={selectPlace} onLocate={locate} locating={locating} />

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-300 text-sm rounded-xl px-4 py-3">{error}</div>
        )}

        {loading && !wx && (
          <div className="grid place-items-center py-24 text-slate-500 text-sm">Loading the forecast...</div>
        )}

        {wx && (
          <>
            <CurrentCard place={place} wx={wx} />
            <HourlyChart hourly={wx.hourly} units={wx.units} />
            <DailyList daily={wx.daily} units={wx.units} />
          </>
        )}
      </main>

      <footer className="border-t border-line px-4 sm:px-6 py-4">
        <p className="max-w-4xl mx-auto text-xs text-slate-600">
          Live data from the free Open-Meteo API (no key required). Built with React, Vite, Tailwind and Recharts.
        </p>
      </footer>
    </div>
  );
}
