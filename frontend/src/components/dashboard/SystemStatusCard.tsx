import {
  Database,
  Mail,
  BellRing,
  Layers,
  Image as ImageIcon,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { OverviewData } from "@/types/dashboard";

interface SystemStatusCardProps {
  data: OverviewData | null;
  loading: boolean;
}

export function SystemStatusCard({ data, loading }: SystemStatusCardProps) {
  if (loading) {
    return (
      <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs animate-pulse">
        <div className="h-4 w-32 rounded bg-slate-200 mb-4" />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-16 rounded-xl bg-slate-50" />
          ))}
        </div>
      </div>
    );
  }

  const sys = data?.system;
  const services = data?.services;
  const recentWorks = data?.recentWorks;

  const dbConnected = sys?.database?.connected ?? true;
  const latency = sys?.database?.latencyMs ?? 0;
  const emailConfigured = sys?.emailConfigured ?? false;
  const alertsConfigured = sys?.adminAlertsConfigured ?? false;

  const servicesPublished = `${services?.active ?? 0} of ${services?.total ?? 0}`;
  const recentWorksPhotos = `${recentWorks?.withCustomPhoto ?? 0} of ${recentWorks?.total ?? 4}`;

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs">
      <div className="mb-3.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs font-bold uppercase tracking-wider text-slate-500">
            System & Infrastructure Status
          </span>
        </div>
        <span className="font-mono text-[11px] text-slate-400">Production Node & DB</span>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {/* 1. Database */}
        <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/60 p-3">
          <div
            className={`grid size-9 shrink-0 place-items-center rounded-lg ${
              dbConnected ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
            }`}
          >
            <Database className="size-4" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1 text-[11px] font-bold text-slate-700">
              <span>PostgreSQL</span>
              {dbConnected ? (
                <CheckCircle2 className="size-3 text-emerald-600" />
              ) : (
                <AlertTriangle className="size-3 text-rose-600" />
              )}
            </div>
            <p className="font-mono text-[10px] text-slate-500">
              {dbConnected ? `${latency}ms latency` : "Disconnected"}
            </p>
          </div>
        </div>

        {/* 2. Customer Email Delivery */}
        <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/60 p-3">
          <div
            className={`grid size-9 shrink-0 place-items-center rounded-lg ${
              emailConfigured ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
            }`}
          >
            <Mail className="size-4" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1 text-[11px] font-bold text-slate-700">
              <span>SMTP Mailer</span>
              {emailConfigured ? (
                <CheckCircle2 className="size-3 text-emerald-600" />
              ) : (
                <AlertTriangle className="size-3 text-amber-500" />
              )}
            </div>
            <p className="font-mono text-[10px] text-slate-500">
              {emailConfigured ? "Configured" : "SMTP unset"}
            </p>
          </div>
        </div>

        {/* 3. Admin Alerts */}
        <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/60 p-3">
          <div
            className={`grid size-9 shrink-0 place-items-center rounded-lg ${
              alertsConfigured ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
            }`}
          >
            <BellRing className="size-4" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1 text-[11px] font-bold text-slate-700">
              <span>Admin Alerts</span>
              {alertsConfigured ? (
                <CheckCircle2 className="size-3 text-emerald-600" />
              ) : (
                <AlertTriangle className="size-3 text-amber-500" />
              )}
            </div>
            <p className="font-mono text-[10px] text-slate-500">
              {alertsConfigured ? "Active" : "Alert email unset"}
            </p>
          </div>
        </div>

        {/* 4. Services Published */}
        <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/60 p-3">
          <div className="grid size-9 shrink-0 place-items-center rounded-lg bg-sky-50 text-[#0284c7]">
            <Layers className="size-4" />
          </div>
          <div className="min-w-0">
            <div className="text-[11px] font-bold text-slate-700">Services Active</div>
            <p className="font-mono text-[10px] text-slate-500">
              {servicesPublished} published
            </p>
          </div>
        </div>

        {/* 5. Recent Works Custom Photo */}
        <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/60 p-3">
          <div className="grid size-9 shrink-0 place-items-center rounded-lg bg-indigo-50 text-indigo-600">
            <ImageIcon className="size-4" />
          </div>
          <div className="min-w-0">
            <div className="text-[11px] font-bold text-slate-700">Recent Works</div>
            <p className="font-mono text-[10px] text-slate-500">
              {recentWorksPhotos} custom photos
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
