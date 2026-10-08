import {
  ContactMessageListResponse,
  ContactMessageDetailResponse,
  CreateContactMessagePayload,
  CreateContactMessageResponse,
  UnifiedNotificationsResponse,
} from "@/types/contactMessages";
import { toast } from "sonner";

function getApiBase(): string {
  return ((import.meta.env["VITE_API_URL"] as string) || (import.meta.env.DEV ? "http://localhost:5000" : "")).replace(/\/+$/, "");
}

function getAuthHeader(): Record<string, string> {
  const token =
    localStorage.getItem("hariputhran_token") ||
    sessionStorage.getItem("hariputhran_token");
  if (!token) return {};
  return { Authorization: `Bearer ${token}` };
}

function handle401() {
  localStorage.removeItem("hariputhran_token");
  localStorage.removeItem("hariputhran_user");
  sessionStorage.removeItem("hariputhran_token");
  sessionStorage.removeItem("hariputhran_user");
  toast.error("Session expired, please sign in again");
  if (typeof window !== "undefined" && !window.location.pathname.startsWith("/login")) {
    window.location.href = "/login";
  }
}

/**
 * Public: Submit contact form message
 */
export async function submitContactMessage(
  payload: CreateContactMessagePayload
): Promise<CreateContactMessageResponse> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 20000);

  try {
    const res = await fetch(`${getApiBase()}/api/contact-messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    const data = await res.json().catch(() => {
      throw new Error(`Server returned unexpected format (${res.status})`);
    });

    if (res.status === 429) {
      return {
        success: false,
        message: "Too many requests. Please try again later.",
      };
    }

    if (!res.ok) {
      return {
        success: false,
        message: data.message || "Please correct the highlighted errors.",
        errors: data.errors,
      };
    }

    return data;
  } catch (err: any) {
    if (err.name === "AbortError") {
      throw new Error("Request timed out. Please check your connection and try again.");
    }
    throw err;
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * Admin: Fetch contact messages with filters
 */
export async function fetchAdminContactMessages(params?: {
  page?: number;
  limit?: number;
  status?: string;
  q?: string;
  unread?: boolean;
}): Promise<ContactMessageListResponse> {
  const query = new URLSearchParams();
  if (params?.page) query.set("page", String(params.page));
  if (params?.limit) query.set("limit", String(params.limit));
  if (params?.status && params.status !== "all") query.set("status", params.status);
  if (params?.q && params.q.trim()) query.set("q", params.q.trim());
  if (params?.unread) query.set("unread", "true");

  const res = await fetch(`${getApiBase()}/api/admin/contact-messages?${query.toString()}`, {
    headers: {
      ...getAuthHeader(),
      Pragma: "no-cache",
      "Cache-Control": "no-cache",
    },
  });

  if (res.status === 401) {
    handle401();
    throw new Error("Unauthorized");
  }

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || `Failed to fetch messages (${res.status})`);
  }

  return res.json();
}

/**
 * Admin: Get single contact message by ID
 */
export async function fetchAdminContactMessageById(id: number): Promise<ContactMessageDetailResponse> {
  const res = await fetch(`${getApiBase()}/api/admin/contact-messages/${id}`, {
    headers: {
      ...getAuthHeader(),
    },
  });

  if (res.status === 401) {
    handle401();
    throw new Error("Unauthorized");
  }

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || `Failed to fetch message (${res.status})`);
  }

  return res.json();
}

/**
 * Admin: Update status / notes / isRead
 */
export async function updateAdminContactMessage(
  id: number,
  updates: { status?: string; adminNotes?: string | null; isRead?: boolean }
): Promise<ContactMessageDetailResponse> {
  const res = await fetch(`${getApiBase()}/api/admin/contact-messages/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    },
    body: JSON.stringify(updates),
  });

  if (res.status === 401) {
    handle401();
    throw new Error("Unauthorized");
  }

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || `Failed to update message (${res.status})`);
  }

  return res.json();
}

/**
 * Admin: Delete contact message
 */
export async function deleteAdminContactMessage(id: number): Promise<{ success: boolean; message?: string }> {
  const res = await fetch(`${getApiBase()}/api/admin/contact-messages/${id}`, {
    method: "DELETE",
    headers: {
      ...getAuthHeader(),
    },
  });

  if (res.status === 401) {
    handle401();
    throw new Error("Unauthorized");
  }

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || `Failed to delete message (${res.status})`);
  }

  return res.json();
}

/**
 * Admin: Mark all contact messages read
 */
export async function markAllContactMessagesAsRead(): Promise<{ success: boolean; message?: string }> {
  const res = await fetch(`${getApiBase()}/api/admin/contact-messages/read-all`, {
    method: "PATCH",
    headers: {
      ...getAuthHeader(),
    },
  });

  if (res.status === 401) {
    handle401();
    throw new Error("Unauthorized");
  }

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || `Failed to mark all as read (${res.status})`);
  }

  return res.json();
}

/**
 * Admin: Unified Notifications
 */
export async function fetchUnifiedNotifications(): Promise<UnifiedNotificationsResponse> {
  const res = await fetch(`${getApiBase()}/api/admin/notifications`, {
    headers: {
      ...getAuthHeader(),
      Pragma: "no-cache",
      "Cache-Control": "no-cache",
    },
  });

  if (res.status === 401) {
    handle401();
    throw new Error("Unauthorized");
  }

  if (!res.ok) {
    // Fallback: If /api/admin/notifications fails or is not found, fallback to /api/admin/service-requests/notifications
    const fallbackRes = await fetch(`${getApiBase()}/api/admin/service-requests/notifications`, {
      headers: {
        ...getAuthHeader(),
        Pragma: "no-cache",
        "Cache-Control": "no-cache",
      },
    });

    if (fallbackRes.ok) {
      const fbData = await fallbackRes.json();
      return {
        success: true,
        unreadCount: fbData.unreadCount || 0,
        serviceRequestsUnread: fbData.unreadCount || 0,
        contactMessagesUnread: 0,
        latest: (fbData.latest || []).map((item: any) => ({
          type: "service_request",
          id: item.id,
          name: item.customerName,
          title: item.serviceName,
          createdAt: item.createdAt,
        })),
      };
    }

    throw new Error(`Failed to fetch notifications (${res.status})`);
  }

  return res.json();
}

/**
 * Admin: Mark all unified notifications as read
 */
export async function markAllUnifiedNotificationsAsRead(): Promise<UnifiedNotificationsResponse> {
  const res = await fetch(`${getApiBase()}/api/admin/notifications/read-all`, {
    method: "PATCH",
    headers: {
      ...getAuthHeader(),
    },
  });

  if (res.status === 401) {
    handle401();
    throw new Error("Unauthorized");
  }

  if (!res.ok) {
    throw new Error(`Failed to mark notifications read (${res.status})`);
  }

  return res.json();
}
