import {
  ServiceRequestsResponse,
  ServiceRequestSingleResponse,
  NotificationsResponse,
  ServiceRequestStatus,
  ServiceRequestItem,
} from "@/types/serviceRequests";

const API_BASE_URL = (
  (import.meta.env["VITE_API_URL"] as string) ||
  (import.meta.env.DEV ? "http://localhost:5000" : "")
).replace(/\/+$/, "");
const TIMEOUT_MS = 20000;

function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  return (
    localStorage.getItem("hariputhran_token") ||
    sessionStorage.getItem("hariputhran_token") ||
    null
  );
}

function handle401SessionExpiry() {
  if (typeof window === "undefined") return;
  localStorage.removeItem("hariputhran_token");
  localStorage.removeItem("hariputhran_user");
  sessionStorage.removeItem("hariputhran_token");
  sessionStorage.removeItem("hariputhran_user");
  window.dispatchEvent(new Event("hariputhran_session_expired"));
}

async function apiFetch<T>(url: string, options: RequestInit = {}): Promise<T> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });

    if (response.status === 401) {
      handle401SessionExpiry();
      const errBody = await response.json().catch(() => ({}));
      throw new Error(errBody.message || "Session expired. Please sign in again.");
    }

    const data = await response.json().catch(() => {
      throw new Error(`Invalid response from server (HTTP ${response.status})`);
    });

    if (!response.ok) {
      throw new Error(data.message || `Request failed with status ${response.status}`);
    }

    return data as T;
  } catch (err: any) {
    if (err.name === "AbortError") {
      throw new Error("Request timed out. Please check your network connection.");
    }
    throw err;
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * 1. GET /api/admin/service-requests
 */
export async function fetchAdminServiceRequests(params: {
  page?: number;
  limit?: number;
  status?: string;
  service?: string;
  q?: string;
  unread?: boolean;
}): Promise<ServiceRequestsResponse> {
  const token = getAuthToken();
  if (!token) {
    handle401SessionExpiry();
    throw new Error("Authentication required. Please sign in.");
  }

  const searchParams = new URLSearchParams();
  if (params.page) searchParams.set("page", String(params.page));
  if (params.limit) searchParams.set("limit", String(params.limit));
  if (params.status && params.status !== "all") searchParams.set("status", params.status);
  if (params.service && params.service !== "all") searchParams.set("service", params.service);
  if (params.q && params.q.trim()) searchParams.set("q", params.q.trim());
  if (params.unread) searchParams.set("unread", "true");

  return apiFetch<ServiceRequestsResponse>(
    `${API_BASE_URL}/api/admin/service-requests?${searchParams.toString()}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    }
  );
}

/**
 * 2. GET /api/admin/service-requests/notifications
 */
export async function fetchServiceRequestNotifications(): Promise<NotificationsResponse> {
  const token = getAuthToken();
  if (!token) {
    handle401SessionExpiry();
    throw new Error("Authentication required. Please sign in.");
  }

  return apiFetch<NotificationsResponse>(
    `${API_BASE_URL}/api/admin/service-requests/notifications`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    }
  );
}

/**
 * 3. PATCH /api/admin/service-requests/read-all
 */
export async function markAllServiceRequestsAsRead(): Promise<{ success: boolean; unreadCount: number }> {
  const token = getAuthToken();
  if (!token) {
    handle401SessionExpiry();
    throw new Error("Authentication required. Please sign in.");
  }

  return apiFetch<{ success: boolean; unreadCount: number }>(
    `${API_BASE_URL}/api/admin/service-requests/read-all`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
}

/**
 * 4. GET /api/admin/service-requests/:id
 */
export async function fetchAdminServiceRequestById(id: number): Promise<ServiceRequestItem> {
  const token = getAuthToken();
  if (!token) {
    handle401SessionExpiry();
    throw new Error("Authentication required. Please sign in.");
  }

  const res = await apiFetch<ServiceRequestSingleResponse>(
    `${API_BASE_URL}/api/admin/service-requests/${id}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.data;
}

/**
 * 5. PATCH /api/admin/service-requests/:id
 */
export async function updateAdminServiceRequest(
  id: number,
  payload: {
    status?: ServiceRequestStatus;
    adminNotes?: string;
    isRead?: boolean;
  }
): Promise<ServiceRequestItem> {
  const token = getAuthToken();
  if (!token) {
    handle401SessionExpiry();
    throw new Error("Authentication required. Please sign in.");
  }

  const res = await apiFetch<ServiceRequestSingleResponse>(
    `${API_BASE_URL}/api/admin/service-requests/${id}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    }
  );
  return res.data;
}

/**
 * 6. DELETE /api/admin/service-requests/:id
 */
export async function deleteAdminServiceRequest(id: number): Promise<boolean> {
  const token = getAuthToken();
  if (!token) {
    handle401SessionExpiry();
    throw new Error("Authentication required. Please sign in.");
  }

  const res = await apiFetch<{ success: boolean; message: string }>(
    `${API_BASE_URL}/api/admin/service-requests/${id}`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return res.success;
}

/**
 * 7. Export CSV
 */
export async function downloadServiceRequestsCsv(params: {
  status?: string;
  service?: string;
  q?: string;
  unread?: boolean;
}): Promise<void> {
  const token = getAuthToken();
  if (!token) {
    handle401SessionExpiry();
    throw new Error("Authentication required. Please sign in.");
  }

  const searchParams = new URLSearchParams();
  if (params.status && params.status !== "all") searchParams.set("status", params.status);
  if (params.service && params.service !== "all") searchParams.set("service", params.service);
  if (params.q && params.q.trim()) searchParams.set("q", params.q.trim());
  if (params.unread) searchParams.set("unread", "true");

  const response = await fetch(
    `${API_BASE_URL}/api/admin/service-requests/export.csv?${searchParams.toString()}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to export CSV.");
  }

  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  const dateStr = new Date().toISOString().slice(0, 10);
  a.download = `service-requests-${dateStr}.csv`;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
}
