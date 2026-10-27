import React, { useState } from 'react';
import {
  BarChart3,
  Download,
  Calendar,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Layers,
  FileSpreadsheet
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid
} from 'recharts';
import { useApp } from '../context/AppContext';
import { PageHeader } from '../components/common/PageHeader';

export const ReportsPage: React.FC = () => {
  const { tasks, farms, resources, showToast } = useApp();

  const [dateRange, setDateRange] = useState('7d');
  const [selectedFarm, setSelectedFarm] = useState('All');

  // Chart Data: Farm-wise Task Counts
  const farmTaskData = farms.map(f => {
    const fTasks = tasks.filter(t => t.farmId === f.id);
    return {
      name: f.name.split(' (')[0],
      total: fTasks.length,
      completed: fTasks.filter(t => t.status === 'Completed').length,
      scheduled: fTasks.filter(t => t.status !== 'Completed').length,
    };
  });

  // Chart Data: Priority Distribution
  const priorityData = [
    { name: 'Critical', value: tasks.filter(t => t.priority === 'Critical').length, color: '#C94C4C' },
    { name: 'High', value: tasks.filter(t => t.priority === 'High').length, color: '#D99A35' },
    { name: 'Medium', value: tasks.filter(t => t.priority === 'Medium').length, color: '#2F6B4F' },
    { name: 'Low', value: tasks.filter(t => t.priority === 'Low').length, color: '#82A96B' },
  ];

  // Chart Data: Resource Utilisation
  const resourceData = [
    { name: 'Solar Pump #1', util: 92 },
    { name: 'Auxiliary Pump #2', util: 65 },
    { name: 'Mahindra Tractor', util: 78 },
    { name: 'Boom Sprayer', util: 50 },
    { name: 'Team Alpha', util: 88 },
    { name: 'Team Beta', util: 70 },
  ];

  // Real CSV Export functionality
  const handleExportCSV = () => {
    const headers = ['Task ID', 'Farm Name', 'Crop', 'Title', 'Priority', 'Status', 'Start Time', 'End Time', 'Resource', 'Assigned Team', 'Notes'];
    const rows = tasks.map(t => [
      t.id,
      `"${t.farmName}"`,
      t.crop,
      `"${t.title.replace(/"/g, '""')}"`,
      t.priority,
      t.status,
      t.startTime,
      t.endTime,
      `"${t.resourceName}"`,
      `"${t.assignedTeam}"`,
      `"${(t.notes || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `farm_operations_report_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast('Report Exported', 'Downloaded complete operations dataset as CSV.', 'success');
  };

  return (
    <div className="space-y-6 pb-12">
      <PageHeader
        title="Reports & Agronomic Analytics"
        subtitle="Historical operational metrics, resource utilization curves, and conflict de-escalation analytics."
        badge="Demonstration Analytics"
        action={
          <button
            onClick={handleExportCSV}
            className="px-4 py-2.5 rounded-xl bg-forest-800 hover:bg-forest-900 text-white text-xs font-bold flex items-center gap-2 shadow-sm transition-all cursor-pointer"
          >
            <Download className="w-4 h-4 text-forest-300" />
            <span>Export CSV Operations Report</span>
          </button>
        }
      />

      {/* Filter and Date Bar */}
      <div className="bg-white rounded-2xl border border-agri-border p-4 shadow-sm flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-agri-muted font-semibold">
            <Filter className="w-3.5 h-3.5 text-forest-700" />
            <span>Filter Report:</span>
          </div>

          <select
            value={selectedFarm}
            onChange={e => setSelectedFarm(e.target.value)}
            className="px-3 py-1.5 rounded-lg border border-agri-border bg-white text-xs text-agri-charcoal focus:outline-none"
          >
            <option value="All">All Farms</option>
            {farms.map(f => (
              <option key={f.id} value={f.id}>
                {f.name}
              </option>
            ))}
          </select>

          <select
            value={dateRange}
            onChange={e => setDateRange(e.target.value)}
            className="px-3 py-1.5 rounded-lg border border-agri-border bg-white text-xs text-agri-charcoal focus:outline-none"
          >
            <option value="today">Today (Active Operations)</option>
            <option value="7d">Last 7 Days (Demo Window)</option>
            <option value="30d">Last 30 Days (Crop Season)</option>
          </select>
        </div>

        <span className="text-agri-muted">
          Dataset: <strong>3 Haryana Plots</strong> • Rule Heuristics Run #104
        </span>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Farm Task Distribution Bar Chart */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-agri-border p-5 sm:p-6 shadow-sm">
          <h3 className="font-heading font-bold text-base text-agri-charcoal mb-1">
            Farm-Wise Task Distribution
          </h3>
          <p className="text-xs text-agri-muted mb-4">
            Demonstration distribution of scheduled vs executed operations by plot
          </p>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={farmTaskData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E9E2" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#6B756D' }} />
                <YAxis tick={{ fontSize: 11, fill: '#6B756D' }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #E5E9E2', fontSize: '11px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Bar dataKey="scheduled" name="Scheduled / Active" fill="#2F6B4F" radius={[4, 4, 0, 0]} />
                <Bar dataKey="completed" name="Completed" fill="#82A96B" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Task Priority Breakdown (Pie Chart) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-agri-border p-5 sm:p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-heading font-bold text-base text-agri-charcoal mb-1">
              Task Priority Breakdown
            </h3>
            <p className="text-xs text-agri-muted mb-4">
              Urgency distribution based on soil and pest alerts
            </p>

            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={priorityData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {priorityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #E5E9E2', fontSize: '11px' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="pt-3 border-t border-agri-border/60 text-[11px] text-agri-muted text-center">
            {priorityData.find(p => p.name === 'Critical')?.value} Critical & {priorityData.find(p => p.name === 'High')?.value} High Priority operations
          </div>
        </div>
      </div>

      {/* Resource Utilisation Chart */}
      <div className="bg-white rounded-2xl border border-agri-border p-5 sm:p-6 shadow-sm">
        <h3 className="font-heading font-bold text-base text-agri-charcoal mb-1">
          Shared Fleet & Crew Utilisation Percentage
        </h3>
        <p className="text-xs text-agri-muted mb-4">
          Identifies equipment over-utilization and transit idle intervals across Haryana plots
        </p>

        <div className="h-60 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={resourceData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E9E2" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#6B756D' }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#6B756D' }} />
              <Tooltip
                formatter={(val: number) => [`${val}%`, 'Utilisation Rate']}
                contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #E5E9E2', fontSize: '11px' }}
              />
              <Bar dataKey="util" fill="#173F35" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
