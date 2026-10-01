import { useState, useEffect, useCallback } from "react";
import { useSearch, useNavigate } from "@tanstack/react-router";
import {
  MessageSquareText,
  Search,
  Filter,
  RefreshCcw,
  Download,
  CheckCheck,
  Clock,
  Phone,
  Mail,
  User,
  AlertCircle,
  CheckCircle2,
  Trash2,
  X,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Copy,
  Check,
  Send,
  Loader2,
  FileText,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { AdminLayout } from "@/components/admin/AdminLayout";
import {
  ServiceRequestItem,
  ServiceRequestCounts,
  ServiceRequestStatus,
} from "@/types/serviceRequests";
import {
  fetchAdminServiceRequests,
  fetchAdminServiceRequestById,
  updateAdminServiceRequest,
  deleteAdminServiceRequest,
  markAllServiceRequestsAsRead,
  downloadServiceRequestsCsv,
} from "@/admin-service-requests/api";
import { toast } from "sonner";

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

function formatFullDateTime(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

const STATUS_CONFIG: Record<
  ServiceRequestStatus,
  { label: string; badgeClass: string; dotClass: string }
> = {
  new: {
    label: "New",
    badgeClass: "bg-orange-50 text-[#f97316] border-orange-200",
    dotClass: "bg-[#f97316]",
  },
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

export function AdminServiceRequestsView() {
  const searchParams = useSearch({ strict: false }) as { open?: string | number };
  const navigate = useNavigate();

  const [items, setItems] = useState<ServiceRequestItem[]>([]);
  const [counts, setCounts] = useState<ServiceRequestCounts>({
    total: 0,
    new: 0,
    contacted: 0,
    in_progress: 0,
    closed: 0,
    unread: 0,
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 1,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [serviceFilter, setServiceFilter] = useState<string>("all");
  const [unreadOnly, setUnreadOnly] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [debouncedSearch, setDebouncedSearch] = useState<string>("");

  // Drawer / Detail state
  const [selectedRequest, setSelectedRequest] = useState<ServiceRequestItem | null>(null);
  const [drawerLoading, setDrawerLoading] = useState(false);
  const [notesInput, setNotesInput] = useState("");
  const [savingNotes, setSavingNotes] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [isCopiedPhone, setIsCopiedPhone] = useState(false);
  const [isCopiedEmail, setIsCopiedEmail] = useState(false);

  // Debounce search query
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  const loadRequests = useCallback(
    async (pageToLoad = 1) => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetchAdminServiceRequests({
          page: pageToLoad,
          limit: 20,
          status: statusFilter,
          service: serviceFilter,
          q: debouncedSearch,
          unread: unreadOnly,
        });

        if (res.success) {
          setItems(res.data);
          setCounts(res.counts);
          setPagination(res.pagination);
        }
      } catch (err: any) {
        console.error("Failed to fetch service requests:", err);
        setError(err.message || "Failed to load service requests.");
      } finally {
        setLoading(false);
      }
    },
    [statusFilter, serviceFilter, debouncedSearch, unreadOnly]
  );

  useEffect(() => {
    loadRequests(1);
  }, [loadRequests]);

  // Open drawer if ?open=<id> is in URL
  useEffect(() => {
    if (searchParams?.open) {
      const targetId = Number(searchParams.open);
      if (targetId && !isNaN(targetId)) {
        openDetailDrawer(targetId);
      }
    }
  }, [searchParams?.open]);

  const openDetailDrawer = async (id: number) => {
    setDrawerLoading(true);
    try {
      const item = await fetchAdminServiceRequestById(id);
      setSelectedRequest(item);
      setNotesInput(item.adminNotes || "");

      // If unread, mark as read immediately
      if (!item.isRead) {
        await updateAdminServiceRequest(id, { isRead: true });
        setItems((prev) =>
          prev.map((r) => (r.id === id ? { ...r, isRead: true } : r))
        );
        setCounts((prev) => ({
          ...prev,
          unread: Math.max(0, prev.unread - 1),
        }));
        window.dispatchEvent(new Event("service_requests_updated"));
      }
    } catch (err: any) {
      toast.error("Failed to open service request: " + err.message);
    } finally {
      setDrawerLoading(false);
    }
  };

  const closeDrawer = () => {
    setSelectedRequest(null);
    setNotesInput("");
    setDeletingId(null);
    // Clear ?open from URL
    if (searchParams?.open) {
      navigate({
        to: "/admin/service-requests",
        search: {} as any,
        replace: true,
      });
    }
  };

  const handleStatusChange = async (newStatus: ServiceRequestStatus) => {
    if (!selectedRequest) return;
    try {
      const updated = await updateAdminServiceRequest(selectedRequest.id, {
        status: newStatus,
      });
      setSelectedRequest(updated);
      setItems((prev) =>
        prev.map((r) => (r.id === updated.id ? updated : r))
      );
      toast.success(`Status updated to ${STATUS_CONFIG[newStatus].label}`);
      loadRequests(pagination.page);
      window.dispatchEvent(new Event("service_requests_updated"));
    } catch (err: any) {
      toast.error("Failed to update status: " + err.message);
    }
  };

  const handleSaveNotes = async () => {
    if (!selectedRequest) return;
    setSavingNotes(true);
    try {
      const updated = await updateAdminServiceRequest(selectedRequest.id, {
        adminNotes: notesInput.trim(),
      });
      setSelectedRequest(updated);
      setItems((prev) =>
        prev.map((r) => (r.id === updated.id ? updated : r))
      );
      toast.success("Notes saved successfully");
    } catch (err: any) {
      toast.error("Failed to save notes: " + err.message);
    } finally {
      setSavingNotes(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteAdminServiceRequest(id);
      toast.success("Service request deleted successfully.");
      closeDrawer();
      loadRequests(pagination.page);
      window.dispatchEvent(new Event("service_requests_updated"));
    } catch (err: any) {
      toast.error("Failed to delete service request: " + err.message);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllServiceRequestsAsRead();
      setItems((prev) => prev.map((r) => ({ ...r, isRead: true })));
      setCounts((prev) => ({ ...prev, unread: 0 }));
      toast.success("All service requests marked as read.");
      window.dispatchEvent(new Event("service_requests_updated"));
    } catch (err: any) {
      toast.error("Failed to mark all as read: " + err.message);
    }
  };

  const handleExportCsv = async () => {
    try {
      toast.info("Preparing CSV export...");
      await downloadServiceRequestsCsv({
        status: statusFilter,
        service: serviceFilter,
        q: debouncedSearch,
        unread: unreadOnly,
      });
      toast.success("CSV export downloaded.");
    } catch (err: any) {
      toast.error("Failed to export CSV: " + err.message);
    }
  };

  const copyToClipboard = (text: string, type: "phone" | "email") => {
    navigator.clipboard.writeText(text);
    if (type === "phone") {
      setIsCopiedPhone(true);
      setTimeout(() => setIsCopiedPhone(false), 2000);
    } else {
      setIsCopiedEmail(true);
      setTimeout(() => setIsCopiedEmail(false), 2000);
    }
    toast.success(`Copied ${text} to clipboard`);
  };

  // Distinct service names from current list or standard options
  const distinctServices = Array.from(
    new Set(items.map((i) => i.serviceName).filter(Boolean))
  );

  return (
    <AdminLayout activeNav="service-requests">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header Bar */}
        <div className="flex flex-col justify-between gap-4 border-b border-slate-200/80 pb-6 sm:flex-row sm:items-center">
          <div>
            <div className="inline-flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-wider text-[#0284c7]">
              <span className="h-0.5 w-6 bg-[#f97316]" />
              INQUIRY & LEAD MANAGEMENT
            </div>
            <h1 className="mt-1 font-['Poppins',sans-serif] text-2xl font-bold tracking-tight text-[#082342] sm:text-3xl">
              Service Requests
            </h1>
            <p className="mt-1.5 text-xs sm:text-sm text-slate-500 max-w-2xl">
              Customers who requested a quote from the website. Review inquiries, track follow-ups, and manage client communications.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => loadRequests(pagination.page)}
              disabled={loading}
              className="border-slate-200 bg-white font-mono text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              <RefreshCcw className={`mr-1.5 size-3.5 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>

            {counts.unread > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleMarkAllRead}
                className="border-slate-200 bg-white font-mono text-xs font-semibold text-[#0284c7] hover:bg-sky-50"
              >
                <CheckCheck className="mr-1.5 size-3.5" />
                Mark All Read
              </Button>
            )}

            <Button
              size="sm"
              onClick={handleExportCsv}
              className="bg-[#082342] font-mono text-xs font-semibold text-white hover:bg-[#0284c7]"
            >
              <Download className="mr-1.5 size-3.5" />
              Export CSV
            </Button>
          </div>
        </div>

        {/* 5 Summary Metric Cards */}
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {/* Card 1: Total */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
            <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Total Inquiries
            </span>
            <div className="mt-2 font-['Poppins',sans-serif] text-2xl font-extrabold text-[#082342]">
              {counts.total}
            </div>
          </div>

          {/* Card 2: New (Unread) */}
          <div className="rounded-2xl border border-orange-200/80 bg-orange-50/50 p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-[#f97316]">
                New Requests
              </span>
              {counts.unread > 0 && (
                <span className="size-2 rounded-full bg-[#f97316] animate-pulse" />
              )}
            </div>
            <div className="mt-2 font-['Poppins',sans-serif] text-2xl font-extrabold text-[#f97316]">
              {counts.new}{" "}
              <span className="text-xs font-normal text-slate-500">
                ({counts.unread} unread)
              </span>
            </div>
          </div>

          {/* Card 3: Contacted */}
          <div className="rounded-2xl border border-sky-200/80 bg-sky-50/50 p-4 shadow-sm">
            <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-[#0284c7]">
              Contacted
            </span>
            <div className="mt-2 font-['Poppins',sans-serif] text-2xl font-extrabold text-[#0284c7]">
              {counts.contacted}
            </div>
          </div>

          {/* Card 4: In Progress */}
          <div className="rounded-2xl border border-amber-200/80 bg-amber-50/50 p-4 shadow-sm">
            <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-amber-700">
              In Progress
            </span>
            <div className="mt-2 font-['Poppins',sans-serif] text-2xl font-extrabold text-amber-700">
              {counts.in_progress}
            </div>
          </div>

          {/* Card 5: Closed */}
          <div className="rounded-2xl border border-emerald-200/80 bg-emerald-50/50 p-4 shadow-sm col-span-2 sm:col-span-1">
            <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-emerald-700">
              Closed
            </span>
            <div className="mt-2 font-['Poppins',sans-serif] text-2xl font-extrabold text-emerald-700">
              {counts.closed}
            </div>
          </div>
        </div>

        {/* Toolbar: Search, Status Tabs & Filters */}
        <div className="mt-6 flex flex-col gap-4 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm lg:flex-row lg:items-center lg:justify-between">
          {/* Status Tabs */}
          <div className="flex flex-wrap items-center gap-1.5">
            {[
              { id: "all", label: "All", count: counts.total },
              { id: "new", label: "New", count: counts.new },
              { id: "contacted", label: "Contacted", count: counts.contacted },
              { id: "in_progress", label: "In Progress", count: counts.in_progress },
              { id: "closed", label: "Closed", count: counts.closed },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id)}
                className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 font-mono text-xs font-bold transition-colors cursor-pointer ${
                  statusFilter === tab.id
                    ? "bg-[#082342] text-white shadow-xs"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`rounded-full px-1.5 py-0.2 text-[10px] ${
                    statusFilter === tab.id
                      ? "bg-white/20 text-white"
                      : "bg-slate-100 text-slate-600"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* Filters & Search */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Search Box */}
            <div className="relative min-w-[220px] flex-1 sm:flex-initial">
              <Search className="absolute left-3 top-2.5 size-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search name, email, phone..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50/60 pl-9 pr-3 py-1.5 text-xs text-slate-900 outline-none transition focus:border-[#0284c7] focus:bg-white focus:ring-2 focus:ring-[#0284c7]/20"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-600"
                >
                  <X className="size-3.5" />
                </button>
              )}
            </div>

            {/* Service Filter */}
            {distinctServices.length > 0 && (
              <select
                value={serviceFilter}
                onChange={(e) => setServiceFilter(e.target.value)}
                className="rounded-xl border border-slate-200 bg-slate-50/60 px-3 py-1.5 text-xs font-semibold text-slate-700 outline-none focus:border-[#0284c7] focus:bg-white cursor-pointer"
              >
                <option value="all">All Services</option>
                {distinctServices.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            )}

            {/* Unread Only Toggle */}
            <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-slate-200 bg-slate-50/60 px-3 py-1.5 text-xs font-semibold text-slate-700 select-none hover:bg-slate-100">
              <input
                type="checkbox"
                checked={unreadOnly}
                onChange={(e) => setUnreadOnly(e.target.checked)}
                className="rounded text-[#0284c7] focus:ring-0"
              />
              <span>Unread Only</span>
            </label>
          </div>
        </div>

        {/* Main Content / Table */}
        <div className="mt-6 rounded-2xl border border-slate-200/80 bg-white shadow-sm overflow-hidden">
          {loading ? (
            /* Skeleton Loading Rows */
            <div className="divide-y divide-slate-100 p-4 space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center justify-between gap-4 animate-pulse py-2">
                  <div className="h-4 w-28 rounded bg-slate-200" />
                  <div className="h-4 w-36 rounded bg-slate-200" />
                  <div className="h-4 w-32 rounded bg-slate-200" />
                  <div className="h-4 w-48 rounded bg-slate-200" />
                  <div className="h-6 w-20 rounded-full bg-slate-200" />
                  <div className="h-8 w-16 rounded-lg bg-slate-200" />
                </div>
              ))}
            </div>
          ) : error ? (
            /* Error State with Retry Button */
            <div className="p-12 text-center text-red-900">
              <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-red-100 text-red-600">
                <AlertCircle className="size-6" />
              </div>
              <h3 className="mt-4 font-semibold text-base">Failed to Load Requests</h3>
              <p className="mt-1 text-xs text-red-700 max-w-md mx-auto">{error}</p>
              <Button
                onClick={() => loadRequests(pagination.page)}
                className="mt-5 bg-red-600 font-mono text-xs font-semibold text-white hover:bg-red-700"
              >
                <RefreshCcw className="mr-1.5 size-3.5" /> Retry
              </Button>
            </div>
          ) : items.length === 0 ? (
            /* Empty State */
            <div className="p-16 text-center text-slate-500">
              <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                <MessageSquareText className="size-7" />
              </div>
              <h3 className="mt-4 font-['Poppins',sans-serif] text-base font-bold text-[#082342]">
                No service requests found
              </h3>
              <p className="mt-1 text-xs text-slate-400 max-w-sm mx-auto">
                {searchQuery || statusFilter !== "all" || unreadOnly
                  ? "No inquiries match your active search or filter criteria."
                  : "When visitors request quotes on the website, they will appear here."}
              </p>
            </div>
          ) : (
            /* Table Data */
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-slate-100 bg-slate-50/75 font-mono uppercase tracking-wider text-slate-500">
                  <tr>
                    <th className="px-6 py-3.5">Received</th>
                    <th className="px-6 py-3.5">Customer Name</th>
                    <th className="px-6 py-3.5">Mobile</th>
                    <th className="px-6 py-3.5">Service Requested</th>
                    <th className="px-6 py-3.5">Message</th>
                    <th className="px-6 py-3.5">Status</th>
                    <th className="px-6 py-3.5 text-right">Action</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {items.map((item) => {
                    const statusConf = STATUS_CONFIG[item.status] || STATUS_CONFIG.new;
                    const isUnread = !item.isRead;

                    return (
                      <tr
                        key={item.id}
                        onClick={() => openDetailDrawer(item.id)}
                        className={`transition-colors hover:bg-slate-50/80 cursor-pointer ${
                          isUnread ? "bg-orange-50/20" : ""
                        }`}
                      >
                        {/* Received */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div
                            className="font-mono text-xs text-slate-600"
                            title={formatFullDateTime(item.createdAt)}
                          >
                            {formatRelativeTime(item.createdAt)}
                          </div>
                          <div className="font-mono text-[10px] text-slate-400">
                            {item.reference}
                          </div>
                        </td>

                        {/* Customer Name */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            {isUnread && (
                              <span className="size-2 shrink-0 rounded-full bg-[#f97316]" />
                            )}
                            <span
                              className={`text-xs ${
                                isUnread
                                  ? "font-extrabold text-[#082342]"
                                  : "font-semibold text-slate-800"
                              }`}
                            >
                              {item.customerName}
                            </span>
                          </div>
                          {item.customerEmail && (
                            <div className="text-[11px] text-slate-400 truncate max-w-[180px]">
                              {item.customerEmail}
                            </div>
                          )}
                        </td>

                        {/* Mobile */}
                        <td className="px-6 py-4 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center gap-1.5 font-mono text-xs font-semibold text-slate-800">
                            <a
                              href={`tel:+91${item.phone}`}
                              className="hover:text-[#0284c7] hover:underline"
                            >
                              +91 {item.phone}
                            </a>
                            <button
                              onClick={() => copyToClipboard(item.phone, "phone")}
                              title="Copy mobile number"
                              className="text-slate-400 hover:text-slate-600 p-1"
                            >
                              <Copy className="size-3" />
                            </button>
                          </div>
                        </td>

                        {/* Service */}
                        <td className="px-6 py-4">
                          <div className="font-medium text-[#082342] truncate max-w-[200px]">
                            {item.serviceName}
                          </div>
                        </td>

                        {/* Message Preview */}
                        <td className="px-6 py-4">
                          <p className="line-clamp-2 text-[11.5px] text-slate-500 max-w-xs leading-relaxed">
                            {item.message || (
                              <span className="italic text-slate-400">No message provided</span>
                            )}
                          </p>
                        </td>

                        {/* Status */}
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 font-mono text-[10.5px] font-bold ${statusConf.badgeClass}`}
                          >
                            <span className={`size-1.5 rounded-full ${statusConf.dotClass}`} />
                            {statusConf.label}
                          </span>
                        </td>

                        {/* Action */}
                        <td className="px-6 py-4 text-right whitespace-nowrap">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation();
                              openDetailDrawer(item.id);
                            }}
                            className="h-8 rounded-lg border-slate-200 px-3 font-mono text-xs font-semibold text-[#0284c7] hover:bg-sky-50"
                          >
                            View
                          </Button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination Footer */}
          {!loading && !error && pagination.total > 0 && (
            <div className="flex flex-col items-center justify-between gap-3 border-t border-slate-100 px-6 py-4 sm:flex-row text-xs text-slate-500 font-mono">
              <div>
                Showing {(pagination.page - 1) * pagination.limit + 1} to{" "}
                {Math.min(pagination.page * pagination.limit, pagination.total)} of{" "}
                {pagination.total} requests
              </div>

              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  disabled={pagination.page <= 1}
                  onClick={() => loadRequests(pagination.page - 1)}
                  className="h-8 border-slate-200 px-2.5"
                >
                  <ChevronLeft className="size-4" />
                </Button>
                <span>
                  Page {pagination.page} of {pagination.totalPages}
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={pagination.page >= pagination.totalPages}
                  onClick={() => loadRequests(pagination.page + 1)}
                  className="h-8 border-slate-200 px-2.5"
                >
                  <ChevronRight className="size-4" />
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Right Side Detail Drawer */}
        {selectedRequest && (
          <div className="fixed inset-0 z-50 flex justify-end">
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
              onClick={closeDrawer}
            />

            {/* Drawer Panel */}
            <div className="relative z-10 flex h-full w-full max-w-lg flex-col bg-white shadow-2xl animate-in slide-in-from-right duration-300">
              {/* Drawer Header */}
              <div className="flex items-center justify-between border-b border-slate-100 bg-[#082342] p-6 text-white">
                <div>
                  <div className="inline-flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-wider text-[#f97316]">
                    <span className="size-1.5 rounded-full bg-[#f97316]" />
                    {selectedRequest.reference}
                  </div>
                  <h2 className="mt-1 font-['Poppins',sans-serif] text-xl font-bold">
                    {selectedRequest.customerName}
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={closeDrawer}
                  className="rounded-full bg-white/10 p-2 text-slate-300 hover:bg-white/20 hover:text-white transition-colors"
                >
                  <X className="size-5" />
                </button>
              </div>

              {/* Drawer Body */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* 1. Status Selector */}
                <div>
                  <label className="block font-mono text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                    Request Status
                  </label>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {(["new", "contacted", "in_progress", "closed"] as ServiceRequestStatus[]).map(
                      (st) => {
                        const conf = STATUS_CONFIG[st];
                        const isSelected = selectedRequest.status === st;
                        return (
                          <button
                            key={st}
                            type="button"
                            onClick={() => handleStatusChange(st)}
                            className={`flex items-center justify-center gap-1.5 rounded-xl border py-2 text-xs font-bold transition-all cursor-pointer ${
                              isSelected
                                ? "border-[#082342] bg-[#082342] text-white shadow-sm"
                                : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                            }`}
                          >
                            <span className={`size-1.5 rounded-full ${isSelected ? "bg-white" : conf.dotClass}`} />
                            {conf.label}
                          </button>
                        );
                      }
                    )}
                  </div>
                </div>

                {/* 2. Customer Contact Card */}
                <div className="rounded-2xl border border-slate-200/90 bg-slate-50/70 p-4 space-y-3.5">
                  <div className="font-mono text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Contact & Communication
                  </div>

                  {/* Email */}
                  <div className="flex items-start justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2 text-slate-600 min-w-0">
                      <Mail className="size-4 text-[#0284c7] shrink-0" />
                      <span className="truncate font-medium">
                        {selectedRequest.customerEmail || "Not provided"}
                      </span>
                    </div>

                    {selectedRequest.customerEmail && (
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          onClick={() => copyToClipboard(selectedRequest.customerEmail!, "email")}
                          className="p-1 text-slate-400 hover:text-slate-700"
                          title="Copy email"
                        >
                          {isCopiedEmail ? <Check className="size-3.5 text-emerald-600" /> : <Copy className="size-3.5" />}
                        </button>
                        <a
                          href={`mailto:${selectedRequest.customerEmail}?subject=${encodeURIComponent(
                            `Re: ${selectedRequest.serviceName} request ${selectedRequest.reference}`
                          )}`}
                          className="inline-flex items-center gap-1 rounded-lg bg-[#0284c7] px-2 py-1 font-mono text-[10.5px] font-bold text-white hover:bg-sky-700"
                        >
                          <Send className="size-3" /> Reply
                        </a>
                      </div>
                    )}
                  </div>

                  {/* Mobile */}
                  <div className="flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2 text-slate-600">
                      <Phone className="size-4 text-emerald-600 shrink-0" />
                      <span className="font-mono font-bold text-slate-900">
                        +91 {selectedRequest.phone}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => copyToClipboard(selectedRequest.phone, "phone")}
                        className="p-1 text-slate-400 hover:text-slate-700"
                        title="Copy mobile"
                      >
                        {isCopiedPhone ? <Check className="size-3.5 text-emerald-600" /> : <Copy className="size-3.5" />}
                      </button>
                      <a
                        href={`tel:+91${selectedRequest.phone}`}
                        className="rounded-lg border border-slate-200 bg-white px-2 py-1 font-mono text-[10.5px] font-bold text-slate-700 hover:bg-slate-50"
                      >
                        Call
                      </a>
                      <a
                        href={`https://wa.me/91${selectedRequest.phone}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-lg bg-emerald-600 px-2 py-1 font-mono text-[10.5px] font-bold text-white hover:bg-emerald-700"
                      >
                        WhatsApp
                      </a>
                    </div>
                  </div>

                  {/* Confirmation Status */}
                  <div className="pt-2 border-t border-slate-200/80 text-[11px] text-slate-500 flex items-center justify-between">
                    <span>Confirmation Email:</span>
                    <span className="font-semibold text-slate-700">
                      {selectedRequest.confirmationSentAt
                        ? `Sent ${formatFullDateTime(selectedRequest.confirmationSentAt)}`
                        : "Not sent"}
                    </span>
                  </div>
                </div>

                {/* 3. Service Details */}
                <div className="rounded-2xl border border-slate-200/90 bg-white p-4 space-y-2">
                  <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Requested Service
                  </span>
                  <div className="text-sm font-bold text-[#082342]">
                    {selectedRequest.serviceName}
                  </div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
                    <Calendar className="size-3.5" />
                    <span>Received: {formatFullDateTime(selectedRequest.createdAt)}</span>
                  </div>
                </div>

                {/* 4. Full Message */}
                <div className="rounded-2xl border border-slate-200/90 bg-white p-4 space-y-2">
                  <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    Project Message / Scope
                  </span>
                  <div className="text-xs leading-relaxed text-slate-700 whitespace-pre-wrap bg-slate-50 p-3 rounded-xl border border-slate-100 min-h-[60px]">
                    {selectedRequest.message || "No specific message provided by customer."}
                  </div>
                </div>

                {/* 5. Internal Admin Notes */}
                <div className="rounded-2xl border border-slate-200/90 bg-white p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-slate-500">
                      Internal Notes
                    </span>
                    <span className="font-mono text-[10px] text-slate-400">
                      {notesInput.length}/2000
                    </span>
                  </div>
                  <textarea
                    rows={4}
                    value={notesInput}
                    onChange={(e) => setNotesInput(e.target.value.slice(0, 2000))}
                    placeholder="Add follow-up notes, site visit schedules, quotation references..."
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-3 text-xs text-slate-900 outline-none focus:border-[#0284c7] focus:bg-white focus:ring-2 focus:ring-[#0284c7]/20 resize-none"
                  />
                  <div className="flex justify-end pt-1">
                    <Button
                      size="sm"
                      onClick={handleSaveNotes}
                      disabled={savingNotes}
                      className="bg-[#082342] font-mono text-xs font-semibold text-white hover:bg-[#0284c7]"
                    >
                      {savingNotes ? (
                        <>
                          <Loader2 className="mr-1.5 size-3.5 animate-spin" /> Saving...
                        </>
                      ) : (
                        "Save Notes"
                      )}
                    </Button>
                  </div>
                </div>
              </div>

              {/* Drawer Footer / Delete Action */}
              <div className="border-t border-slate-100 bg-slate-50 p-4">
                {deletingId === selectedRequest.id ? (
                  <div className="flex items-center justify-between gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-900">
                    <span className="font-semibold">Confirm delete this request?</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setDeletingId(null)}
                        className="font-mono text-xs text-slate-600 hover:text-slate-900"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleDelete(selectedRequest.id)}
                        className="rounded-lg bg-red-600 px-3 py-1 font-mono text-xs font-bold text-white hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    onClick={() => setDeletingId(selectedRequest.id)}
                    className="w-full border-red-200 font-mono text-xs font-semibold text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="mr-1.5 size-3.5" />
                    Delete Request
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
export default AdminServiceRequestsView;
