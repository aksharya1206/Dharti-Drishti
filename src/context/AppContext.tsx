import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  Farm,
  FarmTask,
  FarmResource,
  CropObservation,
  WeatherCondition,
  AgentRecommendation,
  AgentTimelineEvent,
  UserSession,
  UserRole,
} from '../types';
import {
  INITIAL_FARMS,
  INITIAL_RESOURCES,
  INITIAL_TASKS,
  INITIAL_WEATHER,
  INITIAL_OBSERVATIONS,
  INITIAL_RECOMMENDATIONS,
  INITIAL_TIMELINE,
} from '../data/initialData';
import { generateOperationsPlan, OperationsPlanResult } from '../data/plannerEngine';

export interface ToastMessage {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'warning' | 'info' | 'error';
}

export type PageId =
  | 'overview'
  | 'farm-network'
  | 'crop-health'
  | 'weather'
  | 'operations'
  | 'resources'
  | 'agent-centre'
  | 'simulator'
  | 'reports'
  | 'settings';

interface AppContextType {
  // Auth state
  user: UserSession | null;
  login: (email: string, role: UserRole, name?: string) => void;
  logout: () => void;

  // Navigation
  activePage: PageId;
  setActivePage: (page: PageId) => void;
  selectedFarmId: string | null;
  setSelectedFarmId: (farmId: string | null) => void;

  // Core Data
  farms: Farm[];
  addFarm: (farm: Omit<Farm, 'id' | 'lastUpdated'>) => void;
  updateFarm: (farm: Farm) => void;

  tasks: FarmTask[];
  addTask: (task: Omit<FarmTask, 'id'>) => void;
  updateTask: (task: FarmTask) => void;
  markTaskCompleted: (taskId: string) => void;
  rescheduleTask: (taskId: string, date: string, start: string, end: string) => void;

  resources: FarmResource[];
  resolveConflict: (resourceId: string, resolutionType: 'auxiliary' | 'reschedule') => void;

  weatherMap: Record<string, WeatherCondition>;
  selectedDistrict: string;
  setSelectedDistrict: (district: string) => void;

  observations: CropObservation[];
  addObservation: (obs: Omit<CropObservation, 'id'>) => void;

  recommendations: AgentRecommendation[];
  approveRecommendation: (id: string) => void;
  rejectRecommendation: (id: string) => void;

  timeline: AgentTimelineEvent[];

  // Operations Planning Engine
  isGeneratingPlan: boolean;
  planResult: OperationsPlanResult | null;
  runPlanEngine: () => void;
  applyProposedPlan: () => void;
  clearPlanResult: () => void;

  // What-If Simulator
  activeScenarioId: string | null;
  simulationResult: {
    title: string;
    description: string;
    impactSummary: string;
    originalTasks: FarmTask[];
    simulatedTasks: FarmTask[];
    explanations: string[];
    conflictsRemaining: number;
    tasksRescheduled: number;
  } | null;
  runSimulation: (scenarioId: string) => void;
  resetSimulation: () => void;

  // Search & Filters
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Toast
  toasts: ToastMessage[];
  showToast: (title: string, message: string, type?: ToastMessage['type']) => void;
  dismissToast: (id: string) => void;

  // Utilities
  resetAllDemoData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Auth state - check localStorage for existing session
  const [user, setUser] = useState<UserSession | null>(() => {
    try {
      const stored = localStorage.getItem('adaptive_farm_user');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      // ignore
    }
    return null;
  });

  const [activePage, setActivePage] = useState<PageId>('overview');
  const [selectedFarmId, setSelectedFarmId] = useState<string | null>(null);

  // Entities
  const [farms, setFarms] = useState<Farm[]>(() => {
    try {
      const stored = localStorage.getItem('adaptive_farms_data');
      return stored ? JSON.parse(stored) : INITIAL_FARMS;
    } catch {
      return INITIAL_FARMS;
    }
  });

  const [tasks, setTasks] = useState<FarmTask[]>(() => {
    try {
      const stored = localStorage.getItem('adaptive_tasks_data');
      return stored ? JSON.parse(stored) : INITIAL_TASKS;
    } catch {
      return INITIAL_TASKS;
    }
  });

  const [resources, setResources] = useState<FarmResource[]>(() => {
    try {
      const stored = localStorage.getItem('adaptive_resources_data');
      return stored ? JSON.parse(stored) : INITIAL_RESOURCES;
    } catch {
      return INITIAL_RESOURCES;
    }
  });

  const [weatherMap] = useState<Record<string, WeatherCondition>>(INITIAL_WEATHER);
  const [selectedDistrict, setSelectedDistrict] = useState<string>('Sonipat');

  const [observations, setObservations] = useState<CropObservation[]>(() => {
    try {
      const stored = localStorage.getItem('adaptive_obs_data');
      return stored ? JSON.parse(stored) : INITIAL_OBSERVATIONS;
    } catch {
      return INITIAL_OBSERVATIONS;
    }
  });

  const [recommendations, setRecommendations] = useState<AgentRecommendation[]>(() => {
    try {
      const stored = localStorage.getItem('adaptive_recs_data');
      return stored ? JSON.parse(stored) : INITIAL_RECOMMENDATIONS;
    } catch {
      return INITIAL_RECOMMENDATIONS;
    }
  });

  const [timeline, setTimeline] = useState<AgentTimelineEvent[]>(INITIAL_TIMELINE);

  // Planning state
  const [isGeneratingPlan, setIsGeneratingPlan] = useState<boolean>(false);
  const [planResult, setPlanResult] = useState<OperationsPlanResult | null>(null);

  // Simulator state
  const [activeScenarioId, setActiveScenarioId] = useState<string | null>(null);
  const [simulationResult, setSimulationResult] = useState<AppContextType['simulationResult']>(null);

  // Search query
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Sync state to localStorage for demo persistence
  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem('adaptive_farm_user', JSON.stringify(user));
      } else {
        localStorage.removeItem('adaptive_farm_user');
      }
      localStorage.setItem('adaptive_farms_data', JSON.stringify(farms));
      localStorage.setItem('adaptive_tasks_data', JSON.stringify(tasks));
      localStorage.setItem('adaptive_resources_data', JSON.stringify(resources));
      localStorage.setItem('adaptive_obs_data', JSON.stringify(observations));
      localStorage.setItem('adaptive_recs_data', JSON.stringify(recommendations));
    } catch (e) {
      console.warn('Storage sync failed', e);
    }
  }, [user, farms, tasks, resources, observations, recommendations]);

  const showToast = (title: string, message: string, type: ToastMessage['type'] = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, title, message, type }]);
    setTimeout(() => {
      dismissToast(id);
    }, 4500);
  };

  const dismissToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const login = (email: string, role: UserRole, name?: string) => {
    const fallbackName =
      role === 'Farm Owner'
        ? 'Rajinder Singh'
        : role === 'Agricultural Consultant'
        ? 'Dr. Meenakshi Sharma'
        : 'Vikram Choudhary';

    const newUser: UserSession = {
      name: name || fallbackName,
      email: email,
      role: role,
      avatarUrl: `https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80`,
      isAuthenticated: true,
      demoMode: true,
    };
    setUser(newUser);
    showToast('Signed in successfully', `Welcome back, ${newUser.name} (${newUser.role})!`, 'success');
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('adaptive_farm_user');
    showToast('Logged out', 'You have been safely signed out.', 'info');
  };

  const addFarm = (farmData: Omit<Farm, 'id' | 'lastUpdated'>) => {
    const id = `farm-${Date.now()}`;
    const newFarm: Farm = {
      ...farmData,
      id,
      lastUpdated: 'Just now',
    };
    setFarms(prev => [newFarm, ...prev]);
    showToast('Farm Added', `${newFarm.name} has been enrolled into the network.`, 'success');
  };

  const updateFarm = (updatedFarm: Farm) => {
    setFarms(prev => prev.map(f => (f.id === updatedFarm.id ? { ...updatedFarm, lastUpdated: 'Just now' } : f)));
    showToast('Farm Updated', `Configuration saved for ${updatedFarm.name}.`, 'success');
  };

  const addTask = (taskData: Omit<FarmTask, 'id'>) => {
    const id = `task-${Date.now()}`;
    const newTask: FarmTask = {
      ...taskData,
      id,
    };
    setTasks(prev => [newTask, ...prev]);
    showToast('Task Created', `Scheduled "${newTask.title}" for ${newTask.farmName}.`, 'success');
  };

  const updateTask = (updatedTask: FarmTask) => {
    setTasks(prev => prev.map(t => (t.id === updatedTask.id ? updatedTask : t)));
    showToast('Task Updated', `Saved changes to "${updatedTask.title}".`, 'success');
  };

  const markTaskCompleted = (taskId: string) => {
    setTasks(prev =>
      prev.map(t => (t.id === taskId ? { ...t, status: 'Completed' } : t))
    );
    showToast('Task Completed', 'Task marked as successfully executed.', 'success');
  };

  const rescheduleTask = (taskId: string, date: string, start: string, end: string) => {
    setTasks(prev =>
      prev.map(t => (t.id === taskId ? { ...t, scheduledDate: date, startTime: start, endTime: end, status: 'Rescheduled' } : t))
    );
    showToast('Task Rescheduled', `Updated operation window to ${start} - ${end}.`, 'info');
  };

  const resolveConflict = (_resourceId: string, resolutionType: 'auxiliary' | 'reschedule') => {
    if (resolutionType === 'auxiliary') {
      // Substitute Diesel Auxiliary Pump #2 for task-b2
      setTasks(prev =>
        prev.map(t => {
          if (t.id === 'task-b2') {
            return {
              ...t,
              resourceRequiredId: 'res-pump-2',
              resourceName: 'Diesel Auxiliary Pump #2 (Depot B)',
              hasConflict: false,
              notes: 'Resolved via substitution with auxiliary unit from Depot B.',
            };
          }
          if (t.id === 'task-a1') {
            return {
              ...t,
              hasConflict: false,
              notes: 'Resource conflict resolved; Solar Pump #1 dedicated exclusively.',
            };
          }
          return t;
        })
      );

      setResources(prev =>
        prev.map(r => {
          if (r.id === 'res-pump-1') {
            return {
              ...r,
              status: 'In Use',
              assignedFarmId: 'farm-a',
              assignedFarmName: 'Farm A (Sonipat)',
            };
          }
          if (r.id === 'res-pump-2') {
            return {
              ...r,
              status: 'Reserved',
              assignedFarmId: 'farm-b',
              assignedFarmName: 'Farm B (Karnal)',
              assignedTaskId: 'task-b2',
              currentAssignmentTime: '11:00 - 14:00',
            };
          }
          return r;
        })
      );

      // Approve recommendation-2 automatically if present
      setRecommendations(prev =>
        prev.map(rec => (rec.id === 'rec-2' ? { ...rec, status: 'Approved' } : rec))
      );

      showToast(
        'Conflict Resolved',
        'Diesel Auxiliary Pump #2 assigned to Farm B. Solar Pump #1 locked for Farm A.',
        'success'
      );
    } else {
      // Reschedule Farm B after Farm A
      setTasks(prev =>
        prev.map(t => {
          if (t.id === 'task-b2') {
            return {
              ...t,
              startTime: '14:30',
              endTime: '17:30',
              hasConflict: false,
              notes: 'Delayed to 14:30 to allow 1.5h pump transit from Sonipat to Karnal.',
            };
          }
          if (t.id === 'task-a1') {
            return { ...t, hasConflict: false };
          }
          return t;
        })
      );
      showToast('Conflict Resolved', 'Farm B fertigation shifted to 14:30 after transit.', 'success');
    }
  };

  const addObservation = (obsData: Omit<CropObservation, 'id'>) => {
    const newObs: CropObservation = {
      ...obsData,
      id: `obs-${Date.now()}`,
    };
    setObservations(prev => [newObs, ...prev]);

    // Add timeline event
    const newTimelineEvent: AgentTimelineEvent = {
      id: `ev-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'Risk Detected',
      title: `Field Concern: ${newObs.symptom}`,
      description: `Reported on ${newObs.farmName} (${newObs.crop}) with ${newObs.severity} severity.`,
      badge: 'Crop Health',
      farmName: newObs.farmName,
    };
    setTimeline(prev => [newTimelineEvent, ...prev]);

    showToast('Observation Recorded', `Logged symptom for ${newObs.farmName}. Agent evaluated priority.`, 'info');
  };

  const approveRecommendation = (id: string) => {
    setRecommendations(prev =>
      prev.map(r => (r.id === id ? { ...r, status: 'Approved' } : r))
    );

    const rec = recommendations.find(r => r.id === id);
    if (rec) {
      if (rec.id === 'rec-1') {
        // Move task-a2
        rescheduleTask('task-a2', '2026-10-29', '07:30', '10:00');
      } else if (rec.id === 'rec-2') {
        resolveConflict('res-pump-1', 'auxiliary');
      }

      setTimeline(prev => [
        {
          id: `ev-app-${Date.now()}`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          type: 'Action Approved',
          title: `Operator Approved: ${rec.title}`,
          description: `Action applied to farm operational schedule with transparent verification.`,
          badge: 'Confirmed Plan',
        },
        ...prev,
      ]);
    }

    showToast('Recommendation Approved', 'Agent proposed changes have been applied to the operations schedule.', 'success');
  };

  const rejectRecommendation = (id: string) => {
    setRecommendations(prev =>
      prev.map(r => (r.id === id ? { ...r, status: 'Rejected' } : r))
    );
    showToast('Recommendation Rejected', 'Proposal dismissed. Original operational schedule retained.', 'warning');
  };

  const runPlanEngine = () => {
    setIsGeneratingPlan(true);
    setTimeout(() => {
      const result = generateOperationsPlan(tasks, resources, weatherMap);
      setPlanResult(result);
      setIsGeneratingPlan(false);
      showToast('Operations Plan Generated', `Optimised ${result.changes.length} tasks and resolved conflicts.`, 'success');
    }, 1200);
  };

  const applyProposedPlan = () => {
    if (!planResult) return;
    setTasks(planResult.revisedTasks);

    // Also update resource status
    setResources(prev =>
      prev.map(r => {
        if (r.id === 'res-pump-1') return { ...r, status: 'In Use' };
        if (r.id === 'res-pump-2') return { ...r, status: 'Reserved', assignedFarmName: 'Farm B (Karnal)' };
        return r;
      })
    );

    // Update recommendation statuses
    setRecommendations(prev =>
      prev.map(r => (r.status === 'Pending' ? { ...r, status: 'Approved' } : r))
    );

    // Trigger celebratory confetti for hackathon wow effect
    try {
      confetti({
        particleCount: 90,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#173F35', '#2F6B4F', '#82A96B', '#D99A35'],
      });
    } catch {
      // ignore
    }

    setTimeline(prev => [
      {
        id: `ev-opt-${Date.now()}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        type: 'Schedule Proposed',
        title: 'Full Operations Plan Approved & Active',
        description: `Operator confirmed revised schedule: weather-delay on Farm A and auxiliary pump substitution on Farm B.`,
        badge: 'Optimized Plan',
      },
      ...prev,
    ]);

    showToast(
      'Schedule Confirmed!',
      'All revised operation windows and equipment allocations are now active across your farm network.',
      'success'
    );
    setPlanResult(null);
  };

  const clearPlanResult = () => {
    setPlanResult(null);
  };

  const runSimulation = (scenarioId: string) => {
    setActiveScenarioId(scenarioId);

    if (scenarioId === 'rain-risk-conflict') {
      // Core Hackathon Scenario: Rain Risk + Shared Equipment Conflict
      const simTasks: FarmTask[] = tasks.map(t => {
        if (t.id === 'task-a2') {
          return {
            ...t,
            scheduledDate: '2026-10-29',
            startTime: '07:30',
            endTime: '10:00',
            status: 'Rescheduled',
            weatherRiskTag: 'Rescheduled to dry morning window (Rain Risk avoided)',
            notes: 'Simulated adjustment: shifted away from 14:00 rain surge to ensure chemical efficacy.',
          };
        }
        if (t.id === 'task-b2') {
          return {
            ...t,
            resourceRequiredId: 'res-pump-2',
            resourceName: 'Diesel Auxiliary Pump #2 (Depot B)',
            hasConflict: false,
            notes: 'Simulated adjustment: reallocated from congested Solar Pump #1 to available Auxiliary Pump #2.',
          };
        }
        if (t.id === 'task-a1') {
          return { ...t, hasConflict: false };
        }
        return t;
      });

      setSimulationResult({
        title: 'Demonstration Scenario: Rain Risk + Shared Equipment Conflict',
        description:
          'Evaluates convective precipitation storm front over Sonipat at 14:00 combined with double-booking on Solar Booster Pump #1 between Sonipat and Karnal.',
        impactSummary:
          '2 critical adjustments proposed: 1 weather deferral (saving spray chemical) and 1 auxiliary machinery substitution (clearing pump bottleneck).',
        originalTasks: tasks,
        simulatedTasks: simTasks,
        explanations: [
          'Sonipat Rain Threat: Foliar Spray (Farm A) shifted to tomorrow 07:30 to prevent 80% chemical dilution from storm.',
          'Geographical Pump Conflict: Solar Pump #1 cannot physically serve Farm A and Farm B simultaneously (52 km distance). Diesel Auxiliary Pump #2 substituted for Farm B.',
          'Critical Aphid Treatment: Farm B aphid containment kept at 09:00 with Team Alpha (unimpeded).',
        ],
        conflictsRemaining: 0,
        tasksRescheduled: 2,
      });
    } else if (scenarioId === 'pump-failure') {
      // Pump #1 breaks down
      const simTasks: FarmTask[] = tasks.map(t => {
        if (t.id === 'task-a1') {
          return {
            ...t,
            resourceRequiredId: 'res-pump-2',
            resourceName: 'Diesel Auxiliary Pump #2',
            notes: 'Reassigned to Auxiliary Pump #2 following Solar Pump failure.',
          };
        }
        if (t.id === 'task-b2') {
          return {
            ...t,
            scheduledDate: '2026-10-29',
            startTime: '08:00',
            endTime: '11:00',
            status: 'Delayed',
            notes: 'Deferred to tomorrow due to single available pump bottleneck.',
          };
        }
        return t;
      });

      setSimulationResult({
        title: 'What-If: Solar Booster Pump #1 Breakdown',
        description: 'Simulates sudden mechanical inverter failure on primary solar submersible pump.',
        impactSummary: 'Farm A given auxiliary pump priority. Farm B fertigation queued for next daylight cycle.',
        originalTasks: tasks,
        simulatedTasks: simTasks,
        explanations: [
          'Farm A Wheat requires immediate water to prevent tillering stall (higher acreage impact).',
          'Farm B Drip fertigation delayed 20 hours; soil sensor indicates moisture level remains above 38% wilting limit.',
        ],
        conflictsRemaining: 0,
        tasksRescheduled: 2,
      });
    } else {
      // Team Alpha absent
      const simTasks: FarmTask[] = tasks.map(t => {
        if (t.id === 'task-b1') {
          return {
            ...t,
            assignedTeam: 'Field Operations Team Beta (Reassigned)',
            notes: 'Emergency reassignment of Team Beta to handle urgent aphid containment.',
          };
        }
        if (t.id === 'task-c3') {
          return {
            ...t,
            status: 'Delayed',
            scheduledDate: '2026-10-29',
            notes: 'Urea top-dressing postponed 24h due to labor reallocation to aphid emergency.',
          };
        }
        return t;
      });

      setSimulationResult({
        title: 'What-If: Team Alpha Absent / Unavailable',
        description: 'Simulates labor shortage where 4 crew members of Field Team Alpha are unavailable.',
        impactSummary: 'Team Beta redirected to high-urgency aphid treatment; low-risk top-dressing deferred.',
        originalTasks: tasks,
        simulatedTasks: simTasks,
        explanations: [
          'Team Beta mobilized to Farm B to protect flowering mustard against aphid damage.',
          'Farm C Urea split postponed by 1 day without measurable grain yield degradation.',
        ],
        conflictsRemaining: 0,
        tasksRescheduled: 2,
      });
    }

    showToast('Simulation Computed', 'Evaluated multi-farm constraints and generated alternative schedule diff.', 'info');
  };

  const resetSimulation = () => {
    setActiveScenarioId(null);
    setSimulationResult(null);
    showToast('Simulation Reset', 'Restored live operations view.', 'info');
  };

  const resetAllDemoData = () => {
    setFarms(INITIAL_FARMS);
    setTasks(INITIAL_TASKS);
    setResources(INITIAL_RESOURCES);
    setObservations(INITIAL_OBSERVATIONS);
    setRecommendations(INITIAL_RECOMMENDATIONS);
    setTimeline(INITIAL_TIMELINE);
    setPlanResult(null);
    setSimulationResult(null);
    setActiveScenarioId(null);
    try {
      localStorage.removeItem('adaptive_farms_data');
      localStorage.removeItem('adaptive_tasks_data');
      localStorage.removeItem('adaptive_resources_data');
      localStorage.removeItem('adaptive_obs_data');
      localStorage.removeItem('adaptive_recs_data');
    } catch {
      // ignore
    }
    showToast('Reset Complete', 'Restored initial demonstration state for all farms, tasks, and agents.', 'info');
  };

  return (
    <AppContext.Provider
      value={{
        user,
        login,
        logout,
        activePage,
        setActivePage,
        selectedFarmId,
        setSelectedFarmId,
        farms,
        addFarm,
        updateFarm,
        tasks,
        addTask,
        updateTask,
        markTaskCompleted,
        rescheduleTask,
        resources,
        resolveConflict,
        weatherMap,
        selectedDistrict,
        setSelectedDistrict,
        observations,
        addObservation,
        recommendations,
        approveRecommendation,
        rejectRecommendation,
        timeline,
        isGeneratingPlan,
        planResult,
        runPlanEngine,
        applyProposedPlan,
        clearPlanResult,
        activeScenarioId,
        simulationResult,
        runSimulation,
        resetSimulation,
        searchQuery,
        setSearchQuery,
        toasts,
        showToast,
        dismissToast,
        resetAllDemoData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

