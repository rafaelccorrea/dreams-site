// Types for Match Performance Dashboard API

export interface PerformancePeriod {
  start: string;
  end: string;
}

export interface IgnoreReason {
  reason: string;
  count: number;
}

export interface UserPerformance {
  userId: string;
  userName: string;
  userAvatar?: string;
  totalMatches: number;
  pendingMatches: number;
  acceptedMatches: number;
  ignoredMatches: number;
  acceptanceRate: number;
  avgAcceptedScore: number;
  avgIgnoredScore: number;
  tasksCreatedFromMatches: number;
  tasksCompletedFromMatches: number;
  taskCompletionRate: number;
  avgResponseTime: number;
  topIgnoreReasons: IgnoreReason[];
  period: PerformancePeriod;
}

export interface TeamPerformance {
  teamId: string;
  teamName: string;
  memberCount: number;
  totalMatches: number;
  pendingMatches: number;
  acceptedMatches: number;
  ignoredMatches: number;
  acceptanceRate: number;
  avgMatchScore: number;
  members: UserPerformance[];
  topPerformer?: {
    userId: string;
    userName: string;
    acceptedMatches: number;
    acceptanceRate: number;
  };
  period: PerformancePeriod;
}

export interface ComparisonUser {
  userId: string;
  userName: string;
  value: number;
  rank: number;
}

export interface ComparisonMetric {
  metric: string;
  users: ComparisonUser[];
}

export interface BestInCategory {
  acceptanceRate: {
    userId: string;
    userName: string;
    value: number;
  };
  avgScore: {
    userId: string;
    userName: string;
    value: number;
  };
  tasksCompleted: {
    userId: string;
    userName: string;
    value: number;
  };
  responseTime: {
    userId: string;
    userName: string;
    value: number;
  };
}

export interface UsersComparisonResponse {
  users: UserPerformance[];
  comparison: ComparisonMetric[];
  bestIn: BestInCategory;
  period: PerformancePeriod;
}

export interface ComparisonTeam {
  teamId: string;
  teamName: string;
  value: number;
  rank: number;
}

export interface TeamComparisonMetric {
  metric: string;
  teams: ComparisonTeam[];
}

export interface BestTeam {
  acceptanceRate: {
    teamId: string;
    teamName: string;
    value: number;
  };
  avgScore: {
    teamId: string;
    teamName: string;
    value: number;
  };
  totalMatches: {
    teamId: string;
    teamName: string;
    value: number;
  };
}

export interface TeamsComparisonResponse {
  teams: TeamPerformance[];
  comparison: TeamComparisonMetric[];
  bestTeam: BestTeam;
  sharedUsers?: Array<{
    userId: string;
    userName: string;
    teams: string[];
    totalSales: number;
    totalRentals: number;
    assignedTo?: string;
  }>;
  period?: {
    start: string;
    end: string;
  };
}

export interface CompanyStats {
  totalMatches: number;
  pendingMatches: number;
  acceptedMatches: number;
  ignoredMatches: number;
  avgAcceptanceRate: number;
  avgMatchScore: number;
  totalTasksCreated: number;
  totalTasksCompleted: number;
}

export interface DashboardPerformanceResponse {
  companyStats: CompanyStats;
  topPerformers: UserPerformance[];
  teamPerformance: TeamPerformance[];
  period: PerformancePeriod;
  generatedAt: string;
}

// Request types
export interface CompareUsersRequest {
  userIds: string[];
  startDate?: string;
  endDate?: string;
}

export interface CompareTeamsRequest {
  teamIds: string[];
  startDate?: string;
  endDate?: string;
}

export interface PerformanceQueryParams {
  startDate?: string;
  endDate?: string;
}

// Period presets
export type PeriodPreset =
  | '7days'
  | '30days'
  | 'thisMonth'
  | 'lastMonth'
  | 'thisYear'
  | 'custom';

export interface PeriodConfig {
  start: Date;
  end: Date;
}

// Badge types for gamification
export interface UserBadges {
  acceptanceKing: boolean; // >= 90% acceptance rate
  fastResponder: boolean; // <= 2h avg response time
  taskMaster: boolean; // >= 85% task completion
  qualityPicker: boolean; // >= 80 avg accepted score
}
