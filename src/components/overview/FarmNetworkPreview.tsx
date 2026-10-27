import React from 'react';
import { MapPin, Sprout, Layers, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { HealthStatusBadge, OperationalStatusBadge } from '../common/PriorityBadge';
import { Farm } from '../../types';

interface FarmNetworkPreviewProps {
  onSelectFarm?: (farmId: string) => void;
}

export const FarmNetworkPreview: React.FC<FarmNetworkPreviewProps> = ({ onSelectFarm }) => {
  const { farms, tasks, setActivePage, setSelectedFarmId } = useApp();

  const handleFarmClick = (farm: Farm) => {
    setSelectedFarmId(farm.id);
    if (onSelectFarm) {
      onSelectFarm(farm.id);
    } else {
      setActivePage('farm-network');
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-agri-border p-5 sm:p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-agri-border mb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-heading font-bold text-base text-agri-charcoal">
              Connected Farm Network Plots
            </h3>
            <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-forest-100 text-forest-800">
              3 Active Plots
            </span>
          </div>
          <p className="text-xs text-agri-muted">
            Illustrative sample agricultural plots across the Haryana agrarian corridor
          </p>
        </div>

        <button
          onClick={() => setActivePage('farm-network')}
          className="text-xs text-forest-700 hover:text-forest-900 font-semibold flex items-center gap-1 self-start sm:self-auto cursor-pointer"
        >
          <span>Manage Network</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Grid of Farm Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {farms.map(farm => {
          const farmTasks = tasks.filter(t => t.farmId === farm.id);
          const pendingCount = farmTasks.filter(t => t.status !== 'Completed').length;
          const hasConflict = farmTasks.some(t => t.hasConflict);

          return (
            <div
              key={farm.id}
              onClick={() => handleFarmClick(farm)}
              className="rounded-xl border border-agri-border p-4.5 bg-agri-cream/30 hover:bg-white hover:border-forest-400 hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="text-[10px] font-bold text-forest-800 uppercase px-2 py-0.5 rounded bg-forest-100">
                    {farm.cropType}
                  </span>
                  <HealthStatusBadge status={farm.healthStatus} />
                </div>

                <h4 className="font-heading font-bold text-sm sm:text-base text-agri-charcoal group-hover:text-forest-800 transition-colors mb-1">
                  {farm.name}
                </h4>

                <div className="flex items-center gap-1.5 text-xs text-agri-muted mb-3">
                  <MapPin className="w-3.5 h-3.5 text-forest-700 shrink-0" />
                  <span className="truncate">{farm.location}</span>
                </div>

                {/* Key Attributes */}
                <div className="grid grid-cols-2 gap-2 text-xs py-2.5 border-y border-agri-border/60 mb-3 bg-white/60 rounded-lg px-2.5">
                  <div>
                    <span className="text-[10px] text-agri-muted block uppercase font-medium">Area</span>
                    <span className="font-bold text-agri-charcoal">{farm.areaAcres} Acres</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-agri-muted block uppercase font-medium">Irrigation</span>
                    <span className="font-semibold text-agri-charcoal truncate block">{farm.irrigationType}</span>
                  </div>
                </div>
              </div>

              <div>
                {/* Pending Tasks & Conflict Status */}
                <div className="flex items-center justify-between text-xs mb-3">
                  <span className="text-agri-muted">
                    Pending Tasks: <strong className="text-agri-charcoal">{pendingCount}</strong>
                  </span>
                  <OperationalStatusBadge status={farm.operationalStatus} />
                </div>

                {hasConflict && (
                  <div className="mb-2 text-[10px] text-agri-red font-bold flex items-center gap-1 px-2 py-1 rounded bg-red-50 border border-red-200">
                    <AlertCircle className="w-3 h-3 shrink-0" />
                    <span>Shared Equipment Contention</span>
                  </div>
                )}

                <div className="pt-2 border-t border-agri-border/60 flex items-center justify-between text-[11px] text-forest-700 font-semibold group-hover:translate-x-0.5 transition-transform">
                  <span>View Farm Operations</span>
                  <ArrowRight className="w-3 h-3" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 pt-3 border-t border-agri-border/60 text-[11px] text-agri-muted flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <span>* Illustrative demonstration dataset. Not real registered farms.</span>
        <span className="text-forest-700 font-medium">Spatial plots synchronized with operations engine</span>
      </div>
    </div>
  );
};

