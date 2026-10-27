import React from 'react';
import { CloudRain, Wind, Droplets, AlertTriangle, ArrowRight, Sun, ExternalLink } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const WeatherSummaryPanel: React.FC = () => {
  const { weatherMap, selectedDistrict, setSelectedDistrict, setActivePage } = useApp();

  const currentWeather = weatherMap[selectedDistrict] || weatherMap['Sonipat'];

  return (
    <div className="bg-white rounded-2xl border border-agri-border p-5 sm:p-6 shadow-sm">
      {/* Header with district selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <h3 className="font-heading font-bold text-base text-agri-charcoal">
              Microclimate & Risk Summary
            </h3>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 border border-stone-200">
              Demo Weather Model
            </span>
          </div>
          <p className="text-xs text-agri-muted">
            Monitored atmospheric thresholds for Haryana agricultural plots
          </p>
        </div>

        {/* District Switcher Tabs */}
        <div className="flex items-center gap-1 bg-agri-cream p-1 rounded-lg border border-agri-border self-start sm:self-auto">
          {Object.keys(weatherMap).map(district => (
            <button
              key={district}
              onClick={() => setSelectedDistrict(district)}
              className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                selectedDistrict === district
                  ? 'bg-white text-forest-800 shadow-xs border border-agri-border/60'
                  : 'text-agri-muted hover:text-agri-charcoal'
              }`}
            >
              {district}
            </button>
          ))}
        </div>
      </div>

      {/* Main Weather Card Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
        <div className="p-3.5 rounded-xl bg-agri-cream/50 border border-agri-border">
          <span className="text-[10px] uppercase font-bold text-agri-muted block mb-1">
            Current Temp
          </span>
          <div className="flex items-baseline gap-1">
            <span className="font-heading text-2xl font-black text-agri-charcoal">
              {currentWeather.temperature}°C
            </span>
            <span className="text-xs text-agri-muted">({currentWeather.weatherCondition})</span>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-agri-cream/50 border border-agri-border">
          <span className="text-[10px] uppercase font-bold text-agri-muted block mb-1">
            Precipitation Risk
          </span>
          <div className="flex items-center gap-1.5">
            <CloudRain className="w-4 h-4 text-blue-500" />
            <span
              className={`font-heading text-2xl font-black ${
                currentWeather.rainProbability > 60 ? 'text-agri-red' : 'text-agri-charcoal'
              }`}
            >
              {currentWeather.rainProbability}%
            </span>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-agri-cream/50 border border-agri-border">
          <span className="text-[10px] uppercase font-bold text-agri-muted block mb-1">
            Wind Velocity
          </span>
          <div className="flex items-center gap-1.5">
            <Wind className="w-4 h-4 text-forest-600" />
            <span className="font-heading text-2xl font-black text-agri-charcoal">
              {currentWeather.windSpeed}
            </span>
            <span className="text-xs text-agri-muted">km/h</span>
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-agri-cream/50 border border-agri-border">
          <span className="text-[10px] uppercase font-bold text-agri-muted block mb-1">
            Relative Humidity
          </span>
          <div className="flex items-center gap-1.5">
            <Droplets className="w-4 h-4 text-teal-600" />
            <span className="font-heading text-2xl font-black text-agri-charcoal">
              {currentWeather.humidity}%
            </span>
          </div>
        </div>
      </div>

      {/* Operational Impact Notice */}
      <div
        className={`p-3.5 rounded-xl border flex items-start gap-3 mb-3 ${
          currentWeather.riskLevel === 'High'
            ? 'bg-red-50/70 border-red-200 text-red-950'
            : 'bg-emerald-50/60 border-emerald-200 text-forest-900'
        }`}
      >
        <AlertTriangle
          className={`w-4 h-4 shrink-0 mt-0.5 ${
            currentWeather.riskLevel === 'High' ? 'text-agri-red' : 'text-forest-600'
          }`}
        />
        <div className="flex-1 text-xs">
          <div className="font-bold flex items-center justify-between mb-0.5">
            <span>Operational Advisory: {currentWeather.district}</span>
            <span className="uppercase text-[10px] tracking-wider font-extrabold">
              Risk Level: {currentWeather.riskLevel}
            </span>
          </div>
          <p className="text-agri-charcoal/80 leading-relaxed">{currentWeather.riskDescription}</p>
        </div>
      </div>

      {/* Footer navigation */}
      <div className="flex items-center justify-between pt-2 border-t border-agri-border/60 text-xs">
        <span className="text-[11px] text-agri-muted">
          Connect OpenWeather or IMD API for real-time station telemetry.
        </span>
        <button
          onClick={() => setActivePage('weather')}
          className="text-forest-700 hover:text-forest-900 font-semibold flex items-center gap-1 cursor-pointer"
        >
          <span>View Detailed Forecast & Chart</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

