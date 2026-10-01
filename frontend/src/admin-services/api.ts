import type { ServiceItemData, ApiSuccessResponse, ApiErrorResponse, ApiResponse } from "@/types/service";

export type { ServiceItemData, ApiSuccessResponse, ApiErrorResponse, ApiResponse };

const API_BASE = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/+$/, "");
const DEFAULT_TIMEOUT_MS = 20000;

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  return (
    localStorage.getItem("hariputhran_token") ||
    sessionStorage.getItem("hariputhran_token") ||
    null
  );
}

export function clearAuthToken(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem("hariputhran_token");
  localStorage.removeItem("hariputhran_user");
  sessionStorage.removeItem("hariputhran_token");
  sessionStorage.removeItem("hariputhran_user");
}

async function requestWithTimeout(
  url: string,
  options: RequestInit = {},
  timeoutMs: number = DEFAULT_TIMEOUT_MS
): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    return response;
  } catch (err: any) {
    if (err.name === "AbortError") {
      throw new ApiError("Request timed out after 20 seconds. Please check your network connection.", 408);
    }
    throw new ApiError(err.message || "Failed to connect to backend server.", 0);
  } finally {
    clearTimeout(id);
  }
}

function getHeaders(customHeaders: HeadersInit = {}): HeadersInit {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    ...((customHeaders as Record<string, string>) || {}),
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
}

// 1. Fetch all admin services
export async function fetchAdminServices(): Promise<ServiceItemData[]> {
  const token = getAuthToken();
  if (!token) {
    throw new ApiError("No active login session found. Please sign in.", 401);
  }

  const res = await requestWithTimeout(`${API_BASE}/api/admin/services`, {
    method: "GET",
    headers: getHeaders({
      "Pragma": "no-cache",
      "Cache-Control": "no-cache",
    }),
  });

  const json = await res.json().catch(() => null);

  if (!res.ok || !json?.success) {
    const msg = json?.message || `Failed to fetch services (HTTP ${res.status})`;
    throw new ApiError(msg, res.status);
  }

  return Array.isArray(json.data) ? json.data : [];
}

// 2. Import default website services
export async function importDefaultServices(): Promise<ServiceItemData[]> {
  const res = await requestWithTimeout(`${API_BASE}/api/admin/services/import-defaults`, {
    method: "POST",
    headers: getHeaders(),
  });

  const json = await res.json().catch(() => null);

  if (!res.ok || !json?.success) {
    const msg = json?.message || `Import failed (HTTP ${res.status})`;
    throw new ApiError(msg, res.status);
  }

  return Array.isArray(json.data) ? json.data : [];
}

// 3. Create service
export async function createAdminService(formData: FormData): Promise<ServiceItemData> {
  const res = await requestWithTimeout(`${API_BASE}/api/admin/services`, {
    method: "POST",
    headers: getHeaders(),
    body: formData,
  });

  const json = await res.json().catch(() => null);

  if (!res.ok || !json?.success) {
    const msg = json?.message || `Failed to create service (HTTP ${res.status})`;
    throw new ApiError(msg, res.status);
  }

  return json.data;
}

// 4. Update service
export async function updateAdminService(id: number | string, formData: FormData): Promise<ServiceItemData> {
  const res = await requestWithTimeout(`${API_BASE}/api/admin/services/${id}`, {
    method: "PUT",
    headers: getHeaders(),
    body: formData,
  });

  const json = await res.json().catch(() => null);

  if (!res.ok || !json?.success) {
    const msg = json?.message || `Failed to update service (HTTP ${res.status})`;
    throw new ApiError(msg, res.status);
  }

  return json.data;
}

// 5. Toggle active status
export async function toggleAdminServiceActive(id: number | string, isActive: boolean): Promise<ServiceItemData> {
  const res = await requestWithTimeout(`${API_BASE}/api/admin/services/${id}/active`, {
    method: "PATCH",
    headers: getHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify({ is_active: isActive }),
  });

  const json = await res.json().catch(() => null);

  if (!res.ok || !json?.success) {
    const msg = json?.message || `Failed to toggle service status (HTTP ${res.status})`;
    throw new ApiError(msg, res.status);
  }

  return json.data;
}

// 6. Reorder services
export async function reorderAdminServices(order: { id: number | string; sort_order: number }[]): Promise<void> {
  const res = await requestWithTimeout(`${API_BASE}/api/admin/services/reorder`, {
    method: "PUT",
    headers: getHeaders({ "Content-Type": "application/json" }),
    body: JSON.stringify({ order }),
  });

  const json = await res.json().catch(() => null);

  if (!res.ok || !json?.success) {
    const msg = json?.message || `Failed to reorder services (HTTP ${res.status})`;
    throw new ApiError(msg, res.status);
  }
}

// 7. Delete service
export async function deleteAdminService(id: number | string): Promise<void> {
  const res = await requestWithTimeout(`${API_BASE}/api/admin/services/${id}`, {
    method: "DELETE",
    headers: getHeaders(),
  });

  const json = await res.json().catch(() => null);

  if (!res.ok || !json?.success) {
    const msg = json?.message || `Failed to delete service (HTTP ${res.status})`;
    throw new ApiError(msg, res.status);
  }
}
