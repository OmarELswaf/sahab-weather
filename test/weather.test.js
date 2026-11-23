import { test } from 'node:test';
import assert from 'node:assert';
import { describeCode, unitLabels, mapForecast } from '../src/lib/weather.js';

test('describeCode maps known WMO codes', () => {
  assert.equal(describeCode(0).label, 'Clear sky');
  assert.equal(describeCode(61).label, 'Light rain');
  assert.equal(describeCode(95).icon, 'storm');
  assert.equal(describeCode(3).label, 'Overcast');
});

test('describeCode falls back for unknown codes', () => {
  const unknown = describeCode(4242);
  assert.equal(unknown.label, 'Unknown');
  assert.equal(unknown.icon, 'cloud');
});

test('unitLabels switches units', () => {
  assert.deepEqual(unitLabels('c'), { temp: '°C', wind: 'km/h' });
  assert.deepEqual(unitLabels('f'), { temp: '°F', wind: 'mph' });
});

const fixture = () => ({
  timezone: 'Africa/Cairo',
  current: {
    time: '2026-11-23T11:00',
    temperature_2m: 24.4,
    apparent_temperature: 25.6,
    relative_humidity_2m: 41,
    is_day: 1,
    weather_code: 2,
    wind_speed_10m: 13.6,
  },
  hourly: {
    time: ['2026-11-23T09:00', '2026-11-23T10:00', '2026-11-23T11:00', '2026-11-23T12:00'],
    temperature_2m: [20, 22, 24, 26],
    precipitation_probability: [0, 5, 10, 20],
  },
  daily: {
    time: ['2026-11-23', '2026-11-24'],
    weather_code: [0, 61],
    temperature_2m_max: [28.4, 25.1],
    temperature_2m_min: [17.2, 16.8],
    sunrise: ['2026-11-23T06:20', '2026-11-24T06:21'],
    sunset: ['2026-11-23T17:02', '2026-11-24T17:01'],
    precipitation_probability_max: [0, 60],
  },
});

test('mapForecast rounds and maps current conditions', () => {
  const wx = mapForecast(fixture(), 'c');
  assert.equal(wx.current.temp, 24);
  assert.equal(wx.current.feels, 26);
  assert.equal(wx.current.wind, 14);
  assert.equal(wx.current.label, 'Partly cloudy');
  assert.equal(wx.current.isDay, true);
  assert.equal(wx.units.temp, '°C');
});

test('mapForecast slices hourly from the current hour', () => {
  const wx = mapForecast(fixture(), 'c');
  assert.equal(wx.hourly[0].temp, 24); // starts at 11:00, not 09:00
  assert.equal(wx.hourly[1].rain, 20);
});

test('mapForecast builds daily entries with labels', () => {
  const wx = mapForecast(fixture(), 'c');
  assert.equal(wx.daily.length, 2);
  assert.equal(wx.daily[0].day, 'Today');
  assert.equal(wx.daily[0].max, 28);
  assert.equal(wx.daily[0].min, 17);
  assert.equal(wx.daily[1].label, 'Light rain');
  assert.equal(wx.daily[1].rain, 60);
});

test('mapForecast tolerates missing precipitation arrays', () => {
  const f = fixture();
  delete f.hourly.precipitation_probability;
  delete f.daily.precipitation_probability_max;
  const wx = mapForecast(f, 'f');
  assert.equal(wx.hourly[0].rain, null);
  assert.equal(wx.daily[0].rain, null);
  assert.equal(wx.units.temp, '°F');
});
