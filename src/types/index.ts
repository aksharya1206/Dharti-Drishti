export type FarmHealthStatus = 'Healthy' | 'Needs Attention' | 'At Risk';
export type FarmOperationalStatus = 'Active' | 'Scheduled' | 'Idle' | 'Maintenance';
export type TaskPriority = 'Critical' | 'High' | 'Medium' | 'Low';
export type TaskStatus = 'Scheduled' | 'In Progress' | 'Completed' | 'Delayed' | 'Rescheduled';
export type ResourceType = 'Water Pump' | 'Tractor' | 'Harvester' | 'Sprayer' | 'Field Team';
export type UserRole = 'Farm Owner' | 'Farm Manager' | 'Agricultural Consultant';

export interface Farm {
  id: string;
  name: string;
  location: string;
  district: string;
  state: string;
  areaAcres: number;
  cropType: string;
  variety?: string;
  healthStatus: FarmHealthStatus;
  operationalStatus: FarmOperationalStatus;
  plantingDate: string;
  irrigationType: 'Drip' | 'Canal / Flood' | 'Sprinkler' | 'Borewell';
  soilType: string;
  notes?: string;
  lastUpdated: string;
}

export interface FarmTask {
  id: string;
  title: string;
  farmId: string;
  farmName: string;
  crop: string;
  priority: TaskPriority;
  priorityReason: string;
  status: TaskStatus;
  scheduledDate: string;
  startTime: string; // HH:mm
  endTime: string;   // HH:mm
  durationHours: number;
  resourceRequiredId: string;
  resourceName: string;
  assignedTeam: string;
  weatherRiskTag?: string; // e.g. "Rain Risk at 14:00"
  hasConflict?: boolean;
  notes?: string;
}

export interface FarmResource {
  id: string;
  name: string;
  type: ResourceType;
  model: string;
  status: 'Available' | 'In Use' | 'Reserved' | 'Maintenance' | 'Conflict';
  assignedFarmId?: string;
  assignedFarmName?: string;
  assignedTaskId?: string;
  currentAssignmentTime?: string;
  location: string;
  sharedAcross: string[];
}

export interface CropObservation {
  id: string;
  farmId: string;
  farmName: string;
  crop: string;
  date: string;
  symptom: string;
  severity: 'Mild' | 'Moderate' | 'Severe';
  description: string;
  imageUrl?: string;
  recommendedAction: string;
  source: 'Demo Rule Heuristic' | 'Manual Field Scouting';
}

export interface WeatherCondition {
  district: string;
  temperature: number;
  feelsLike: number;
  humidity: number;
  rainProbability: number;
  windSpeed: number; // km/h
  weatherCondition: 'Clear Sunny' | 'Scattered Clouds' | 'High Rain Risk' | 'Overcast' | 'Heavy Thunderstorm';
  riskLevel: 'Low' | 'Moderate' | 'High' | 'Severe';
  riskDescription: string;
  hourlyForecast: {
    time: string;
    temp: number;
    rainProb: number;
    wind: number;
    risk: 'Low' | 'Moderate' | 'High';
  }[];
  forecastDays: {
    day: string;
    tempMax: number;
    tempMin: number;
    condition: string;
    rainProb: number;
  }[];
}

export interface AgentRecommendation {
  id: string;
  title: string;
  category: 'Weather Reallocation' | 'Resource Conflict Resolution' | 'Crop Health Priority' | 'Resource Sharing';
  urgency: 'Immediate' | 'Upcoming' | 'Optimisation';
  farmsAffected: string[];
  tasksAffected: string[];
  triggerReason: string;
  whyItMatters: string;
  proposedAction: string;
  expectedOutcome: string;
  constraintsConsidered: string[];
  rejectionImpact: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  timestamp: string;
}

export interface AgentTimelineEvent {
  id: string;
  timestamp: string;
  type: 'Risk Detected' | 'Conflict Flagged' | 'Priority Adjusted' | 'Schedule Proposed' | 'Action Approved';
  title: string;
  description: string;
  badge: string;
  farmName?: string;
}

export interface WhatIfScenario {
  id: string;
  name: string;
  description: string;
  triggerCondition: string;
  affectedFarms: string[];
  conflictsCreated: number;
  tasksRescheduled: number;
  engineExplanation: string[];
}

export interface UserSession {
  name: string;
  email: string;
  role: UserRole;
  avatarUrl: string;
  isAuthenticated: boolean;
  demoMode: boolean;
}

