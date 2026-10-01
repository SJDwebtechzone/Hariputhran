import {
  RecentWorkItem,
  RecentWorksResponse,
  RecentWorkSingleResponse,
  UpdateRecentWorkPayload,
} from "@/types/recentWork";

const API_BASE_URL = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");
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

/**
 * Fetch with automatic AbortController timeout & credentials/headers handling
 */
async function apiFetch<T>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
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
      throw new Error(`Invalid JSON response from server (HTTP ${response.status})`);
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
 * 1. GET /api/recent-works (Public list)
 */
export async function fetchPublicRecentWorks(): Promise<RecentWorkItem[]> {
  const res = await apiFetch<RecentWorksResponse>(`${API_BASE_URL}/api/recent-works`, {
    method: "GET",
    cache: "no-store",
  });
  return res.data || [];
}

/**
 * 2. GET /api/admin/recent-works (Admin list)
 */
export async function fetchAdminRecentWorks(): Promise<RecentWorkItem[]> {
  const token = getAuthToken();
  if (!token) {
    handle401SessionExpiry();
    throw new Error("Authentication required. Please sign in.");
  }

  const res = await apiFetch<RecentWorksResponse>(`${API_BASE_URL}/api/admin/recent-works`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });
  return res.data || [];
}

/**
 * 3. PUT /api/admin/recent-works/:id (Admin Update)
 * Uses FormData without manual Content-Type header
 */
export async function updateAdminRecentWork(
  id: number,
  payload: UpdateRecentWorkPayload
): Promise<RecentWorkItem> {
  const token = getAuthToken();
  if (!token) {
    handle401SessionExpiry();
    throw new Error("Authentication required. Please sign in.");
  }

  const formData = new FormData();
  formData.append("title", payload.title);
  formData.append("location", payload.location);

  if (payload.removeImage) {
    formData.append("removeImage", "true");
  } else if (payload.image) {
    formData.append("image", payload.image);
  }

  const res = await apiFetch<RecentWorkSingleResponse>(
    `${API_BASE_URL}/api/admin/recent-works/${id}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    }
  );

  return res.data;
}
