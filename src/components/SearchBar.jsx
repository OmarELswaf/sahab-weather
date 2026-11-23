import { useEffect, useRef, useState } from 'react';
import { searchCities } from '../api';

export default function SearchBar({ onSelect, onLocate, locating }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const boxRef = useRef(null);

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      setOpen(false);
      return undefined;
    }
    const ctrl = new AbortController();
    setBusy(true);
    const t = setTimeout(async () => {
      try {
        const cities = await searchCities(query.trim(), ctrl.signal);
        setResults(cities);
        setOpen(true);
      } catch {
        /* aborted or offline */
      } finally {
        setBusy(false);
      }
    }, 300);
    return () => {
      clearTimeout(t);
      ctrl.abort();
    };
  }, [query]);

  useEffect(() => {
    const close = (e) => {
      if (boxRef.current && !boxRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('click', close);
    return () => document.removeEventListener('click', close);
  }, []);

  const pick = (city) => {
    setQuery(`${city.name}`);
    setOpen(false);
    onSelect(city);
  };

  return (
    <div className="flex gap-2 w-full max-w-xl">
      <div className="relative flex-1" ref={boxRef}>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search a city - Cairo, Dubai, London..."
          className="w-full bg-panel border border-line rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 outline-none focus:border-accent transition-colors"
        />
        {busy && <span className="absolute right-3 top-3 text-xs text-slate-500">...</span>}
        {open && results.length > 0 && (
          <ul className="absolute z-20 mt-2 w-full bg-panel border border-line rounded-xl overflow-hidden shadow-2xl">
            {results.map((c) => (
              <li key={c.id}>
                <button
                  onClick={() => pick(c)}
                  className="w-full text-left px-4 py-2.5 text-sm hover:bg-ink/60 transition-colors"
                >
                  <span className="text-slate-100">{c.name}</span>
                  <span className="text-slate-500 text-xs ml-2">{c.region}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
      <button
        onClick={onLocate}
        disabled={locating}
        title="Use my location"
        className="shrink-0 bg-panel border border-line rounded-xl px-3.5 text-slate-300 hover:border-accent hover:text-accent transition-colors disabled:opacity-40"
      >
        {locating ? '...' : (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="w-5 h-5">
            <circle cx="12" cy="12" r="3" />
            <path d="M12 2v3m0 14v3M2 12h3m14 0h3" strokeLinecap="round" />
            <circle cx="12" cy="12" r="8" />
          </svg>
        )}
      </button>
    </div>
  );
}
