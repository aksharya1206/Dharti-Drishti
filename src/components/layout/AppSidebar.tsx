import React from 'react';
import {
  LayoutDashboard,
  Sprout,
  Activity,
  CloudSun,
  CalendarDays,
  Wrench,
  Bot,
  Sliders,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  User,
  ShieldCheck,
  X
} from 'lucide-react';
import { useApp, PageId } from '../../context/AppContext';

interface AppSidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

interface NavItem {
  id: PageId;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  badgeColor?: string;
}

export const AppSidebar: React.FC<AppSidebarProps> = ({
  collapsed,
  onToggleCollapse,
  mobileOpen,
  onCloseMobile,
}) => {
  const { activePage, setActivePage, logout, user, tasks, recommendations } = useApp();

  const pendingRecsCount = recommendations.filter(r => r.status === 'Pending').length;
  const conflictTasksCount = tasks.filter(t => t.hasConflict).length;

  const navItems: NavItem[] = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'farm-network', label: 'Farm Network', icon: Sprout, badge: '3 Plots' },
    { id: 'crop-health', label: 'Crop Health', icon: Activity },
    { id: 'weather', label: 'Weather Intelligence', icon: CloudSun, badge: 'Risk Alert', badgeColor: 'bg-agri-amber text-forest-900' },
    { id: 'operations', label: 'Operations Planner', icon: CalendarDays, badge: 'Core', badgeColor: 'bg-forest-300 text-forest-900 font-bold' },
    {
      id: 'resources',
      label: 'Resource Allocation',
      icon: Wrench,
      badge: conflictTasksCount > 0 ? `${conflictTasksCount} Conflict` : undefined,
      badgeColor: 'bg-agri-red text-white font-bold',
    },
    {
      id: 'agent-centre',
      label: 'AI Agent Centre',
      icon: Bot,
      badge: pendingRecsCount > 0 ? `${pendingRecsCount} Pending` : undefined,
      badgeColor: 'bg-amber-400 text-forest-900 font-bold',
    },
    { id: 'simulator', label: 'What-If Simulator', icon: Sliders },
    { id: 'reports', label: 'Reports & Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleNavClick = (id: PageId) => {
    setActivePage(id);
    onCloseMobile();
  };

  const sidebarContent = (
    <div className="h-full flex flex-col justify-between bg-forest-800 text-white select-none">
      {/* Brand Header */}
      <div>
        <div className="h-16 flex items-center justify-between px-4 border-b border-forest-700/60">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-9 h-9 rounded-xl bg-forest-600/70 border border-forest-400/40 flex items-center justify-center shrink-0 shadow-sm">
              <svg
                className="w-5 h-5 text-forest-300"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z" />
                <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12" />
              </svg>
            </div>
            {!collapsed && (
              <div className="min-w-0">
                <span className="font-heading font-bold text-sm tracking-tight text-white block truncate">
                  Adaptive Farm
                </span>
                <span className="text-[10px] text-forest-300/80 block uppercase tracking-wider font-semibold">
                  Operations Agent
                </span>
              </div>
            )}
          </div>

          {/* Desktop collapse toggle */}
          <button
            onClick={onToggleCollapse}
            className="hidden lg:flex w-7 h-7 rounded-lg bg-forest-700/50 hover:bg-forest-600 items-center justify-center text-forest-200 transition-colors"
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>

          {/* Mobile close button */}
          <button
            onClick={onCloseMobile}
            className="lg:hidden w-7 h-7 rounded-lg bg-forest-700/50 items-center justify-center text-forest-200 flex"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation List */}
        <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-12rem)]">
          {navItems.map(item => {
            const isActive = activePage === item.id;
            const Icon = item.icon;

            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                title={collapsed ? item.label : undefined}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all group relative cursor-pointer ${
                  isActive
                    ? 'bg-forest-600 text-white shadow-sm font-semibold'
                    : 'text-forest-200/80 hover:bg-forest-700/50 hover:text-white'
                }`}
              >
                <Icon
                  className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${
                    isActive ? 'text-forest-300' : 'text-forest-300/80'
                  }`}
                />
                {!collapsed && (
                  <span className="truncate text-left flex-1">{item.label}</span>
                )}
                {!collapsed && item.badge && (
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full shrink-0 ${
                      item.badgeColor || 'bg-forest-700 text-forest-200'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}

                {/* Collapsed active indicator */}
                {collapsed && isActive && (
                  <span className="absolute right-1 w-1.5 h-6 bg-forest-300 rounded-full" />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* User Footer Profile & Logout */}
      <div className="p-3 border-t border-forest-700/60 bg-forest-900/40">
        {!collapsed ? (
          <div className="flex items-center justify-between gap-2 p-2 rounded-xl bg-forest-800/80 border border-forest-700/60">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-forest-600 flex items-center justify-center text-white shrink-0 font-bold text-xs uppercase border border-forest-400/30">
                {user?.name ? user.name.slice(0, 2) : 'AG'}
              </div>
              <div className="min-w-0">
                <span className="text-xs font-semibold text-white block truncate leading-tight">
                  {user?.name || 'Guest User'}
                </span>
                <span className="text-[10px] text-forest-300 block truncate flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3 text-forest-300 inline shrink-0" />
                  {user?.role || 'Farm Manager'}
                </span>
              </div>
            </div>

            <button
              onClick={logout}
              title="Logout"
              className="p-1.5 rounded-lg text-forest-300 hover:text-white hover:bg-forest-700 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <div
              className="w-8 h-8 rounded-lg bg-forest-600 flex items-center justify-center text-white font-bold text-xs uppercase"
              title={`${user?.name} (${user?.role})`}
            >
              <User className="w-4 h-4" />
            </div>
            <button
              onClick={logout}
              title="Logout"
              className="p-1.5 rounded-lg text-forest-300 hover:text-white hover:bg-forest-700 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:block shrink-0 transition-all duration-300 h-screen sticky top-0 z-30 ${
          collapsed ? 'w-20' : 'w-64'
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Backdrop & Drawer */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-forest-900/60 backdrop-blur-sm lg:hidden"
          onClick={onCloseMobile}
        />
      )}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-72 lg:hidden transform transition-transform duration-300 ease-in-out ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {sidebarContent}
      </div>
    </>
  );
};

