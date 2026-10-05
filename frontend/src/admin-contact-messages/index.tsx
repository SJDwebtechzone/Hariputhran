import { useState, useEffect, useCallback } from "react";
import { useSearch, useNavigate } from "@tanstack/react-router";
import {
  Mail,
  Search,
  Filter,
  RefreshCcw,
  CheckCheck,
  Clock,
  Phone,
  User,
  AlertCircle,
  CheckCircle2,
  Trash2,
  X,
  ChevronLeft,
  ChevronRight,
  Copy,
  Check,
  Send,
  Loader2,
  FileText,
  Calendar,
  MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { AdminLayout } from "@/components/admin/AdminLayout";
import {
  ContactMessageItem,
  ContactMessageCounts,
  ContactMessageStatus,
} from "@/types/contactMessages";
import {
  fetchAdminContactMessages,
  fetchAdminContactMessageById,
  updateAdminContactMessage,
  deleteAdminContactMessage,
  markAllContactMessagesAsRead,
} from "@/admin-contact-messages/api";
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
  ContactMessageStatus,
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

export function AdminContactMessagesView() {
  const searchParams = useSearch({ strict: false }) as { open?: string | number };
  const navigate = useNavigate();

  const [items, setItems] = useState<ContactMessageItem[]>([]);
  const [counts, setCounts] = useState<ContactMessageCounts>({
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
  const [unreadOnly, setUnreadOnly] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [debouncedSearch, setDebouncedSearch] = useState<string>("");

  // Drawer / Detail state
  const [selectedMessage, setSelectedMessage] = useState<ContactMessageItem | null>(null);
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

  const loadMessages = useCallback(
    async (pageToLoad = 1) => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetchAdminContactMessages({
          page: pageToLoad,
          limit: 20,
          status: statusFilter,
          q: debouncedSearch,
          unread: unreadOnly,
        });

        if (res.success) {
          setItems(res.data);
          setCounts(res.counts);
          setPagination(res.pagination);
        }
      } catch (err: any) {
        console.error("Failed to fetch contact messages:", err);
        setError(err.message || "Failed to load contact messages.");
      } finally {
        setLoading(false);
      }
    },
    [statusFilter, debouncedSearch, unreadOnly]
  );

  useEffect(() => {
    loadMessages(1);
  }, [loadMessages]);

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
      const res = await fetchAdminContactMessageById(id);
      const item = res.data;
      setSelectedMessage(item);
      setNotesInput(item.adminNotes || "");

      // If unread, mark as read immediately
      if (!item.isRead) {
        await updateAdminContactMessage(id, { isRead: true });
        setItems((prev) =>
          prev.map((r) => (r.id === id ? { ...r, isRead: true } : r))
        );
        setCounts((prev) => ({
          ...prev,
          unread: Math.max(0, prev.unread - 1),
        }));
        window.dispatchEvent(new Event("contact_messages_updated"));
      }
    } catch (err: any) {
      toast.error("Failed to open contact message: " + err.message);
    } finally {
      setDrawerLoading(false);
    }
  };

  const closeDrawer = () => {
    setSelectedMessage(null);
    setNotesInput("");
    setDeletingId(null);
    // Clear ?open from URL
    if (searchParams?.open) {
      navigate({
        to: "/admin/contact-messages",
        search: {} as any,
        replace: true,
      });
    }
  };

  const handleStatusChange = async (newStatus: ContactMessageStatus) => {
    if (!selectedMessage) return;
    try {
      const res = await updateAdminContactMessage(selectedMessage.id, {
        status: newStatus,
      });
      const updated = res.data;
      setSelectedMessage(updated);
      setItems((prev) =>
        prev.map((r) => (r.id === updated.id ? updated : r))
      );
      toast.success(`Status updated to ${STATUS_CONFIG[newStatus].label}`);
      loadMessages(pagination.page);
      window.dispatchEvent(new Event("contact_messages_updated"));
    } catch (err: any) {
      toast.error("Failed to update status: " + err.message);
    }
  };

  const handleSaveNotes = async () => {
    if (!selectedMessage) return;
    setSavingNotes(true);
    try {
      const res = await updateAdminContactMessage(selectedMessage.id, {
        adminNotes: notesInput.trim(),
      });
      const updated = res.data;
      setSelectedMessage(updated);
      setItems((prev) =>
        prev.map((r) => (r.id === updated.id ? updated : r))
      );
      toast.success("Admin notes saved successfully");
    } catch (err: any) {
      toast.error("Failed to save notes: " + err.message);
    } finally {
      setSavingNotes(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to permanently delete this contact message?")) {
      return;
    }
    setDeletingId(id);
    try {
      await deleteAdminContactMessage(id);
      toast.success("Contact message deleted.");
      if (selectedMessage?.id === id) {
        closeDrawer();
      }
      loadMessages(pagination.page);
      window.dispatchEvent(new Event("contact_messages_updated"));
    } catch (err: any) {
      toast.error("Failed to delete contact message: " + err.message);
    } finally {
      setDeletingId(null);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllContactMessagesAsRead();
      toast.success("All contact messages marked as read.");
      setItems((prev) => prev.map((r) => ({ ...r, isRead: true })));
      setCounts((prev) => ({ ...prev, unread: 0 }));
      window.dispatchEvent(new Event("contact_messages_updated"));
    } catch (err: any) {
      toast.error("Failed to mark all as read: " + err.message);
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
    toast.success(`Copied ${type === "phone" ? "phone number" : "email"} to clipboard`);
  };

  return (
    <AdminLayout
      title="Contact Messages"
      subtitle="Inquiries and direct messages received from the website contact page"
      activeNav="contact-messages"
    >
      <div className="space-y-6">
        {/* Top Metric Cards */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {[
            {
              id: "all",
              label: "Total Messages",
              count: counts.total,
              color: "border-slate-200 bg-white text-[#082342]",
              activeRing: statusFilter === "all" && !unreadOnly ? "ring-2 ring-[#082342]" : "",
              onClick: () => {
                setStatusFilter("all");
                setUnreadOnly(false);
              },
            },
            {
              id: "unread",
              label: "Unread",
              count: counts.unread,
              color: "border-orange-200 bg-orange-50/50 text-[#f97316]",
              activeRing: unreadOnly ? "ring-2 ring-[#f97316]" : "",
              onClick: () => {
                setUnreadOnly(true);
                setStatusFilter("all");
              },
            },
            {
              id: "new",
              label: "New",
              count: counts.new,
              color: "border-orange-200 bg-white text-[#f97316]",
              activeRing: statusFilter === "new" && !unreadOnly ? "ring-2 ring-[#f97316]" : "",
              onClick: () => {
                setStatusFilter("new");
                setUnreadOnly(false);
              },
            },
            {
              id: "contacted",
              label: "Contacted",
              count: counts.contacted,
              color: "border-sky-200 bg-white text-[#0284c7]",
              activeRing: statusFilter === "contacted" && !unreadOnly ? "ring-2 ring-[#0284c7]" : "",
              onClick: () => {
                setStatusFilter("contacted");
                setUnreadOnly(false);
              },
            },
            {
              id: "in_progress",
              label: "In Progress",
              count: counts.in_progress,
              color: "border-amber-200 bg-white text-amber-700",
              activeRing: statusFilter === "in_progress" && !unreadOnly ? "ring-2 ring-amber-500" : "",
              onClick: () => {
                setStatusFilter("in_progress");
                setUnreadOnly(false);
              },
            },
            {
              id: "closed",
              label: "Closed",
              count: counts.closed,
              color: "border-emerald-200 bg-white text-emerald-700",
              activeRing: statusFilter === "closed" && !unreadOnly ? "ring-2 ring-emerald-500" : "",
              onClick: () => {
                setStatusFilter("closed");
                setUnreadOnly(false);
              },
            },
          ].map((card) => (
            <button
              key={card.id}
              onClick={card.onClick}
              className={`flex flex-col justify-between rounded-xl border p-4 text-left transition-all hover:shadow-md cursor-pointer ${card.color} ${card.activeRing}`}
            >
              <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-slate-500">
                {card.label}
              </span>
              <span className="mt-2 font-['Poppins',sans-serif] text-2xl font-extrabold tracking-tight">
                {card.count}
              </span>
            </button>
          ))}
        </div>

        {/* Toolbar: Search, Filters & Actions */}
        <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-xs lg:flex-row lg:items-center lg:justify-between">
          {/* Left: Search input */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by customer name, phone, email, subject, or message..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 pl-10 pr-4 text-xs text-[#082342] placeholder:text-slate-400 focus:border-[#0284c7] focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#0284c7]/20"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="size-3.5" />
              </button>
            )}
          </div>

          {/* Right: Actions */}
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => loadMessages(pagination.page)}
              className="border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              <RefreshCcw className="mr-1.5 size-3.5" />
              Refresh
            </Button>

            {counts.unread > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleMarkAllAsRead}
                className="border-orange-200 bg-orange-50/30 text-xs font-semibold text-[#f97316] hover:bg-orange-50"
              >
                <CheckCheck className="mr-1.5 size-3.5" />
                Mark All Read
              </Button>
            )}
          </div>
        </div>

        {/* Messages Table */}
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xs">
          {loading ? (
            <div className="flex min-h-[360px] flex-col items-center justify-center gap-3">
              <Loader2 className="size-8 animate-spin text-[#0284c7]" />
              <p className="font-mono text-xs text-slate-500">Loading contact messages...</p>
            </div>
          ) : error ? (
            <div className="flex min-h-[320px] flex-col items-center justify-center p-8 text-center">
              <AlertCircle className="size-10 text-rose-500 mb-2" />
              <h3 className="font-['Poppins',sans-serif] text-base font-bold text-[#082342]">
                Failed to load messages
              </h3>
              <p className="text-xs text-slate-500 mt-1 mb-4">{error}</p>
              <Button size="sm" onClick={() => loadMessages(1)}>
                Try Again
              </Button>
            </div>
          ) : items.length === 0 ? (
            <div className="flex min-h-[360px] flex-col items-center justify-center p-8 text-center">
              <div className="grid size-14 place-items-center rounded-2xl bg-slate-50 text-slate-400 mb-3 border border-slate-200">
                <Mail className="size-6" />
              </div>
              <h3 className="font-['Poppins',sans-serif] text-base font-bold text-[#082342]">
                No contact messages found
              </h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm">
                {searchQuery || statusFilter !== "all" || unreadOnly
                  ? "Try adjusting your filters or search terms."
                  : "When visitors send inquiries through the Contact page, they will appear here in real-time."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-slate-200 bg-slate-50/75 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <tr>
                    <th className="py-3.5 pl-6 pr-3">Customer</th>
                    <th className="px-3 py-3.5">Subject & Message</th>
                    <th className="px-3 py-3.5">Status</th>
                    <th className="px-3 py-3.5">Received</th>
                    <th className="py-3.5 pl-3 pr-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {items.map((item) => {
                    const status = STATUS_CONFIG[item.status] || STATUS_CONFIG.new;
                    const isSelected = selectedMessage?.id === item.id;
                    const initial = item.customerName.charAt(0).toUpperCase() || "C";

                    return (
                      <tr
                        key={item.id}
                        onClick={() => openDetailDrawer(item.id)}
                        className={`group cursor-pointer transition-colors ${
                          !item.isRead ? "bg-orange-50/30 font-semibold" : "hover:bg-slate-50/80"
                        } ${isSelected ? "bg-sky-50/60" : ""}`}
                      >
                        {/* Customer */}
                        <td className="py-4 pl-6 pr-3">
                          <div className="flex items-center gap-3">
                            <div className="relative">
                              <div className="grid size-9 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-[#082342] to-[#0284c7] font-mono text-xs font-bold text-white shadow-xs">
                                {initial}
                              </div>
                              {!item.isRead && (
                                <span className="absolute -right-1 -top-1 size-2.5 rounded-full border-2 border-white bg-[#f97316]" />
                              )}
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-1.5">
                                <span className="truncate font-bold text-[#082342]">
                                  {item.customerName}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 font-mono text-[11px] text-slate-500">
                                <span>{item.phone}</span>
                              </div>
                            </div>
                          </div>
                        </td>

                        {/* Subject & Message snippet */}
                        <td className="px-3 py-4 max-w-[280px]">
                          <div className="font-semibold text-slate-800 truncate">
                            {item.subject || "General Inquiry"}
                          </div>
                          <p className="mt-0.5 line-clamp-1 text-[11.5px] text-slate-500 font-normal">
                            {item.message}
                          </p>
                        </td>

                        {/* Status */}
                        <td className="px-3 py-4">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-bold ${status.badgeClass}`}
                          >
                            <span className={`size-1.5 rounded-full ${status.dotClass}`} />
                            {status.label}
                          </span>
                        </td>

                        {/* Received */}
                        <td className="px-3 py-4 text-slate-500">
                          <div className="flex items-center gap-1 font-mono text-[11px]">
                            <Clock className="size-3 text-slate-400" />
                            {formatRelativeTime(item.createdAt)}
                          </div>
                          <div className="text-[10px] text-slate-400">
                            {new Date(item.createdAt).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                            })}
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="py-4 pl-3 pr-6 text-right">
                          <div className="inline-flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                openDetailDrawer(item.id);
                              }}
                              className="h-8 rounded-lg px-2.5 text-xs font-semibold text-[#0284c7] hover:bg-sky-50"
                            >
                              View
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(item.id);
                              }}
                              disabled={deletingId === item.id}
                              className="h-8 rounded-lg px-2 text-rose-600 hover:bg-rose-50"
                            >
                              <Trash2 className="size-3.5" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination Footer */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50/50 px-6 py-3">
              <span className="font-mono text-xs text-slate-500">
                Page {pagination.page} of {pagination.totalPages} ({pagination.total} total messages)
              </span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={pagination.page <= 1}
                  onClick={() => loadMessages(pagination.page - 1)}
                  className="h-8 text-xs font-semibold"
                >
                  <ChevronLeft className="mr-1 size-3.5" /> Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={pagination.page >= pagination.totalPages}
                  onClick={() => loadMessages(pagination.page + 1)}
                  className="h-8 text-xs font-semibold"
                >
                  Next <ChevronRight className="ml-1 size-3.5" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Detail Drawer (Slide-over panel) */}
      {selectedMessage && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <div
            onClick={closeDrawer}
            className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity animate-in fade-in"
          />

          <div className="fixed inset-y-0 right-0 flex max-w-full pl-10">
            <div className="w-screen max-w-xl bg-white shadow-2xl animate-in slide-in-from-right duration-300 flex flex-col">
              {/* Drawer Header */}
              <div className="flex items-center justify-between border-b border-slate-100 bg-[#082342] px-6 py-5 text-white">
                <div className="flex items-center gap-3">
                  <div className="grid size-10 place-items-center rounded-xl bg-white/10 text-white">
                    <Mail className="size-5 text-[#f97316]" />
                  </div>
                  <div>
                    <h2 className="font-['Poppins',sans-serif] text-base font-bold">
                      Contact Message #{selectedMessage.id}
                    </h2>
                    <p className="font-mono text-[11px] text-slate-300">
                      Received {formatFullDateTime(selectedMessage.createdAt)}
                    </p>
                  </div>
                </div>

                <button
                  onClick={closeDrawer}
                  className="rounded-lg p-2 text-slate-400 hover:bg-white/10 hover:text-white transition-colors"
                >
                  <X className="size-5" />
                </button>
              </div>

              {/* Drawer Body (Scrollable) */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {/* Status Selector Card */}
                <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-4">
                  <label className="block font-mono text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
                    Current Status
                  </label>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                    {(["new", "contacted", "in_progress", "closed"] as ContactMessageStatus[]).map(
                      (statusKey) => {
                        const cfg = STATUS_CONFIG[statusKey];
                        const isActive = selectedMessage.status === statusKey;
                        return (
                          <button
                            key={statusKey}
                            type="button"
                            onClick={() => handleStatusChange(statusKey)}
                            className={`flex items-center justify-center gap-1.5 rounded-xl border py-2.5 text-xs font-bold transition-all cursor-pointer ${
                              isActive
                                ? `${cfg.badgeClass} ring-2 ring-offset-1 shadow-xs`
                                : "border-slate-200 bg-white text-slate-600 hover:bg-slate-100"
                            }`}
                          >
                            <span className={`size-1.5 rounded-full ${cfg.dotClass}`} />
                            {cfg.label}
                          </button>
                        );
                      }
                    )}
                  </div>
                </div>

                {/* Customer Contact Details Card */}
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
                  <h3 className="font-['Poppins',sans-serif] text-sm font-bold text-[#082342] flex items-center gap-2">
                    <User className="size-4 text-[#0284c7]" />
                    Customer Information
                  </h3>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                      <span className="font-mono text-[10px] uppercase text-slate-400 font-bold block">
                        Full Name
                      </span>
                      <span className="font-bold text-xs text-[#082342] mt-0.5 block">
                        {selectedMessage.customerName}
                      </span>
                    </div>

                    <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                      <span className="font-mono text-[10px] uppercase text-slate-400 font-bold block">
                        Phone Number
                      </span>
                      <div className="flex items-center justify-between mt-0.5">
                        <a
                          href={`tel:${selectedMessage.phone}`}
                          className="font-mono font-bold text-xs text-[#0284c7] hover:underline"
                        >
                          {selectedMessage.phone}
                        </a>
                        <button
                          type="button"
                          onClick={() => copyToClipboard(selectedMessage.phone, "phone")}
                          className="text-slate-400 hover:text-slate-600"
                          title="Copy phone"
                        >
                          {isCopiedPhone ? <Check className="size-3.5 text-emerald-600" /> : <Copy className="size-3.5" />}
                        </button>
                      </div>
                    </div>

                    <div className="col-span-full rounded-xl border border-slate-100 bg-slate-50 p-3">
                      <span className="font-mono text-[10px] uppercase text-slate-400 font-bold block">
                        Email Address
                      </span>
                      <div className="flex items-center justify-between mt-0.5">
                        <a
                          href={`mailto:${selectedMessage.customerEmail}`}
                          className="font-mono font-bold text-xs text-[#0284c7] hover:underline truncate mr-2"
                        >
                          {selectedMessage.customerEmail}
                        </a>
                        <button
                          type="button"
                          onClick={() => copyToClipboard(selectedMessage.customerEmail, "email")}
                          className="text-slate-400 hover:text-slate-600 shrink-0"
                          title="Copy email"
                        >
                          {isCopiedEmail ? <Check className="size-3.5 text-emerald-600" /> : <Copy className="size-3.5" />}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Message Details Card */}
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-4">
                  <h3 className="font-['Poppins',sans-serif] text-sm font-bold text-[#082342] flex items-center gap-2">
                    <MessageSquare className="size-4 text-[#f97316]" />
                    Subject & Inquiry
                  </h3>

                  <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-4">
                    <span className="font-mono text-[10px] uppercase text-slate-400 font-bold block mb-1">
                      Subject
                    </span>
                    <p className="text-xs font-bold text-slate-900">
                      {selectedMessage.subject || "General Inquiry"}
                    </p>
                  </div>

                  <div className="rounded-xl border border-slate-100 bg-slate-50/50 p-4">
                    <span className="font-mono text-[10px] uppercase text-slate-400 font-bold block mb-1">
                      Message Content
                    </span>
                    <p className="text-xs leading-relaxed text-slate-700 whitespace-pre-wrap">
                      {selectedMessage.message}
                    </p>
                  </div>
                </div>

                {/* Internal Admin Notes */}
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs space-y-3">
                  <h3 className="font-['Poppins',sans-serif] text-sm font-bold text-[#082342] flex items-center gap-2">
                    <FileText className="size-4 text-amber-600" />
                    Internal Admin Notes
                  </h3>
                  <p className="text-[11px] text-slate-500">
                    Add private notes for staff (follow-up status, quoted estimates, site visit dates).
                  </p>

                  <textarea
                    value={notesInput}
                    onChange={(e) => setNotesInput(e.target.value)}
                    rows={4}
                    placeholder="Write internal notes regarding this contact message here..."
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 p-3 text-xs text-[#082342] placeholder:text-slate-400 focus:border-[#0284c7] focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#0284c7]/20"
                  />

                  <div className="flex justify-end">
                    <Button
                      size="sm"
                      onClick={handleSaveNotes}
                      disabled={savingNotes}
                      className="bg-[#082342] hover:bg-[#082342]/90 text-xs font-bold text-white"
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

              {/* Drawer Footer Actions */}
              <div className="border-t border-slate-200 bg-slate-50 p-4 flex items-center justify-between">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(selectedMessage.id)}
                  className="text-xs font-semibold text-rose-600 hover:bg-rose-50"
                >
                  <Trash2 className="mr-1.5 size-3.5" />
                  Delete Message
                </Button>

                <Button
                  size="sm"
                  onClick={closeDrawer}
                  className="bg-[#082342] hover:bg-[#082342]/90 text-xs font-bold text-white"
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
export default AdminContactMessagesView;
