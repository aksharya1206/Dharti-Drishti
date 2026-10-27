import React, { useState } from 'react';
import {
  Menu,
  Search,
  Bell,
  Sparkles,
  Calendar,
  AlertCircle,
  CheckCircle2,
  X,
  Database,
  ArrowRight
} from 'lucide-react';
import { useApp, PageId } from '../../context/AppContext';

interface TopNavbarProps {
  onToggleMobileMenu: () => void;
}

const PAGE_METADATA: Record<PageId, { title: string; category: string }> = {
  overview: { title: 'Multi-Farm Overview', category: 'Executive Dashboard' },
  'farm-network': { title: 'Farm Network Management', category: 'Spatial Plots' },
  'crop-health': { title: 'Crop Health Surveillance', category: 'Agronomy Reports' },
  weather: { title: 'Weather & Risk Intelligence', category: 'Microclimate Models' },
  operations: { title: 'Operations Schedule Planner', category: 'Planning Engine' },
  resources: { title: 'Resource & Machinery Allocation', category: 'Fleet & Crews' },
  'agent-centre': { title: 'Autonomous Agent Centre', category: 'Agentic Decisions' },
  simulator: { title: 'What-If Scenario Simulator', category: 'Contingency Testing' },
  reports: { title: 'Operational Analytics & Reports', category: 'Historical Insights' },
  settings: { title: 'System & Agent Settings', category: 'Configuration' },
};

export const TopNavbar: React.FC<TopNavbarProps> = ({ onToggleMobileMenu }) => {
  const {
    activePage,
    setActivePage,
    searchQuery,
    setSearchQuery,
    recommendations,
    tasks,
    user,
    logout,
  } = useApp();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const pendingRecs = recommendations.filter(r => r.status === 'Pending');
  const conflictTasks = tasks.filter(t => t.hasConflict);
  const unreadCount = pendingRecs.length + conflictTasks.length;

  const pageInfo = PAGE_METADATA[activePage] || { title: 'Operations', category: 'Platform' };

  const todayFormatted = new Intl.DateTimeFormat('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date());

  return (
    <header className="h-16 bg-white border-b border-agri-border px-4 sm:px-6 flex items-center justify-between gap-4 sticky top-0 z-20 shadow-xs">
      {/* Left: Mobile hamburger & Breadcrumbs */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onToggleMobileMenu}
          className="lg:hidden p-2 rounded-lg text-agri-charcoal hover:bg-agri-cream border border-agri-border transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="min-w-0">
          <div className="flex items-center gap-1.5 text-[11px] text-agri-muted">
            <span>{pageInfo.category}</span>
            <span>/</span>
            <span className="text-forest-700 font-medium truncate">{pageInfo.title}</span>
          </div>
          <h2 className="font-heading font-bold text-base sm:text-lg text-agri-charcoal truncate leading-tight">
            {pageInfo.title}
          </h2>
        </div>
      </div>

      {/* Middle: Global Search */}
      <div className="hidden md:flex items-center max-w-xs xl:max-w-md w-full relative">
        <Search className="w-4 h-4 text-agri-muted absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Search farms, tasks, machinery..."
          className="w-full pl-9 pr-3.5 py-1.5 rounded-lg border border-agri-border bg-agri-cream/40 text-xs text-agri-charcoal placeholder-agri-muted focus:bg-white focus:outline-none focus:ring-1 focus:ring-forest-600 focus:border-forest-600 transition-all"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-agri-muted hover:text-agri-charcoal"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Right: Date, Demo Status Badge, Notification, User Profile */}
      <div className="flex items-center gap-3">
        {/* Date Display */}
        <div className="hidden xl:flex items-center gap-1.5 text-xs text-agri-muted px-2.5 py-1 rounded-md bg-stone-50 border border-stone-200">
          <Calendar className="w-3.5 h-3.5 text-forest-700" />
          <span>{todayFormatted}</span>
        </div>

        {/* Demo Data Status Pill (Explicit requirement: "Never present simulated information as verified live information") */}
        <div className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50/80 border border-amber-200 text-amber-800 text-[11px] font-medium">
          <Database className="w-3 h-3 text-amber-600 shrink-0" />
          <span className="truncate">Demo Heuristic Mode</span>
        </div>

        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-lg text-agri-charcoal hover:bg-agri-cream border border-agri-border transition-colors cursor-pointer"
            title="Notifications & Agent Alerts"
          >
            <Bell className="w-4 h-4 text-agri-charcoal" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-agri-red text-white text-[10px] font-bold flex items-center justify-center animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown Panel */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-agri-border p-4 z-50">
              <div className="flex items-center justify-between pb-3 border-b border-agri-border mb-3">
                <div className="flex items-center gap-2">
                  <h4 className="font-heading font-bold text-sm text-agri-charcoal">
                    Operations Feed
                  </h4>
                  <span className="px-1.5 py-0.5 rounded-full bg-forest-100 text-forest-800 text-[10px] font-bold">
                    {unreadCount} new
                  </span>
                </div>
                <button
                  onClick={() => setShowNotifications(false)}
                  className="text-agri-muted hover:text-agri-charcoal"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2.5 max-h-72 overflow-y-auto">
                {conflictTasks.map(t => (
                  <div
                    key={t.id}
                    onClick={() => {
                      setActivePage('resources');
                      setShowNotifications(false);
                    }}
                    className="p-2.5 rounded-lg bg-red-50/80 border border-red-200 cursor-pointer hover:bg-red-100/60 transition-colors"
                  >
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-agri-red mb-1">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>Machinery Conflict: {t.resourceName}</span>
                    </div>
                    <p className="text-[11px] text-agri-charcoal/80 leading-snug">
                      Overlapping schedule at {t.farmName}. Requires resolution.
                    </p>
                  </div>
                ))}

                {pendingRecs.map(r => (
                  <div
                    key={r.id}
                    onClick={() => {
                      setActivePage('agent-centre');
                      setShowNotifications(false);
                    }}
                    className="p-2.5 rounded-lg bg-amber-50/70 border border-amber-200 cursor-pointer hover:bg-amber-100/60 transition-colors"
                  >
                    <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-900 mb-1">
                      <Sparkles className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      <span>{r.title}</span>
                    </div>
                    <p className="text-[11px] text-agri-charcoal/80 leading-snug">
                      {r.triggerReason}
                    </p>
                  </div>
                ))}

                {unreadCount === 0 && (
                  <div className="py-6 text-center text-xs text-agri-muted">
                    <CheckCircle2 className="w-6 h-6 text-forest-500 mx-auto mb-1.5" />
                    All multi-farm operations aligned without bottlenecks.
                  </div>
                )}
              </div>

              <div className="mt-3 pt-2.5 border-t border-agri-border flex items-center justify-between text-xs">
                <button
                  onClick={() => {
                    setActivePage('agent-centre');
                    setShowNotifications(false);
                  }}
                  className="text-forest-700 hover:text-forest-900 font-medium flex items-center gap-1"
                >
                  <span>Open AI Agent Centre</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-agri-cream border border-transparent hover:border-agri-border transition-all cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-forest-800 text-white font-bold text-xs flex items-center justify-center uppercase">
              {user?.name ? user.name.slice(0, 2) : 'AG'}
            </div>
            <div className="hidden sm:block text-left">
              <span className="text-xs font-semibold text-agri-charcoal block leading-tight">
                {user?.name || 'Farm Manager'}
              </span>
              <span className="text-[10px] text-agri-muted block leading-tight">
                {user?.role || 'Manager'}
              </span>
            </div>
          </button>

          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-xl border border-agri-border p-2 z-50">
              <div className="px-3 py-2 border-b border-agri-border mb-1">
                <p className="text-xs font-bold text-agri-charcoal">{user?.name}</p>
                <p className="text-[11px] text-agri-muted truncate">{user?.email}</p>
                <span className="inline-block mt-1 text-[10px] px-2 py-0.5 rounded bg-forest-50 text-forest-700 font-medium">
                  {user?.role}
                </span>
              </div>

              <button
                onClick={() => {
                  setActivePage('settings');
                  setShowProfileMenu(false);
                }}
                className="w-full text-left px-3 py-2 rounded-lg text-xs text-agri-charcoal hover:bg-agri-cream transition-colors"
              >
                Preferences & Settings
              </button>

              <button
                onClick={() => {
                  logout();
                  setShowProfileMenu(false);
                }}
                className="w-full text-left px-3 py-2 rounded-lg text-xs text-agri-red hover:bg-red-50 transition-colors font-semibold"
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

