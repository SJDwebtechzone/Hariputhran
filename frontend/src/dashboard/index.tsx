import { useState, useEffect, useCallback, useRef } from "react";
import {
  Activity,
  ArrowUpRight,
  RefreshCw,
  AlertCircle,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { AdminLayout, type AdminUser } from "@/components/admin/AdminLayout";
import { OverviewApiResponse, OverviewData } from "@/types/dashboard";
import { fetchAdminOverview } from "@/dashboard/api";
import { OverviewStatCards } from "@/components/dashboard/OverviewStatCards";
import { OverviewCharts } from "@/components/dashboard/OverviewCharts";
import { RecentEnquiriesTable } from "@/components/dashboard/RecentEnquiriesTable";
import { SystemStatusCard } from "@/components/dashboard/SystemStatusCard";
import { toast } from "sonner";

function formatLastUpdated(date: Date): string {
  return date.toLocaleTimeString("en-IN", {
    timeZone: "Asia/Kolkata",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

export function DashboardPage() {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [overviewData, setOverviewData] = useState<OverviewData | null>(null);
  const [warnings, setWarnings] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const abortControllerRef = useRef<AbortController | null>(null);

  // Load user from storage
  useEffect(() => {
    const storedUserStr =
      localStorage.getItem("hariputhran_user") ||
      sessionStorage.getItem("hariputhran_user");

    if (storedUserStr) {
      try {
        const parsed = JSON.parse(storedUserStr);
        setUser(parsed);
      } catch {
        setUser({ name: "Admin", email: "admin@hariputhran.com" });
      }
    } else {
      setUser({ name: "Admin", email: "admin@hariputhran.com" });
    }
  }, []);

  const loadOverview = useCallback(async (isManualRefresh = false) => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    if (isManualRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError(null);

    try {
      const res: OverviewApiResponse = await fetchAdminOverview(controller.signal);
      if (res.success && res.data) {
        setOverviewData(res.data);
        setWarnings(res.warnings || []);
        setLastUpdated(new Date());
        if (isManualRefresh) {
          toast.success("Dashboard metrics refreshed");
        }
      } else {
        throw new Error(res.message || "Failed to load overview data.");
      }
    } catch (err: any) {
      if (err.name === "AbortError") {
        return;
      }
      console.error("[Dashboard] Error fetching overview data:", err);
      setError(err.message || "An unexpected error occurred while loading dashboard metrics.");
      if (isManualRefresh) {
        toast.error(err.message || "Failed to refresh dashboard.");
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // Initial load and polling / focus listeners
  useEffect(() => {
    loadOverview(false);

    // Auto-refresh every 60 seconds when document is visible
    const intervalId = setInterval(() => {
      if (typeof document !== "undefined" && !document.hidden) {
        loadOverview(false);
      }
    }, 60000);

    const handleFocus = () => {
      loadOverview(false);
    };

    window.addEventListener("focus", handleFocus);
    window.addEventListener("service_requests_updated", handleFocus);
    window.addEventListener("contact_messages_updated", handleFocus);

    return () => {
      clearInterval(intervalId);
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("service_requests_updated", handleFocus);
      window.removeEventListener("contact_messages_updated", handleFocus);
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [loadOverview]);

  const adminName = user?.name || "Administrator";

  return (
    <AdminLayout
      title="Admin Dashboard"
      subtitle="Hariputhran Infrastructure & Civil Contracting Management"
      activeNav="dashboard"
    >
      <div className="space-y-8">
        {/* Welcome Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#082342] via-[#0d3b66] to-[#0284c7] p-6 text-white shadow-xl sm:p-8">
          <div className="pointer-events-none absolute -right-12 -top-12 size-56 rounded-full bg-[#f97316]/20 blur-3xl" />

          <div className="relative z-10 flex flex-col justify-between gap-6 md:flex-row md:items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 font-mono text-[11px] font-semibold text-[#38bdf8] backdrop-blur-sm">
                <Activity className="size-3.5" />
                Live Operational Overview
              </div>

              <h2 className="mt-3 font-['Poppins',sans-serif] text-2xl font-extrabold tracking-tight sm:text-3xl">
                Welcome back, <span className="text-[#f97316]">{adminName}</span>
              </h2>

              <p className="mt-1.5 max-w-xl text-xs leading-relaxed text-slate-200 sm:text-sm">
                Track ongoing sewerage network projects, pipeline alignments, civil restoration tenders, and client handovers across Tamil Nadu.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Button
                onClick={() => loadOverview(true)}
                disabled={refreshing || loading}
                variant="outline"
                className="h-10 rounded-full border-white/30 bg-white/10 text-xs font-bold uppercase tracking-wider text-white backdrop-blur-sm hover:bg-white hover:text-[#082342] transition-all cursor-pointer"
              >
                <RefreshCw className={`mr-1.5 size-3.5 ${refreshing ? "animate-spin" : ""}`} />
                {refreshing ? "Refreshing..." : "Refresh Data"}
              </Button>

              <Button
                asChild
                className="h-10 rounded-full bg-[#f97316] px-5 text-xs font-bold uppercase tracking-wider text-white shadow-lg shadow-orange-500/30 hover:bg-[#ea580c] transition-colors"
              >
                <a href="#recent-enquiries">
                  View Recent Enquiries
                  <ArrowUpRight className="ml-1.5 size-4" />
                </a>
              </Button>
            </div>
          </div>
        </div>

        {/* Last updated badge & Error Panel */}
        {error ? (
          <div className="rounded-2xl border border-rose-200 bg-rose-50/50 p-6 text-center">
            <div className="grid size-12 place-items-center rounded-2xl bg-rose-100 text-rose-600 mx-auto mb-3">
              <AlertCircle className="size-6" />
            </div>
            <h3 className="font-['Poppins',sans-serif] text-base font-bold text-rose-900">
              Failed to load dashboard overview
            </h3>
            <p className="text-xs text-rose-700 mt-1 mb-4 max-w-md mx-auto">
              {error}
            </p>
            <Button
              size="sm"
              onClick={() => loadOverview(false)}
              className="bg-[#082342] text-white hover:bg-[#082342]/90 text-xs font-bold"
            >
              Retry
            </Button>
          </div>
        ) : (
          <>
            {/* Top Bar: Last updated info */}
            {lastUpdated && (
              <div className="flex items-center justify-end font-mono text-[11px] text-slate-400 -mb-4">
                <Clock className="mr-1 size-3" />
                Last updated at {formatLastUpdated(lastUpdated)}
              </div>
            )}

            {/* Four Stat Cards */}
            <OverviewStatCards
              data={overviewData}
              loading={loading && !overviewData}
              warnings={warnings}
            />

            {/* 30-Day Trends & Services Breakdown */}
            <OverviewCharts
              serviceRequests={overviewData?.serviceRequests || null}
              contactMessages={overviewData?.contactMessages || null}
              loading={loading && !overviewData}
              warnings={warnings}
            />

            {/* Recent Enquiries Table Section */}
            <RecentEnquiriesTable
              items={overviewData?.recentActivity || null}
              loading={loading && !overviewData}
              warnings={warnings}
            />

            {/* System Status Telemetry */}
            <SystemStatusCard
              data={overviewData}
              loading={loading && !overviewData}
            />
          </>
        )}
      </div>
    </AdminLayout>
  );
}

export default DashboardPage;
