import React, { useState } from 'react';
import {
  Sprout,
  CalendarCheck,
  AlertOctagon,
  Wrench,
  Sparkles,
  Calendar as CalendarIcon,
  ChevronRight,
  Filter
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { MetricCard } from '../components/common/MetricCard';
import { AgentInsightCard } from '../components/overview/AgentInsightCard';
import { WeatherSummaryPanel } from '../components/overview/WeatherSummaryPanel';
import { PriorityTaskList } from '../components/overview/PriorityTaskList';
import { FarmNetworkPreview } from '../components/overview/FarmNetworkPreview';
import { TaskModal } from '../components/operations/TaskModal';
import { FarmTask } from '../types';

export const OverviewPage: React.FC = () => {
  const { user, farms, tasks, runPlanEngine, isGeneratingPlan, setActivePage } = useApp();

  const [selectedTaskForModal, setSelectedTaskForModal] = useState<FarmTask | null>(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState('2026-10-28');

  const highPriorityCount = tasks.filter(t => t.priority === 'Critical' || t.priority === 'High').length;
  const conflictCount = tasks.filter(t => t.hasConflict).length;
  const scheduledCount = tasks.filter(t => t.status !== 'Completed').length;

  const handleOpenTask = (task: FarmTask) => {
    setSelectedTaskForModal(task);
    setIsTaskModalOpen(true);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Welcome Section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-agri-border">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-forest-50 border border-forest-200/60 text-forest-800 text-xs font-semibold mb-2">
            <span className="w-2 h-2 rounded-full bg-forest-600 animate-pulse" />
            Adaptive Agent Operations Active
          </div>
          <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-agri-charcoal tracking-tight">
            Good morning, {user?.name || 'Farm Manager'}
          </h1>
          <p className="text-xs sm:text-sm text-agri-muted max-w-2xl mt-1 leading-relaxed">
            Here is your farm operations overview. Review priorities, resource availability, and changes that may affect today&apos;s plan across your 3 Haryana plots.
          </p>
        </div>

        {/* Date Selector & Primary Action */}
        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-agri-border text-xs text-agri-charcoal shadow-xs">
            <CalendarIcon className="w-4 h-4 text-forest-700 shrink-0" />
            <input
              type="date"
              value={selectedDate}
              onChange={e => setSelectedDate(e.target.value)}
              className="bg-transparent font-medium text-xs focus:outline-none cursor-pointer"
            />
          </div>

          <button
            onClick={runPlanEngine}
            disabled={isGeneratingPlan}
            className="px-4 py-2.5 rounded-xl bg-forest-800 hover:bg-forest-900 text-white text-xs font-bold flex items-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer disabled:opacity-70"
          >
            <Sparkles className="w-4 h-4 text-forest-300" />
            <span>{isGeneratingPlan ? 'Optimising Plan...' : 'Generate Operations Plan'}</span>
          </button>
        </div>
      </div>

      {/* 4 Summary Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Farms"
          value={farms.length}
          subtitle="35 Total Acres Monitored"
          icon={Sprout}
          badgeText="Active Network"
          badgeType="success"
          onClick={() => setActivePage('farm-network')}
        />

        <MetricCard
          title="Tasks Scheduled"
          value={scheduledCount}
          subtitle="Field Operations for Today"
          icon={CalendarCheck}
          badgeText="9 Total"
          badgeType="neutral"
          onClick={() => setActivePage('operations')}
        />

        <MetricCard
          title="High-Priority Tasks"
          value={highPriorityCount}
          subtitle="Critical Aphid & Irrigation"
          icon={AlertOctagon}
          badgeText="Requires Action"
          badgeType="warning"
          onClick={() => setActivePage('operations')}
        />

        <MetricCard
          title="Resource Conflicts"
          value={conflictCount > 0 ? `${conflictCount} Overlap` : '0 Active'}
          subtitle="Solar Pump #1 double-booked"
          icon={Wrench}
          badgeText={conflictCount > 0 ? 'Resolution Needed' : 'De-conflicted'}
          badgeType={conflictCount > 0 ? 'alert' : 'success'}
          onClick={() => setActivePage('resources')}
        />
      </div>

      {/* AI Agent Insight Banner */}
      <AgentInsightCard />

      {/* Middle Row: Priority Tasks + Weather Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <PriorityTaskList onSelectTask={handleOpenTask} />
        </div>
        <div className="lg:col-span-5">
          <WeatherSummaryPanel />
        </div>
      </div>

      {/* Bottom Row: Farm Network Visual Grid */}
      <FarmNetworkPreview />

      {/* Task Modal for details / edit */}
      <TaskModal
        task={selectedTaskForModal}
        isOpen={isTaskModalOpen}
        onClose={() => {
          setIsTaskModalOpen(false);
          setSelectedTaskForModal(null);
        }}
      />
    </div>
  );
};
