import { Link } from "@tanstack/react-router";
import { Shield, Clock, ExternalLink, Inbox } from "lucide-react";
import { OverviewActivityItem } from "@/types/dashboard";

interface RecentEnquiriesTableProps {
  items: OverviewActivityItem[] | null;
  loading: boolean;
  warnings?: string[];
}

function formatRelativeTime(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffInSec = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSec < 60) return "Just now";
  const diffInMin = Math.floor(diffInSec / 60);
  if (diffInMin < 60) return `${diffInMin}m ago`;
  const diffInHours = Math.floor(diffInMin / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays}d ago`;
}

function formatExactDateTime(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

const DEFAULT_STATUS_CONFIG = {
  label: "New",
  badgeClass: "bg-orange-50 text-[#f97316] border-orange-200",
  dotClass: "bg-[#f97316]",
};

const STATUS_CONFIG: Record<
  string,
  { label: string; badgeClass: string; dotClass: string }
> = {
  new: DEFAULT_STATUS_CONFIG,
  contacted: {
    label: "Contacted",
    badgeClass: "bg-sky-50 text-[#0284c7] border-sky-200",
    dotClass: "bg-[#0284c7]",
  },
  in_progress: {
    label: "In Progress",
    badgeClass: "bg-amber-50 text-amber-700 border-amber-200",
    dotClass: "bg-amber-500",
  },
  closed: {
    label: "Closed",
    badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200",
    dotClass: "bg-emerald-500",
  },
};

export function RecentEnquiriesTable({
  items,
  loading,
  warnings = [],
}: RecentEnquiriesTableProps) {
  const isUnavailable = warnings.includes("recent_activity") || items === null;

  return (
    <div
      id="recent-enquiries"
      className="rounded-2xl border border-slate-200/80 bg-white shadow-xs overflow-hidden scroll-mt-24"
    >
      {/* Table Header Controls */}
      <div className="flex flex-col justify-between gap-4 border-b border-slate-100 p-6 sm:flex-row sm:items-center">
        <div>
          <h3 className="font-['Poppins',sans-serif] text-lg font-bold text-[#082342]">
            Recent Enquiries
          </h3>
          <p className="text-xs text-slate-500">
            Latest service requests and contact messages received from website visitors
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 font-mono text-[11px] font-semibold text-slate-600">
            <Shield className="size-3 text-[#0284c7]" />
            Internal Staff View
          </span>
        </div>
      </div>

      {/* Table Content */}
      <div className="overflow-x-auto">
        {loading ? (
          <div className="p-8 space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-12 w-full animate-pulse rounded-lg bg-slate-100" />
            ))}
          </div>
        ) : isUnavailable ? (
          <div className="flex min-h-[220px] flex-col items-center justify-center p-8 text-center text-slate-400">
            <p className="text-xs">Recent activity temporarily unavailable.</p>
          </div>
        ) : items.length === 0 ? (
          <div className="flex min-h-[240px] flex-col items-center justify-center p-8 text-center text-slate-400">
            <div className="grid size-12 place-items-center rounded-2xl bg-slate-100 text-slate-400 mb-2">
              <Inbox className="size-6" />
            </div>
            <p className="font-semibold text-xs text-slate-700">No enquiries yet</p>
            <p className="text-[11px] text-slate-400 mt-0.5">
              Customer service requests and contact form submissions will appear here in real-time.
            </p>
          </div>
        ) : (
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-100 bg-slate-50/75 font-mono uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-6 py-3.5">Type & Reference</th>
                <th className="px-6 py-3.5">Customer</th>
                <th className="px-6 py-3.5">Requirement / Subject</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5">Received</th>
                <th className="px-6 py-3.5 text-right">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 text-slate-700">
              {items.map((item) => {
                const isService = item.type === "service_request";
                const targetLink = isService
                  ? `/admin/service-requests`
                  : `/admin/contact-messages`;

                const statusCfg = STATUS_CONFIG[item.status] || DEFAULT_STATUS_CONFIG;
                const contactInfo = item.phone || item.email || "No contact info";

                return (
                  <tr
                    key={`${item.type}-${item.id}`}
                    className={`transition-colors hover:bg-slate-50/60 ${
                      !item.isRead ? "bg-orange-50/20 font-medium" : ""
                    }`}
                  >
                    {/* Type & Reference */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {!item.isRead && (
                          <span
                            className="size-2 shrink-0 rounded-full bg-[#f97316]"
                            title="Unread item"
                          />
                        )}
                        <span
                          className={`inline-flex items-center rounded-md px-2 py-0.5 font-bold uppercase tracking-wider text-[10px] ${
                            isService
                              ? "bg-sky-50 text-[#0284c7] border border-sky-100"
                              : "bg-orange-50 text-[#f97316] border border-orange-100"
                          }`}
                        >
                          {isService ? "Service Request" : "Contact Message"}
                        </span>
                      </div>
                      <div className="mt-1 font-mono text-[10.5px] text-slate-400">
                        #{item.id}
                      </div>
                    </td>

                    {/* Customer */}
                    <td className="px-6 py-4">
                      <div className="font-bold text-[#082342]">{item.name}</div>
                      <div className="font-mono text-[11px] text-slate-500 truncate max-w-[200px]">
                        {contactInfo}
                      </div>
                    </td>

                    {/* Requirement / Subject */}
                    <td className="px-6 py-4 max-w-[240px]">
                      <div className="font-semibold text-slate-800 truncate">
                        {item.title}
                      </div>
                    </td>

                    {/* Status Badge */}
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-bold ${statusCfg.badgeClass}`}
                      >
                        <span className={`size-1.5 rounded-full ${statusCfg.dotClass}`} />
                        {statusCfg.label}
                      </span>
                    </td>

                    {/* Received Time */}
                    <td className="px-6 py-4">
                      <div
                        className="inline-flex items-center gap-1 font-mono text-[11px] text-slate-500 cursor-help"
                        title={formatExactDateTime(item.createdAt)}
                      >
                        <Clock className="size-3 text-slate-400" />
                        <span>{formatRelativeTime(item.createdAt)}</span>
                      </div>
                    </td>

                    {/* Action */}
                    <td className="px-6 py-4 text-right">
                      <Link
                        to={targetLink}
                        search={{ open: item.id } as any}
                        className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 font-bold text-xs text-[#0284c7] hover:border-[#0284c7] hover:bg-sky-50 transition-colors"
                      >
                        View <ExternalLink className="size-3" />
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
