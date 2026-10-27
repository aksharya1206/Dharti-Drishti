import React from 'react';
import {
  CloudSun,
  CloudRain,
  Wind,
  Droplets,
  AlertTriangle,
  Calendar,
  Sparkles,
  ArrowRight,
  Info,
  ShieldAlert
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';
import { useApp } from '../context/AppContext';
import { PageHeader } from '../components/common/PageHeader';

export const WeatherPage: React.FC = () => {
  const { weatherMap, selectedDistrict, setSelectedDistrict, tasks, setActivePage, runPlanEngine } = useApp();

  const current = weatherMap[selectedDistrict] || weatherMap['Sonipat'];

  // Tasks affected in this district
  const districtTasks = tasks.filter(t => t.farmName.toLowerCase().includes(selectedDistrict.toLowerCase()));
  const weatherAffectedTasks = districtTasks.filter(t => t.weatherRiskTag);

  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        title="Weather & Microclimate Intelligence"
        subtitle="Simulated agricultural meteorological feeds monitoring precipitation windows, spray drift risks, and evapotranspiration thresholds."
        badge="Forecast Engine"
        action={
          <div className="flex items-center gap-1.5 bg-agri-cream p-1 rounded-xl border border-agri-border">
            {Object.keys(weatherMap).map(district => (
              <button
                key={district}
                onClick={() => setSelectedDistrict(district)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${selectedDistrict === district
                    ? 'bg-forest-800 text-white shadow-xs'
                    : 'text-agri-muted hover:text-agri-charcoal'
                  }`}
              >
                {district} Node
              </button>
            ))}
          </div>
        }
      />

      {/* Demo Disclosure Banner */}
      <div className="p-3.5 rounded-xl bg-amber-50/80 border border-amber-200/90 text-xs text-amber-950 flex items-start gap-3">
        <Info className="w-4 h-4 text-agri-amber shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <span className="font-bold">Demonstration Weather Data Notice:</span>
          <p className="text-amber-900/90 leading-relaxed">
            Demo weather data — connect a weather API (e.g. OpenWeather or Indian Meteorological Department) for live telemetry. This demonstration simulates a 14:00 convective rain band in Sonipat to demonstrate weather-adaptive scheduling.
          </p>
        </div>
      </div>

      {/* Current Conditions Spotlight */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-agri-border p-5 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-agri-muted block mb-1">Current Temperature</span>
          <div className="flex items-baseline gap-2 mb-1">
            <span className="font-heading text-3xl font-black text-agri-charcoal">{current.temperature}°C</span>
            <span className="text-xs text-agri-muted">Feels like {current.feelsLike}°C</span>
          </div>
          <span className="text-xs font-semibold text-forest-700">{current.weatherCondition}</span>
        </div>

        <div className="bg-white rounded-2xl border border-agri-border p-5 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-agri-muted block mb-1">Precipitation Probability</span>
          <div className="flex items-baseline gap-2 mb-1">
            <span className={`font-heading text-3xl font-black ${current.rainProbability > 60 ? 'text-agri-red' : 'text-agri-charcoal'}`}>
              {current.rainProbability}%
            </span>
            <span className="text-xs text-agri-muted">Peak at 14:00</span>
          </div>
          <span className={`text-xs font-semibold ${current.rainProbability > 60 ? 'text-agri-red' : 'text-forest-600'}`}>
            {current.rainProbability > 60 ? 'Chemical Washout Warning' : 'Safe for Spraying'}
          </span>
        </div>

        <div className="bg-white rounded-2xl border border-agri-border p-5 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-agri-muted block mb-1">Wind & Drift Factor</span>
          <div className="flex items-baseline gap-2 mb-1">
            <span className="font-heading text-3xl font-black text-agri-charcoal">{current.windSpeed}</span>
            <span className="text-xs text-agri-muted">km/h Gusts</span>
          </div>
          <span className="text-xs font-semibold text-forest-700">
            {current.windSpeed > 20 ? 'Moderate Spray Drift Risk' : 'Acceptable Spray Drift'}
          </span>
        </div>

        <div className="bg-white rounded-2xl border border-agri-border p-5 shadow-xs">
          <span className="text-[10px] uppercase font-bold text-agri-muted block mb-1">Agronomic Risk Level</span>
          <div className="flex items-baseline gap-2 mb-1">
            <span className={`font-heading text-3xl font-black ${current.riskLevel === 'High' ? 'text-agri-red' : 'text-forest-800'}`}>
              {current.riskLevel}
            </span>
            <span className="text-xs text-agri-muted">{selectedDistrict} Plot</span>
          </div>
          <span className="text-xs text-agri-muted">Trigger for Schedule Review</span>
        </div>
      </div>

      {/* Hourly Forecast Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Hourly Precipitation & Rain Prob Chart */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-agri-border p-5 sm:p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-heading font-bold text-base text-agri-charcoal">
                Hourly Precipitation Probability & Temperature ({selectedDistrict})
              </h3>
              <p className="text-xs text-agri-muted">
                Evaluates safe operations windows for pesticide applications and field harvesting
              </p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={current.hourlyForecast} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="rainGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#C94C4C" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#C94C4C" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="tempGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2F6B4F" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#2F6B4F" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E9E2" vertical={false} />
                <XAxis dataKey="time" tick={{ fontSize: 11, fill: '#6B756D' }} />
                <YAxis tick={{ fontSize: 11, fill: '#6B756D' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #E5E9E2', fontSize: '11px' }}
                />
                <Area
                  type="monotone"
                  dataKey="rainProb"
                  name="Rain Probability (%)"
                  stroke="#C94C4C"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#rainGrad)"
                />
                <Area
                  type="monotone"
                  dataKey="temp"
                  name="Temperature (°C)"
                  stroke="#2F6B4F"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#tempGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-center gap-6 pt-3 border-t border-agri-border/60 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-agri-red" />
              <span className="text-agri-muted">Precipitation Risk (%)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-forest-600" />
              <span className="text-agri-muted">Temperature (°C)</span>
            </div>
          </div>
        </div>

        {/* 5-Day Extended Weather Horizon */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-agri-border p-5 sm:p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-heading font-bold text-base text-agri-charcoal mb-1">
              5-Day Agronomic Outlook
            </h3>
            <p className="text-xs text-agri-muted mb-4">
              Window planning for multi-day field operations
            </p>

            <div className="space-y-3">
              {current.forecastDays.map((f, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-2.5 rounded-xl border border-agri-border/70 bg-agri-cream/30 text-xs"
                >
                  <span className="font-bold text-agri-charcoal w-20">{f.day}</span>
                  <span className="text-agri-muted flex-1 text-center truncate px-2">{f.condition}</span>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-agri-charcoal font-semibold">{f.tempMax}° / {f.tempMin}°</span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${f.rainProb > 50 ? 'bg-red-50 text-agri-red' : 'bg-emerald-50 text-forest-700'
                        }`}
                    >
                      {f.rainProb}% Rain
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-agri-border/60 text-[11px] text-agri-muted">
            Dry window detected tomorrow from 07:00 to 12:00. Ideal for postponed foliar operations.
          </div>
        </div>
      </div>

      {/* Weather Impact on Operations Panel */}
      <div className="bg-white rounded-2xl border border-agri-border p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-agri-border mb-4">
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <ShieldAlert className="w-4 h-4 text-agri-amber" />
              <h3 className="font-heading font-bold text-base text-agri-charcoal">
                Operations Affected by Current Weather Front ({selectedDistrict})
              </h3>
            </div>
            <p className="text-xs text-agri-muted">
              Agent evaluates rain washout thresholds and proposes schedule adjustments
            </p>
          </div>

          <button
            onClick={runPlanEngine}
            className="px-4 py-2 rounded-xl bg-forest-800 hover:bg-forest-900 text-white text-xs font-bold flex items-center gap-1.5 transition-colors self-start sm:self-auto cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-forest-300" />
            <span>Reschedule Affected Operations</span>
          </button>
        </div>

        {weatherAffectedTasks.length > 0 ? (
          <div className="space-y-3">
            {weatherAffectedTasks.map(task => (
              <div
                key={task.id}
                className="p-4 rounded-xl border border-amber-200 bg-amber-50/40 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-sm text-agri-charcoal">{task.title}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-200 text-amber-900">
                      High Washout Risk
                    </span>
                  </div>
                  <p className="text-agri-charcoal/80 mb-1">
                    Scheduled window: <strong>{task.scheduledDate} {task.startTime} - {task.endTime}</strong> on {task.farmName}
                  </p>
                  <p className="text-agri-amber font-semibold">{task.weatherRiskTag}</p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => setActivePage('operations')}
                    className="px-3 py-1.5 rounded-lg bg-forest-800 hover:bg-forest-900 text-white font-semibold flex items-center gap-1 transition-colors"
                  >
                    <span>View in Operations Planner</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6 text-center text-xs text-agri-muted bg-forest-50/50 rounded-xl border border-forest-100">
            No planned field operations in {selectedDistrict} are currently blocked by adverse weather conditions.
          </div>
        )}
      </div>
    </div>
  );
};
