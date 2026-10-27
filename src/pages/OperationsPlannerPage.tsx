import React, { useState } from 'react';
import {
  CalendarDays,
  Plus,
  Sparkles,
  Clock,
  Wrench,
  AlertTriangle,
  CheckCircle2,
  Filter,
  ArrowRight,
  Edit2,
  Calendar,
  Layers,
  Info,
  RotateCcw
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PageHeader } from '../components/common/PageHeader';
import { PriorityBadge } from '../components/common/PriorityBadge';
import { TaskModal } from '../components/operations/TaskModal';
import { FarmTask, TaskPriority, TaskStatus } from '../types';

export const OperationsPlannerPage: React.FC = () => {
  const {
    tasks,
    farms,
    resources,
    runPlanEngine,
    isGeneratingPlan,
    markTaskCompleted,
    updateTask,
    rescheduleTask,
    resetAllDemoData
  } = useApp();

  const [selectedFarmFilter, setSelectedFarmFilter] = useState('All');
  const [selectedPriorityFilter, setSelectedPriorityFilter] = useState('All');
  const [selectedDate, setSelectedDate] = useState('2026-10-28');
  const [activeTab, setActiveTab] = useState<'timeline' | 'table'>('timeline');

  // Modal State
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<FarmTask | null>(null);

  // Quick Reschedule State
  const [reschedulingTaskId, setReschedulingTaskId] = useState<string | null>(null);
  const [newStartTime, setNewStartTime] = useState('08:00');
  const [newEndTime, setNewEndTime] = useState('11:00');

  const filteredTasks = tasks.filter(t => {
    const matchesFarm = selectedFarmFilter === 'All' || t.farmId === selectedFarmFilter;
    const matchesPriority = selectedPriorityFilter === 'All' || t.priority === selectedPriorityFilter;
    return matchesFarm && matchesPriority;
  });

  const conflictsCount = tasks.filter(t => t.hasConflict).length;
  const weatherRiskCount = tasks.filter(t => t.weatherRiskTag).length;

  const handleEdit = (task: FarmTask) => {
    setEditingTask(task);
    setIsTaskModalOpen(true);
  };

  const handleCreateNew = () => {
    setEditingTask(null);
    setIsTaskModalOpen(true);
  };

  const handleSaveReschedule = (taskId: string) => {
    rescheduleTask(taskId, selectedDate, newStartTime, newEndTime);
    setReschedulingTaskId(null);
  };

  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        title="Multi-Farm Operations Planner"
        subtitle="Coordinate field tasks, shared equipment, and specialized agronomic crews across plots with deterministic conflict-resolution heuristics."
        badge="Autonomous Engine"
        action={
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleCreateNew}
              className="px-3.5 py-2.5 rounded-xl border border-agri-border bg-white hover:bg-agri-cream text-agri-charcoal text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4 text-forest-700" />
              <span>Schedule New Operation</span>
            </button>

            <button
              onClick={runPlanEngine}
              disabled={isGeneratingPlan}
              className="px-4 py-2.5 rounded-xl bg-forest-800 hover:bg-forest-900 text-white text-xs font-bold flex items-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer disabled:opacity-70"
            >
              <Sparkles className="w-4 h-4 text-forest-300" />
              <span>{isGeneratingPlan ? 'Evaluating Rules...' : 'Generate Operations Plan'}</span>
            </button>
          </div>
        }
      />

      {/* Engine Status & Disclosures Banner */}
      <div className="p-4 rounded-xl bg-forest-50 border border-forest-200/80 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
        <div className="flex items-start gap-2.5">
          <Info className="w-4 h-4 text-forest-700 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-forest-900 block">
              Prototype Planning Engine — Rule-Based Demonstration
            </span>
            <p className="text-forest-800/90 leading-relaxed">
              Transparently models multi-farm resource sharing (Solar Pump #1 overlap) and convective weather washout rules. Press &ldquo;Generate Operations Plan&rdquo; to demonstrate the AI agent proposal.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {conflictsCount > 0 ? (
            <span className="px-2.5 py-1 rounded-full bg-red-100 text-agri-red font-bold flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5" />
              {conflictsCount} Resource Contention
            </span>
          ) : (
            <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-forest-800 font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-forest-600" />
              All Machinery De-conflicted
            </span>
          )}

          {weatherRiskCount > 0 && (
            <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 font-semibold flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5 text-agri-amber" />
              {weatherRiskCount} Weather Risk
            </span>
          )}
        </div>
      </div>

      {/* Control Bar: Filters, Date & View Switcher */}
      <div className="bg-white rounded-2xl border border-agri-border p-4 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Left: Filters */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto text-xs">
          <div className="flex items-center gap-2 bg-agri-cream px-3 py-1.5 rounded-lg border border-agri-border">
            <Calendar className="w-3.5 h-3.5 text-forest-700" />
            <input
              type="date"
              value={selectedDate}
              onChange={e => setSelectedDate(e.target.value)}
              className="bg-transparent font-semibold text-xs focus:outline-none cursor-pointer"
            />
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-agri-muted font-medium">Farm:</span>
            <select
              value={selectedFarmFilter}
              onChange={e => setSelectedFarmFilter(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border border-agri-border bg-white text-xs text-agri-charcoal focus:outline-none"
            >
              <option value="All">All Farms (3)</option>
              {farms.map(f => (
                <option key={f.id} value={f.id}>
                  {f.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-agri-muted font-medium">Priority:</span>
            <select
              value={selectedPriorityFilter}
              onChange={e => setSelectedPriorityFilter(e.target.value)}
              className="px-2.5 py-1.5 rounded-lg border border-agri-border bg-white text-xs text-agri-charcoal focus:outline-none"
            >
              <option value="All">All Priorities</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
        </div>

        {/* Right: Tab Mode */}
        <div className="flex items-center gap-1 bg-agri-cream p-1 rounded-lg border border-agri-border self-end md:self-auto text-xs">
          <button
            onClick={() => setActiveTab('timeline')}
            className={`px-3 py-1 rounded-md font-semibold transition-all cursor-pointer ${
              activeTab === 'timeline'
                ? 'bg-white text-forest-800 shadow-xs'
                : 'text-agri-muted hover:text-agri-charcoal'
            }`}
          >
            Chronological Timeline
          </button>
          <button
            onClick={() => setActiveTab('table')}
            className={`px-3 py-1 rounded-md font-semibold transition-all cursor-pointer ${
              activeTab === 'table'
                ? 'bg-white text-forest-800 shadow-xs'
                : 'text-agri-muted hover:text-agri-charcoal'
            }`}
          >
            Operations Matrix Table
          </button>
        </div>
      </div>

      {/* Main Operations Board / Timeline View */}
      {activeTab === 'timeline' ? (
        <div className="space-y-4">
          {farms.map(farm => {
            const farmTasks = filteredTasks.filter(t => t.farmId === farm.id);
            if (selectedFarmFilter !== 'All' && selectedFarmFilter !== farm.id) return null;

            return (
              <div
                key={farm.id}
                className="bg-white rounded-2xl border border-agri-border overflow-hidden shadow-sm"
              >
                {/* Farm Section Header */}
                <div className="bg-agri-cream/60 px-5 py-3.5 border-b border-agri-border flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-2.5 h-2.5 rounded-full bg-forest-600" />
                    <div>
                      <h3 className="font-heading font-bold text-sm text-agri-charcoal">
                        {farm.name}
                      </h3>
                      <span className="text-[11px] text-agri-muted">
                        {farm.cropType} • {farm.areaAcres} Acres • {farm.location}
                      </span>
                    </div>
                  </div>

                  <span className="text-xs font-semibold px-2 py-0.5 rounded bg-white border border-agri-border text-forest-800">
                    {farmTasks.length} Operations
                  </span>
                </div>

                {/* Tasks Timeline Stream */}
                <div className="p-5 divide-y divide-agri-border/60">
                  {farmTasks.length > 0 ? (
                    farmTasks.map(task => (
                      <div
                        key={task.id}
                        className={`py-3.5 first:pt-0 last:pb-0 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all rounded-lg ${
                          task.hasConflict
                            ? 'bg-red-50/50 p-3 border border-red-200'
                            : task.weatherRiskTag
                            ? 'bg-amber-50/40 p-3 border border-amber-200'
                            : ''
                        }`}
                      >
                        {/* Time & Title */}
                        <div className="flex items-start gap-4 flex-1">
                          <div className="w-24 shrink-0 text-center py-1.5 px-2 rounded-lg bg-stone-100 border border-stone-200 text-xs">
                            <span className="font-bold text-agri-charcoal block">
                              {task.startTime} - {task.endTime}
                            </span>
                            <span className="text-[10px] text-agri-muted block">{task.scheduledDate}</span>
                          </div>

                          <div className="space-y-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4 className="font-heading font-bold text-sm text-agri-charcoal">
                                {task.title}
                              </h4>
                              <PriorityBadge priority={task.priority} size="sm" />
                              <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                                  task.status === 'Completed'
                                    ? 'bg-emerald-100 text-forest-800'
                                    : task.status === 'Rescheduled'
                                    ? 'bg-blue-100 text-blue-800'
                                    : 'bg-stone-100 text-stone-700'
                                }`}
                              >
                                {task.status}
                              </span>
                            </div>

                            <p className="text-xs text-agri-muted leading-snug">
                              <span className="font-medium text-agri-charcoal">Rationale: </span>
                              {task.priorityReason}
                            </p>

                            <div className="flex flex-wrap items-center gap-3 text-[11px] text-forest-800 pt-0.5">
                              <span className="flex items-center gap-1 font-semibold">
                                <Wrench className="w-3 h-3 text-forest-600" />
                                {task.resourceName}
                              </span>
                              <span className="text-agri-muted">Crew: {task.assignedTeam}</span>
                            </div>

                            {/* Alert notes */}
                            {task.hasConflict && (
                              <p className="text-xs font-bold text-agri-red flex items-center gap-1 pt-1">
                                <AlertTriangle className="w-3.5 h-3.5" />
                                Overlaps with another farm on Solar Pump #1!
                              </p>
                            )}

                            {task.weatherRiskTag && (
                              <p className="text-xs font-semibold text-agri-amber flex items-center gap-1 pt-1">
                                <AlertTriangle className="w-3.5 h-3.5" />
                                {task.weatherRiskTag}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Interactive Task Action Buttons */}
                        <div className="flex items-center gap-2 shrink-0 self-end md:self-auto">
                          {task.status !== 'Completed' && (
                            <button
                              onClick={() => markTaskCompleted(task.id)}
                              className="px-2.5 py-1.5 rounded-lg bg-forest-50 hover:bg-forest-100 text-forest-800 text-xs font-semibold border border-forest-200 transition-colors flex items-center gap-1 cursor-pointer"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5 text-forest-600" />
                              <span>Done</span>
                            </button>
                          )}

                          <button
                            onClick={() => {
                              if (reschedulingTaskId === task.id) {
                                setReschedulingTaskId(null);
                              } else {
                                setReschedulingTaskId(task.id);
                                setNewStartTime(task.startTime);
                                setNewEndTime(task.endTime);
                              }
                            }}
                            className="px-2.5 py-1.5 rounded-lg bg-white hover:bg-agri-cream text-agri-charcoal text-xs font-medium border border-agri-border transition-colors cursor-pointer"
                          >
                            Reschedule
                          </button>

                          <button
                            onClick={() => handleEdit(task)}
                            className="p-1.5 rounded-lg text-agri-muted hover:text-agri-charcoal hover:bg-agri-cream border border-agri-border"
                            title="Edit Operation"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Inline Reschedule Drawer */}
                        {reschedulingTaskId === task.id && (
                          <div className="w-full mt-3 p-3 rounded-xl bg-forest-50/80 border border-forest-200 flex flex-wrap items-center justify-between gap-3 text-xs">
                            <span className="font-bold text-forest-900">
                              Adjust Time Window:
                            </span>
                            <div className="flex items-center gap-2">
                              <input
                                type="time"
                                value={newStartTime}
                                onChange={e => setNewStartTime(e.target.value)}
                                className="px-2 py-1 rounded bg-white border border-agri-border text-xs text-agri-charcoal font-semibold"
                              />
                              <span>to</span>
                              <input
                                type="time"
                                value={newEndTime}
                                onChange={e => setNewEndTime(e.target.value)}
                                className="px-2 py-1 rounded bg-white border border-agri-border text-xs text-agri-charcoal font-semibold"
                              />
                            </div>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => setReschedulingTaskId(null)}
                                className="px-2.5 py-1 rounded bg-white border border-agri-border text-xs text-agri-muted"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={() => handleSaveReschedule(task.id)}
                                className="px-3 py-1 rounded bg-forest-800 hover:bg-forest-900 text-white text-xs font-bold"
                              >
                                Save Time
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="py-6 text-center text-xs text-agri-muted">
                      No scheduled operations found matching active filter.
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Operations Table View */
        <div className="bg-white rounded-2xl border border-agri-border shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-agri-cream/80 border-b border-agri-border text-agri-muted uppercase text-[10px] font-bold tracking-wider">
                <tr>
                  <th className="p-4">Operation</th>
                  <th className="p-4">Target Plot</th>
                  <th className="p-4">Priority</th>
                  <th className="p-4">Window</th>
                  <th className="p-4">Assigned Resource</th>
                  <th className="p-4">Assigned Crew</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-agri-border">
                {filteredTasks.map(task => (
                  <tr
                    key={task.id}
                    className={`hover:bg-agri-cream/40 transition-colors ${
                      task.hasConflict ? 'bg-red-50/40' : ''
                    }`}
                  >
                    <td className="p-4">
                      <span className="font-bold text-agri-charcoal block">{task.title}</span>
                      <span className="text-[11px] text-agri-muted line-clamp-1">{task.priorityReason}</span>
                    </td>
                    <td className="p-4 font-semibold text-forest-800">{task.farmName}</td>
                    <td className="p-4">
                      <PriorityBadge priority={task.priority} size="sm" />
                    </td>
                    <td className="p-4 font-semibold text-agri-charcoal">
                      {task.startTime} - {task.endTime}
                    </td>
                    <td className="p-4 font-medium text-forest-800">
                      {task.resourceName}
                      {task.hasConflict && (
                        <span className="text-[10px] text-agri-red font-bold block">! Contention</span>
                      )}
                    </td>
                    <td className="p-4 text-agri-muted">{task.assignedTeam}</td>
                    <td className="p-4 font-bold text-forest-700">{task.status}</td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handleEdit(task)}
                        className="px-2.5 py-1 rounded bg-forest-50 text-forest-800 font-semibold hover:bg-forest-100 mr-2"
                      >
                        Edit
                      </button>
                      {task.status !== 'Completed' && (
                        <button
                          onClick={() => markTaskCompleted(task.id)}
                          className="px-2.5 py-1 rounded bg-forest-800 text-white font-bold hover:bg-forest-900"
                        >
                          Complete
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Task Modal */}
      <TaskModal
        task={editingTask}
        isOpen={isTaskModalOpen}
        onClose={() => {
          setIsTaskModalOpen(false);
          setEditingTask(null);
        }}
      />
    </div>
  );
};
