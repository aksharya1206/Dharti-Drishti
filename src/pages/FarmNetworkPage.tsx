import React, { useState } from 'react';
import {
  Sprout,
  Plus,
  Search,
  Filter,
  Grid,
  List,
  MapPin,
  Calendar,
  Layers,
  Wrench,
  CheckCircle2,
  X,
  Droplet,
  ChevronRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PageHeader } from '../components/common/PageHeader';
import { HealthStatusBadge, OperationalStatusBadge } from '../components/common/PriorityBadge';
import { Farm, FarmHealthStatus, FarmOperationalStatus } from '../types';

export const FarmNetworkPage: React.FC = () => {
  const { farms, tasks, resources, addFarm, selectedFarmId, setSelectedFarmId, setActivePage } = useApp();

  const [search, setSearch] = useState('');
  const [cropFilter, setCropFilter] = useState('All');
  const [healthFilter, setHealthFilter] = useState('All');
  const [opFilter, setOpFilter] = useState('All');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Add Farm Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newFarmName, setNewFarmName] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [newDistrict, setNewDistrict] = useState('Sonipat');
  const [newArea, setNewArea] = useState<number>(10);
  const [newCropType, setNewCropType] = useState('Wheat');
  const [newVariety, setNewVariety] = useState('');
  const [newPlantingDate, setNewPlantingDate] = useState('2026-11-01');
  const [newIrrigation, setNewIrrigation] = useState<'Drip' | 'Canal / Flood' | 'Sprinkler' | 'Borewell'>('Borewell');
  const [newSoilType, setNewSoilType] = useState('Alluvial Loam');
  const [newNotes, setNewNotes] = useState('');
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const filteredFarms = farms.filter(f => {
    const matchesSearch =
      f.name.toLowerCase().includes(search.toLowerCase()) ||
      f.location.toLowerCase().includes(search.toLowerCase()) ||
      f.district.toLowerCase().includes(search.toLowerCase());
    const matchesCrop = cropFilter === 'All' || f.cropType === cropFilter;
    const matchesHealth = healthFilter === 'All' || f.healthStatus === healthFilter;
    const matchesOp = opFilter === 'All' || f.operationalStatus === opFilter;
    return matchesSearch && matchesCrop && matchesHealth && matchesOp;
  });

  const selectedFarm = farms.find(f => f.id === selectedFarmId);
  const selectedFarmTasks = selectedFarm ? tasks.filter(t => t.farmId === selectedFarm.id) : [];

  const handleAddFarm = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!newFarmName.trim()) errs.name = 'Farm name is required.';
    if (!newLocation.trim()) errs.location = 'Location details required.';
    if (!newArea || newArea <= 0) errs.area = 'Enter valid acreage (> 0).';
    if (Object.keys(errs).length > 0) {
      setFormErrors(errs);
      return;
    }

    addFarm({
      name: newFarmName,
      location: newLocation,
      district: newDistrict,
      state: 'Haryana',
      areaAcres: Number(newArea),
      cropType: newCropType,
      variety: newVariety || 'Standard Hybrid',
      healthStatus: 'Healthy',
      operationalStatus: 'Active',
      plantingDate: newPlantingDate,
      irrigationType: newIrrigation,
      soilType: newSoilType,
      notes: newNotes,
    });

    setIsAddModalOpen(false);
    // Reset form
    setNewFarmName('');
    setNewLocation('');
    setNewArea(10);
    setFormErrors({});
  };

  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        title="Farm Network Plots"
        subtitle="Coordinate agricultural plots, monitor spatial crop health, and balance shared equipment across your network."
        badge={`${farms.length} Haryana Plots Enrolled`}
        action={
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-forest-800 hover:bg-forest-900 text-white text-xs font-bold flex items-center gap-2 shadow-sm transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4 text-forest-300" />
            <span>Enroll New Farm Plot</span>
          </button>
        }
      />

      {/* Filter and Search Controls */}
      <div className="bg-white rounded-2xl border border-agri-border p-4 shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-agri-muted absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by farm name, location, or district..."
              className="w-full pl-9 pr-3.5 py-2 rounded-lg border border-agri-border text-xs text-agri-charcoal placeholder-agri-muted focus:outline-none focus:ring-1 focus:ring-forest-600"
            />
          </div>

          {/* View Toggle */}
          <div className="flex items-center gap-1.5 self-end md:self-auto">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg border text-xs font-medium transition-colors ${viewMode === 'grid'
                  ? 'bg-forest-800 text-white border-forest-800'
                  : 'bg-white text-agri-muted border-agri-border hover:bg-agri-cream'
                }`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg border text-xs font-medium transition-colors ${viewMode === 'list'
                  ? 'bg-forest-800 text-white border-forest-800'
                  : 'bg-white text-agri-muted border-agri-border hover:bg-agri-cream'
                }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Filters Row */}
        <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-agri-border/60 text-xs">
          <div className="flex items-center gap-1.5 text-agri-muted font-medium">
            <Filter className="w-3.5 h-3.5 text-forest-700" />
            <span>Filters:</span>
          </div>

          {/* Crop Filter */}
          <select
            value={cropFilter}
            onChange={e => setCropFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg border border-agri-border bg-white text-xs text-agri-charcoal focus:outline-none focus:ring-1 focus:ring-forest-600"
          >
            <option value="All">All Crops</option>
            <option value="Wheat">Wheat</option>
            <option value="Mustard">Mustard</option>
          </select>

          {/* Health Filter */}
          <select
            value={healthFilter}
            onChange={e => setHealthFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg border border-agri-border bg-white text-xs text-agri-charcoal focus:outline-none focus:ring-1 focus:ring-forest-600"
          >
            <option value="All">All Health Statuses</option>
            <option value="Healthy">Healthy</option>
            <option value="Needs Attention">Needs Attention</option>
            <option value="At Risk">At Risk</option>
          </select>

          {/* Operational Status */}
          <select
            value={opFilter}
            onChange={e => setOpFilter(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg border border-agri-border bg-white text-xs text-agri-charcoal focus:outline-none focus:ring-1 focus:ring-forest-600"
          >
            <option value="All">All Operational States</option>
            <option value="Active">Active</option>
            <option value="Scheduled">Scheduled</option>
            <option value="Idle">Idle</option>
          </select>

          {(cropFilter !== 'All' || healthFilter !== 'All' || opFilter !== 'All' || search) && (
            <button
              onClick={() => {
                setCropFilter('All');
                setHealthFilter('All');
                setOpFilter('All');
                setSearch('');
              }}
              className="text-xs text-forest-700 hover:underline font-semibold"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Main Grid or List View */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredFarms.map(farm => {
            const farmTasks = tasks.filter(t => t.farmId === farm.id);
            const pendingTasks = farmTasks.filter(t => t.status !== 'Completed');
            const isSelected = selectedFarmId === farm.id;

            return (
              <div
                key={farm.id}
                onClick={() => setSelectedFarmId(isSelected ? null : farm.id)}
                className={`bg-white rounded-2xl border p-5 shadow-sm transition-all cursor-pointer flex flex-col justify-between ${isSelected
                    ? 'border-forest-600 ring-2 ring-forest-600/20 shadow-md'
                    : 'border-agri-border hover:border-forest-300 hover:shadow-md'
                  }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-bold text-forest-800 uppercase px-2 py-0.5 rounded bg-forest-100">
                      {farm.cropType} {farm.variety ? `• ${farm.variety}` : ''}
                    </span>
                    <HealthStatusBadge status={farm.healthStatus} />
                  </div>

                  <h3 className="font-heading font-bold text-base text-agri-charcoal mb-1">
                    {farm.name}
                  </h3>

                  <div className="flex items-center gap-1.5 text-xs text-agri-muted mb-4">
                    <MapPin className="w-3.5 h-3.5 text-forest-700 shrink-0" />
                    <span>{farm.location}, {farm.district}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 p-3 rounded-xl bg-agri-cream/60 border border-agri-border text-xs mb-4">
                    <div>
                      <span className="text-[10px] text-agri-muted uppercase font-semibold block">Total Plot Area</span>
                      <span className="font-bold text-agri-charcoal">{farm.areaAcres} Acres</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-agri-muted uppercase font-semibold block">Irrigation Type</span>
                      <span className="font-semibold text-agri-charcoal">{farm.irrigationType}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-agri-muted uppercase font-semibold block">Planting Date</span>
                      <span className="text-agri-charcoal">{farm.plantingDate}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-agri-muted uppercase font-semibold block">Soil Profile</span>
                      <span className="text-agri-charcoal truncate block">{farm.soilType}</span>
                    </div>
                  </div>
                </div>

                <div>
                  {/* Operations counter */}
                  <div className="flex items-center justify-between text-xs py-2 border-t border-agri-border/60 mb-3">
                    <span className="text-agri-muted">
                      Pending Tasks: <strong className="text-forest-800">{pendingTasks.length}</strong>
                    </span>
                    <OperationalStatusBadge status={farm.operationalStatus} />
                  </div>

                  {farm.notes && (
                    <p className="text-[11px] text-agri-muted italic mb-3 line-clamp-1">
                      &quot;{farm.notes}&quot;
                    </p>
                  )}

                  <div className="flex items-center justify-between text-xs text-forest-700 font-semibold pt-1">
                    <span>{isSelected ? 'Plot Selected (Showing Below)' : 'Click to View Detailed Operations'}</span>
                    <ChevronRight className={`w-4 h-4 transition-transform ${isSelected ? 'rotate-90' : ''}`} />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* List View */
        <div className="bg-white rounded-2xl border border-agri-border shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-agri-cream/80 border-b border-agri-border text-agri-muted uppercase text-[10px] font-bold tracking-wider">
                <tr>
                  <th className="p-4">Farm Plot</th>
                  <th className="p-4">Location</th>
                  <th className="p-4">Crop & Variety</th>
                  <th className="p-4">Area</th>
                  <th className="p-4">Health Status</th>
                  <th className="p-4">Operational Status</th>
                  <th className="p-4">Pending Tasks</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-agri-border">
                {filteredFarms.map(farm => {
                  const pendingCount = tasks.filter(t => t.farmId === farm.id && t.status !== 'Completed').length;
                  return (
                    <tr
                      key={farm.id}
                      onClick={() => setSelectedFarmId(farm.id)}
                      className="hover:bg-agri-cream/40 cursor-pointer transition-colors"
                    >
                      <td className="p-4 font-bold text-agri-charcoal">{farm.name}</td>
                      <td className="p-4 text-agri-muted">{farm.location}</td>
                      <td className="p-4">
                        <span className="font-semibold text-forest-800">{farm.cropType}</span>
                        {farm.variety && <span className="text-agri-muted block text-[11px]">{farm.variety}</span>}
                      </td>
                      <td className="p-4 font-bold text-agri-charcoal">{farm.areaAcres} Acres</td>
                      <td className="p-4">
                        <HealthStatusBadge status={farm.healthStatus} />
                      </td>
                      <td className="p-4">
                        <OperationalStatusBadge status={farm.operationalStatus} />
                      </td>
                      <td className="p-4 font-bold text-forest-800">{pendingCount} Tasks</td>
                      <td className="p-4 text-right">
                        <button
                          onClick={e => {
                            e.stopPropagation();
                            setSelectedFarmId(farm.id);
                          }}
                          className="px-2.5 py-1 rounded bg-forest-50 text-forest-800 font-semibold hover:bg-forest-100 transition-colors"
                        >
                          Details
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Selected Farm Detail Drawer / Section */}
      {selectedFarm && (
        <div className="bg-white rounded-2xl border-2 border-forest-600 p-6 shadow-md animate-scale-up">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-agri-border mb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-forest-100 text-forest-800">
                  Detailed Plot View
                </span>
                <HealthStatusBadge status={selectedFarm.healthStatus} />
              </div>
              <h3 className="font-heading font-extrabold text-xl text-agri-charcoal">
                {selectedFarm.name}
              </h3>
              <p className="text-xs text-agri-muted">
                {selectedFarm.location}, District {selectedFarm.district}, Haryana
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setActivePage('operations')}
                className="px-3.5 py-2 rounded-lg bg-forest-800 hover:bg-forest-900 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <span>Open Operations Planner</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setSelectedFarmId(null)}
                className="p-2 rounded-lg border border-agri-border hover:bg-agri-cream text-agri-muted hover:text-agri-charcoal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="p-3.5 rounded-xl bg-agri-cream/60 border border-agri-border text-xs">
              <span className="text-agri-muted block uppercase font-bold text-[10px] mb-1">Crop Stage</span>
              <span className="font-heading font-bold text-base text-agri-charcoal">{selectedFarm.cropType}</span>
              <span className="text-agri-muted block text-[11px] mt-0.5">Planted on {selectedFarm.plantingDate}</span>
            </div>
            <div className="p-3.5 rounded-xl bg-agri-cream/60 border border-agri-border text-xs">
              <span className="text-agri-muted block uppercase font-bold text-[10px] mb-1">Soil Profile</span>
              <span className="font-heading font-bold text-base text-agri-charcoal">{selectedFarm.soilType}</span>
              <span className="text-agri-muted block text-[11px] mt-0.5">Irrigation: {selectedFarm.irrigationType}</span>
            </div>
            <div className="p-3.5 rounded-xl bg-agri-cream/60 border border-agri-border text-xs">
              <span className="text-agri-muted block uppercase font-bold text-[10px] mb-1">Assigned Equipment</span>
              <span className="font-heading font-bold text-base text-agri-charcoal">
                {resources.filter(r => r.assignedFarmId === selectedFarm.id).length} Units Dedicated
              </span>
              <span className="text-forest-700 block text-[11px] mt-0.5">Synchronized with fleet manager</span>
            </div>
          </div>

          {/* Current Tasks for this farm */}
          <div>
            <h4 className="font-heading font-bold text-sm text-agri-charcoal mb-3">
              Planned & In-Progress Operations ({selectedFarmTasks.length})
            </h4>
            <div className="space-y-2.5">
              {selectedFarmTasks.map(task => (
                <div
                  key={task.id}
                  className="p-3 rounded-xl border border-agri-border bg-stone-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-agri-charcoal">{task.title}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white border border-agri-border">
                        {task.priority} Priority
                      </span>
                    </div>
                    <p className="text-agri-muted text-[11px]">{task.priorityReason}</p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <span className="font-medium text-forest-800 bg-forest-50 px-2 py-1 rounded border border-forest-100">
                      {task.startTime} - {task.endTime}
                    </span>
                    <span className="text-agri-muted text-[11px]">
                      Machinery: <strong>{task.resourceName}</strong>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Add Farm Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-forest-900/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-agri-border overflow-hidden my-6">
            <div className="bg-forest-800 text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-forest-600 flex items-center justify-center text-forest-200">
                  <Sprout className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-base text-white">Enroll New Farm Plot</h3>
                  <p className="text-[11px] text-forest-200">Manual spatial farm onboarding (no sensors required)</p>
                </div>
              </div>
              <button onClick={() => setIsAddModalOpen(false)} className="text-forest-300 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddFarm} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              <div>
                <label className="block text-xs font-semibold text-agri-charcoal mb-1">Farm Name</label>
                <input
                  type="text"
                  value={newFarmName}
                  onChange={e => setNewFarmName(e.target.value)}
                  placeholder="e.g. Farm D (Jhajjar South)"
                  className="w-full px-3.5 py-2 rounded-lg border border-agri-border text-xs text-agri-charcoal focus:outline-none focus:ring-1 focus:ring-forest-600"
                />
                {formErrors.name && <p className="text-xs text-agri-red mt-1">{formErrors.name}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-agri-charcoal mb-1">Location Details</label>
                  <input
                    type="text"
                    value={newLocation}
                    onChange={e => setNewLocation(e.target.value)}
                    placeholder="e.g. Bahadurgarh Belt"
                    className="w-full px-3.5 py-2 rounded-lg border border-agri-border text-xs text-agri-charcoal focus:outline-none focus:ring-1 focus:ring-forest-600"
                  />
                  {formErrors.location && <p className="text-xs text-agri-red mt-1">{formErrors.location}</p>}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-agri-charcoal mb-1">Haryana District</label>
                  <select
                    value={newDistrict}
                    onChange={e => setNewDistrict(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-agri-border text-xs text-agri-charcoal bg-white focus:outline-none"
                  >
                    <option value="Sonipat">Sonipat</option>
                    <option value="Karnal">Karnal</option>
                    <option value="Rohtak">Rohtak</option>
                    <option value="Jhajjar">Jhajjar</option>
                    <option value="Panipat">Panipat</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-agri-charcoal mb-1">Farm Area (Acres)</label>
                  <input
                    type="number"
                    min="1"
                    max="1000"
                    value={newArea}
                    onChange={e => setNewArea(Number(e.target.value))}
                    className="w-full px-3.5 py-2 rounded-lg border border-agri-border text-xs text-agri-charcoal focus:outline-none focus:ring-1 focus:ring-forest-600"
                  />
                  {formErrors.area && <p className="text-xs text-agri-red mt-1">{formErrors.area}</p>}
                </div>

                <div>
                  <label className="block text-xs font-semibold text-agri-charcoal mb-1">Crop Type</label>
                  <select
                    value={newCropType}
                    onChange={e => setNewCropType(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-agri-border text-xs text-agri-charcoal bg-white focus:outline-none"
                  >
                    <option value="Wheat">Wheat</option>
                    <option value="Mustard">Mustard</option>
                    <option value="Barley">Barley</option>
                    <option value="Chickpea">Chickpea</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-agri-charcoal mb-1">Variety / Hybrid</label>
                  <input
                    type="text"
                    value={newVariety}
                    onChange={e => setNewVariety(e.target.value)}
                    placeholder="e.g. PBW-725"
                    className="w-full px-3.5 py-2 rounded-lg border border-agri-border text-xs text-agri-charcoal focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-agri-charcoal mb-1">Irrigation System</label>
                  <select
                    value={newIrrigation}
                    onChange={e => setNewIrrigation(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg border border-agri-border text-xs text-agri-charcoal bg-white focus:outline-none"
                  >
                    <option value="Borewell">Borewell</option>
                    <option value="Drip">Drip Irrigation</option>
                    <option value="Canal / Flood">Canal / Flood</option>
                    <option value="Sprinkler">Sprinkler System</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-agri-charcoal mb-1">Planting Date</label>
                  <input
                    type="date"
                    value={newPlantingDate}
                    onChange={e => setNewPlantingDate(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-lg border border-agri-border text-xs text-agri-charcoal focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-agri-charcoal mb-1">Soil Description</label>
                <input
                  type="text"
                  value={newSoilType}
                  onChange={e => setNewSoilType(e.target.value)}
                  placeholder="e.g. Sandy Alluvial Loam, pH 7.2"
                  className="w-full px-3.5 py-2 rounded-lg border border-agri-border text-xs text-agri-charcoal focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-agri-charcoal mb-1">Operational Notes (Optional)</label>
                <textarea
                  rows={2}
                  value={newNotes}
                  onChange={e => setNewNotes(e.target.value)}
                  placeholder="e.g. Organic plot under transition; zero glyphosate policy"
                  className="w-full px-3.5 py-2 rounded-lg border border-agri-border text-xs text-agri-charcoal focus:outline-none"
                />
              </div>

              <div className="pt-3 border-t border-agri-border flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-agri-border text-xs font-medium text-agri-charcoal hover:bg-agri-cream"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-forest-800 hover:bg-forest-900 text-white text-xs font-bold transition-all shadow-sm"
                >
                  Enroll Farm Plot
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
