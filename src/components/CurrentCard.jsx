import WeatherIcon from './WeatherIcon';

export default function CurrentCard({ place, wx }) {
  const { current, units } = wx;
  return (
    <section className="fade-in bg-gradient-to-br from-panel to-ink border border-line rounded-2xl p-6 sm:p-8">
      <div className="flex flex-wrap items-start justify-between gap-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-semibold text-slate-100">{place.name}</h2>
          <p className="text-sm text-slate-500">{place.region}</p>
          <div className="flex items-end gap-2 mt-4">
            <span className="text-6xl sm:text-7xl font-bold text-slate-50 leading-none">{current.temp}</span>
            <span className="text-2xl text-accent mb-1">{units.temp}</span>
          </div>
          <p className="text-slate-300 mt-2">{current.label}</p>
        </div>
        <WeatherIcon icon={current.icon} isDay={current.isDay} className="w-20 h-20 sm:w-24 sm:h-24 text-accent" />
      </div>
      <div className="grid grid-cols-3 gap-3 mt-6">
        <Stat label="Feels like" value={`${current.feels}${units.temp}`} />
        <Stat label="Humidity" value={`${current.humidity}%`} />
        <Stat label="Wind" value={`${current.wind} ${units.wind}`} />
      </div>
    </section>
  );
}

function Stat({ label, value }) {
  return (
    <div className="bg-ink/50 border border-line rounded-xl px-4 py-3">
      <p className="text-xs text-slate-500">{label}</p>
      <p className="text-sm font-semibold text-slate-100 mt-0.5">{value}</p>
    </div>
  );
}
