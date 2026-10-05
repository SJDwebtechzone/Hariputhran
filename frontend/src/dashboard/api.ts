import { OverviewApiResponse } from "@/types/dashboard";
import { toast } from "sonner";

function getApiBase(): string {
  const envUrl = import.meta.env["VITE_API_URL"] as string | undefined;
  return (envUrl || "http://localhost:5000").replace(/\/+$/, "");
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
 * Fetch overview data for admin dashboard
 */
export async function fetchAdminOverview(signal?: AbortSignal): Promise<OverviewApiResponse> {
  const init: RequestInit = {
    headers: {
      ...getAuthHeader(),
      Pragma: "no-cache",
      "Cache-Control": "no-cache",
    },
  };

  if (signal) {
    init.signal = signal;
  }

  const res = await fetch(`${getApiBase()}/api/admin/overview`, init);

  if (res.status === 401) {
    handle401();
    throw new Error("Unauthorized");
  }

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.message || `Failed to fetch overview metrics (${res.status})`);
  }

  return res.json();
}
