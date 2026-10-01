export type ServiceRequestStatus = "new" | "contacted" | "in_progress" | "closed";

export interface ServiceRequestItem {
  id: number;
  reference: string;
  serviceId: number | null;
  serviceName: string;
  customerName: string;
  customerEmail: string | null;
  phone: string;
  message: string | null;
  status: ServiceRequestStatus;
  isRead: boolean;
  adminNotes: string | null;
  confirmationSentAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ServiceRequestCounts {
  total: number;
  new: number;
  contacted: number;
  in_progress: number;
  closed: number;
  unread: number;
}

export interface ServiceRequestPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ServiceRequestsResponse {
  success: boolean;
  data: ServiceRequestItem[];
  pagination: ServiceRequestPagination;
  counts: ServiceRequestCounts;
  message?: string;
}

export interface ServiceRequestSingleResponse {
  success: boolean;
  data: ServiceRequestItem;
  message?: string;
}

export interface NotificationItem {
  id: number;
  customerName: string;
  serviceName: string;
  createdAt: string;
}

export interface NotificationsResponse {
  success: boolean;
  unreadCount: number;
  latest: NotificationItem[];
  message?: string;
}

export interface CreateServiceRequestPayload {
  serviceId?: number | string | null;
  serviceName: string;
  name: string;
  email: string;
  phone: string;
  message?: string;
  website?: string; // honeypot
}

export interface CreateServiceRequestResponse {
  success: boolean;
  message: string;
  data?: {
    id: number;
    serviceName: string;
  };
  errors?: Record<string, string>;
}
