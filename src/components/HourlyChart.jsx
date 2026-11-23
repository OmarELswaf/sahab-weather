import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

export default function HourlyChart({ hourly, units }) {
  return (
    <section className="fade-in bg-panel border border-line rounded-2xl p-5 sm:p-6">
      <h3 className="text-sm font-semibold text-slate-200 mb-4">Next 24 hours</h3>
      <div className="h-52">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={hourly} margin={{ top: 5, right: 8, left: -18, bottom: 0 }}>
            <defs>
              <linearGradient id="tempGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#fbbf24" stopOpacity={0.45} />
                <stop offset="100%" stopColor="#fbbf24" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="#243352" strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="time" tick={{ fill: '#64748b', fontSize: 11 }} tickLine={false} axisLine={false} interval={3} />
            <YAxis tick={{ fill: '#64748b', fontSize: 11 }} tickLine={false} axisLine={false} unit={units.temp} width={52} />
            <Tooltip
              contentStyle={{ background: '#131c31', border: '1px solid #243352', borderRadius: 12, fontSize: 12 }}
              labelStyle={{ color: '#94a3b8' }}
              formatter={(v, name) => (name === 'temp' ? [`${v}${units.temp}`, 'Temp'] : [`${v}%`, 'Rain chance'])}
            />
            <Area type="monotone" dataKey="temp" stroke="#fbbf24" strokeWidth={2.2} fill="url(#tempGrad)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
