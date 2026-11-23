const PATHS = {
  clear: 'M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm0-15v2m0 16v2M4.9 4.9l1.4 1.4m11.4 11.4 1.4 1.4M2 12h2m16 0h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4',
  partly: 'M7 18a4 4 0 1 1 .6-7.97A5.5 5.5 0 0 1 18.3 12 3.5 3.5 0 0 1 17.5 19H7Z',
  cloud: 'M6.5 19a4.5 4.5 0 1 1 .42-8.98 6 6 0 0 1 11.58 1.49A4 4 0 0 1 18 19.5H6.5Z',
  fog: 'M4 15h16M6 18h12M8 12h8M6.5 9a4.5 4.5 0 0 1 8.7-1.6A3.5 3.5 0 0 1 18 10',
  drizzle: 'M8 15v2m4-3v2m4-3v2M6.5 12a4.5 4.5 0 1 1 .42-8.98 6 6 0 0 1 11.58 1.49A4 4 0 0 1 18 12.5',
  rain: 'M8 15l-1 3m5-3-1 3m5-3-1 3M6.5 12a4.5 4.5 0 1 1 .42-8.98 6 6 0 0 1 11.58 1.49A4 4 0 0 1 18 12.5',
  snow: 'M8 15.5h.01M12 17h.01M16 15.5h.01M9 19h.01M15 19h.01M6.5 12a4.5 4.5 0 1 1 .42-8.98 6 6 0 0 1 11.58 1.49A4 4 0 0 1 18 12.5',
  storm: 'M13 10 9 17h3l-1 4 4-7h-3l1-4ZM6.5 9a4.5 4.5 0 1 1 .42-8.98 6 6 0 0 1 11.58 1.49A4 4 0 0 1 18 9.5',
};

export default function WeatherIcon({ icon, isDay = true, className = 'w-6 h-6' }) {
  const d = PATHS[icon] || PATHS.cloud;
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden="true">
      <path d={d} />
      {icon === 'clear' && !isDay && <circle cx="12" cy="12" r="4" fill="currentColor" stroke="none" opacity="0.35" />}
    </svg>
  );
}
