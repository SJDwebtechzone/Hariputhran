import { useMemo } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";
import {
  OverviewServiceRequests,
  OverviewContactMessages,
} from "@/types/dashboard";
import { BarChart3, PieChart } from "lucide-react";

interface OverviewChartsProps {
  serviceRequests: OverviewServiceRequests | null;
  contactMessages: OverviewContactMessages | null;
  loading: boolean;
  warnings?: string[];
}

function formatDateLabel(dateStr: string): string {
  try {
    const parts = dateStr.split("-");
    if (parts.length === 3) {
      const d = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
      return d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
    }
  } catch {
    // fallback
  }
  return dateStr;
}

export function OverviewCharts({
  serviceRequests,
  contactMessages,
  loading,
  warnings = [],
}: OverviewChartsProps) {
  // Combine daily data for 30 days chart
  const combinedDailyData = useMemo(() => {
    if (!serviceRequests?.daily || !contactMessages?.daily) return [];

    const cmMap: Record<string, number> = {};
    for (const item of contactMessages.daily) {
      cmMap[item.date] = item.count;
    }

    return serviceRequests.daily.map((item) => ({
      date: item.date,
      displayDate: formatDateLabel(item.date),
      serviceRequests: item.count,
      contactMessages: cmMap[item.date] || 0,
      total: item.count + (cmMap[item.date] || 0),
    }));
  }, [serviceRequests?.daily, contactMessages?.daily]);

  // Top services by request count
  const servicesRanking = useMemo(() => {
    if (!serviceRequests?.byService || serviceRequests.byService.length === 0) return [];
    const totalRequests = serviceRequests.byService.reduce((sum, item) => sum + item.count, 0) || 1;
    return serviceRequests.byService.slice(0, 5).map((item) => ({
      name: item.name,
      count: item.count,
      percent: Math.round((item.count / totalRequests) * 100),
    }));
  }, [serviceRequests?.byService]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs animate-pulse">
          <div className="h-5 w-48 rounded bg-slate-200 mb-2" />
          <div className="h-4 w-72 rounded bg-slate-100 mb-6" />
          <div className="h-64 rounded-xl bg-slate-50" />
        </div>
        <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs animate-pulse">
          <div className="h-5 w-40 rounded bg-slate-200 mb-2" />
          <div className="h-4 w-56 rounded bg-slate-100 mb-6" />
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-10 rounded-lg bg-slate-50" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const isSrUnavailable = warnings.includes("service_requests") || !serviceRequests;
  const isCmUnavailable = warnings.includes("contact_messages") || !contactMessages;

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      {/* 30-Day Enquiries Area Chart */}
      <div className="lg:col-span-2 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="grid size-8 place-items-center rounded-lg bg-sky-50 text-[#0284c7]">
                <BarChart3 className="size-4" />
              </div>
              <h3 className="font-['Poppins',sans-serif] text-base font-bold text-[#082342]">
                Enquiries — Last 30 Days
              </h3>
            </div>
            <span className="font-mono text-[11px] font-semibold text-slate-400">
              Daily Distribution (IST)
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Comparative trajectory of service requests and contact messages received.
          </p>
        </div>

        <div className="mt-6 h-64 w-full">
          {isSrUnavailable || isCmUnavailable ? (
            <div className="flex h-full items-center justify-center text-xs text-slate-400">
              Chart data temporarily unavailable.
            </div>
          ) : combinedDailyData.length === 0 ? (
            <div className="flex h-full items-center justify-center text-xs text-slate-400">
              No enquiry data recorded in the last 30 days.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={combinedDailyData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="srGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="cmGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0284c7" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#0284c7" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="displayDate"
                  tick={{ fontSize: 10, fill: "#94a3b8" }}
                  tickLine={false}
                  axisLine={{ stroke: "#e2e8f0" }}
                  interval={4}
                />
                <YAxis
                  tick={{ fontSize: 10, fill: "#94a3b8" }}
                  tickLine={false}
                  axisLine={{ stroke: "#e2e8f0" }}
                  allowDecimals={false}
                />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-lg text-xs">
                          <p className="font-bold text-[#082342] mb-1.5">{label}</p>
                          <div className="space-y-1">
                            <div className="flex items-center justify-between gap-4 text-slate-600">
                              <span className="flex items-center gap-1.5">
                                <span className="size-2 rounded-full bg-[#f97316]" />
                                Service Requests:
                              </span>
                              <span className="font-mono font-bold text-slate-900">
                                {payload[0]?.value}
                              </span>
                            </div>
                            <div className="flex items-center justify-between gap-4 text-slate-600">
                              <span className="flex items-center gap-1.5">
                                <span className="size-2 rounded-full bg-[#0284c7]" />
                                Contact Messages:
                              </span>
                              <span className="font-mono font-bold text-slate-900">
                                {payload[1]?.value}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend
                  verticalAlign="top"
                  align="right"
                  iconType="circle"
                  iconSize={7}
                  wrapperStyle={{ fontSize: "11px", paddingBottom: "10px" }}
                />
                <Area
                  type="monotone"
                  name="Service Requests"
                  dataKey="serviceRequests"
                  stroke="#f97316"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#srGrad)"
                />
                <Area
                  type="monotone"
                  name="Contact Messages"
                  dataKey="contactMessages"
                  stroke="#0284c7"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#cmGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Requests by Service Ranking */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="grid size-8 place-items-center rounded-lg bg-orange-50 text-[#f97316]">
                <PieChart className="size-4" />
              </div>
              <h3 className="font-['Poppins',sans-serif] text-base font-bold text-[#082342]">
                Requests by Service
              </h3>
            </div>
            <span className="font-mono text-[11px] font-semibold text-slate-400">
              Top 5
            </span>
          </div>
          <p className="mt-1 text-xs text-slate-500">
            Demand breakdown across civil infrastructure categories.
          </p>
        </div>

        <div className="mt-6 flex-1 flex flex-col justify-center space-y-4">
          {isSrUnavailable ? (
            <div className="py-12 text-center text-xs text-slate-400">
              Service breakdown temporarily unavailable.
            </div>
          ) : servicesRanking.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400">
              No service requests logged yet.
            </div>
          ) : (
            servicesRanking.map((item, idx) => (
              <div key={item.name} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-800 truncate max-w-[180px]">
                    {idx + 1}. {item.name}
                  </span>
                  <div className="flex items-center gap-2 font-mono text-[11px]">
                    <span className="font-bold text-[#082342]">{item.count}</span>
                    <span className="text-slate-400">({item.percent}%)</span>
                  </div>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#0284c7] to-[#f97316] transition-all duration-500"
                    style={{ width: `${Math.max(item.percent, 4)}%` }}
                  />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
