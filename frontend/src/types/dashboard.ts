export interface DailyCount {
  date: string; // YYYY-MM-DD
  count: number;
}

export interface ServiceCount {
  name: string;
  count: number;
}

export interface OverviewServiceRequests {
  total: number;
  unread: number;
  thisWeek: number;
  thisMonth: number;
  lastMonth: number;
  byStatus: {
    new: number;
    contacted: number;
    in_progress: number;
    closed: number;
  };
  byService: ServiceCount[];
  daily: DailyCount[];
}

export interface OverviewContactMessages {
  total: number;
  unread: number;
  thisWeek: number;
  thisMonth: number;
  lastMonth: number;
  daily: DailyCount[];
}

export interface OverviewEnquiries {
  thisMonth: number;
  lastMonth: number;
  changePercent: number | null;
}

export interface OverviewServices {
  total: number;
  active: number;
  hidden: number;
}

export interface OverviewRecentWorks {
  total: number;
  withCustomPhoto: number;
}

export interface OverviewActivityItem {
  type: "service_request" | "contact_message";
  id: number;
  name: string;
  email: string | null;
  phone: string | null;
  title: string;
  status: string;
  isRead: boolean;
  createdAt: string;
}

export interface OverviewSystemStatus {
  database: {
    connected: boolean;
    latencyMs: number | null;
  };
  emailConfigured: boolean;
  adminAlertsConfigured: boolean;
}

export interface OverviewData {
  serviceRequests: OverviewServiceRequests | null;
  contactMessages: OverviewContactMessages | null;
  enquiries: OverviewEnquiries | null;
  services: OverviewServices | null;
  recentWorks: OverviewRecentWorks | null;
  recentActivity: OverviewActivityItem[] | null;
  system: OverviewSystemStatus | null;
}

export interface OverviewApiResponse {
  success: boolean;
  generatedAt: string;
  data: OverviewData;
  warnings?: string[];
  message?: string;
}
