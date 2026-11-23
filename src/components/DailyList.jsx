import WeatherIcon from './WeatherIcon';

export default function DailyList({ daily, units }) {
  const weekMin = Math.min(...daily.map((d) => d.min));
  const weekMax = Math.max(...daily.map((d) => d.max));
  const span = Math.max(1, weekMax - weekMin);

  return (
    <section className="fade-in bg-panel border border-line rounded-2xl p-5 sm:p-6">
      <h3 className="text-sm font-semibold text-slate-200 mb-3">7-day forecast</h3>
      <ul className="divide-y divide-line/60">
        {daily.map((d) => {
          const left = ((d.min - weekMin) / span) * 100;
          const width = Math.max(6, ((d.max - d.min) / span) * 100);
          return (
            <li key={d.day} className="py-3 flex items-center gap-3 sm:gap-4">
              <span className="w-12 text-sm text-slate-300">{d.day}</span>
              <WeatherIcon icon={d.icon} className="w-5 h-5 text-accent shrink-0" />
              {d.rain != null && d.rain > 5 ? (
                <span className="text-xs text-sky-400 w-9">{d.rain}%</span>
              ) : (
                <span className="w-9" />
              )}
              <span className="text-sm text-slate-500 w-8 text-right">{d.min}°</span>
              <div className="flex-1 h-1.5 rounded-full bg-ink relative overflow-hidden">
                <div
                  className="absolute h-full rounded-full bg-gradient-to-r from-amber-500/70 to-accent"
                  style={{ left: `${left}%`, width: `${width}%` }}
                />
              </div>
              <span className="text-sm text-slate-100 w-8 text-right font-medium">{d.max}°</span>
            </li>
          );
        })}
      </ul>
      <p className="text-xs text-slate-600 mt-3">Sunrise {daily[0].sunrise} - sunset {daily[0].sunset} today. Temps in {units.temp}.</p>
    </section>
  );
}
