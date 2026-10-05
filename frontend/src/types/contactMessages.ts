export type ContactMessageStatus = "new" | "contacted" | "in_progress" | "closed";

export interface ContactMessageItem {
  id: number;
  reference: string;
  customerName: string;
  customerEmail: string;
  phone: string | null;
  subject: string | null;
  message: string;
  status: ContactMessageStatus;
  isRead: boolean;
  adminNotes: string | null;
  confirmationSentAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ContactMessageCounts {
  total: number;
  new: number;
  contacted: number;
  in_progress: number;
  closed: number;
  unread: number;
}

export interface ContactMessagePagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ContactMessageListResponse {
  success: boolean;
  data: ContactMessageItem[];
  pagination: ContactMessagePagination;
  counts: ContactMessageCounts;
  message?: string;
}

export interface ContactMessageDetailResponse {
  success: boolean;
  data: ContactMessageItem;
  message?: string;
}

export interface CreateContactMessagePayload {
  name: string;
  email: string;
  phone?: string | undefined;
  subject?: string | undefined;
  message: string;
  website?: string | undefined;
}


export interface CreateContactMessageResponse {
  success: boolean;
  message: string;
  data?: {
    id: number;
    reference: string;
  };
  errors?: Record<string, string>;
}

export interface UnifiedNotificationItem {
  type: "service_request" | "contact_message";
  id: number;
  name: string;
  title: string;
  createdAt: string;
}

export interface UnifiedNotificationsResponse {
  success: boolean;
  unreadCount: number;
  serviceRequestsUnread: number;
  contactMessagesUnread: number;
  latest: UnifiedNotificationItem[];
  message?: string;
}
