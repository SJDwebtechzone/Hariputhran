import { useState, useRef, useEffect } from "react";
import { Bell, CheckCheck, Clock, ExternalLink, Inbox, Mail, MessageSquareText } from "lucide-react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useServiceRequestNotifications } from "@/hooks/useServiceRequestNotifications";
import { UnifiedNotificationItem } from "@/types/contactMessages";

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

export function NotificationBell() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { unreadCount, latest, loading, markAllAsRead } = useServiceRequestNotifications();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Close on outside click or ESC
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setDropdownOpen(false);
      }
    };

    if (dropdownOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
      document.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [dropdownOpen]);

  const handleNotificationClick = (item: UnifiedNotificationItem) => {
    setDropdownOpen(false);
    if (item.type === "contact_message") {
      navigate({
        to: "/admin/contact-messages",
        search: { open: item.id } as any,
      });
    } else {
      navigate({
        to: "/admin/service-requests",
        search: { open: item.id } as any,
      });
    }
  };

  const badgeText = unreadCount > 9 ? "9+" : String(unreadCount);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        type="button"
        onClick={() => setDropdownOpen((prev) => !prev)}
        aria-label="View notifications"
        aria-expanded={dropdownOpen}
        className="relative grid size-10 place-items-center rounded-full border border-slate-200 bg-slate-50 text-slate-600 transition-colors hover:bg-slate-100 hover:text-[#082342] cursor-pointer"
      >
        <Bell className="size-4" />

        {/* Live Unread Badge */}
        {unreadCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex min-w-[18px] h-[18px] items-center justify-center rounded-full bg-[#f97316] px-1 font-mono text-[10px] font-extrabold text-white shadow-xs animate-in zoom-in-50">
            {badgeText}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      {dropdownOpen && (
        <div className="absolute right-0 top-12 z-50 w-[380px] overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-xl animate-in fade-in-50 slide-in-from-top-2">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/80 px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="font-['Poppins',sans-serif] text-sm font-bold text-[#082342]">
                Notifications
              </span>
              {unreadCount > 0 && (
                <span className="rounded-full bg-[#0284c7]/10 px-2 py-0.5 font-mono text-[10.5px] font-bold text-[#0284c7]">
                  {unreadCount} new
                </span>
              )}
            </div>

            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllAsRead}
                disabled={loading}
                className="inline-flex items-center gap-1 font-mono text-[11px] font-semibold text-[#0284c7] hover:text-[#082342] transition-colors cursor-pointer"
              >
                <CheckCheck className="size-3.5" />
                Mark all read
              </button>
            )}
          </div>

          {/* List Body */}
          <div className="max-h-[360px] divide-y divide-slate-100 overflow-y-auto">
            {latest.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center text-slate-400">
                <div className="grid size-11 place-items-center rounded-full bg-slate-100 text-slate-400 mb-2">
                  <Inbox className="size-5" />
                </div>
                <p className="font-semibold text-xs text-slate-600">You're all caught up!</p>
                <p className="text-[11px] text-slate-400 mt-0.5">No unread requests or messages.</p>
              </div>
            ) : (
              latest.map((item) => {
                const initial = item.name.charAt(0).toUpperCase() || "C";
                const isContact = item.type === "contact_message";

                return (
                  <div
                    key={`${item.type}-${item.id}`}
                    onClick={() => handleNotificationClick(item)}
                    className="flex cursor-pointer items-start gap-3 p-3.5 transition-colors hover:bg-sky-50/50"
                  >
                    {/* Customer Avatar */}
                    <div
                      className={`grid size-8 shrink-0 place-items-center rounded-full font-mono text-xs font-bold text-white shadow-xs ${
                        isContact
                          ? "bg-gradient-to-br from-[#082342] to-[#f97316]"
                          : "bg-gradient-to-br from-[#082342] to-[#0284c7]"
                      }`}
                    >
                      {initial}
                    </div>

                    {/* Content */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-1">
                        <span className="truncate text-xs font-bold text-[#082342]">
                          {isContact ? `Contact: ${item.name}` : `Request: ${item.name}`}
                        </span>
                        <span className="size-1.5 shrink-0 rounded-full bg-[#f97316]" />
                      </div>
                      <p className="truncate text-[11.5px] font-medium text-slate-600 mt-0.5">
                        {item.title}
                      </p>
                      <div className="mt-1 flex items-center justify-between font-mono text-[10px] text-slate-400">
                        <div className="flex items-center gap-1">
                          <Clock className="size-3" />
                          <span>{formatRelativeTime(item.createdAt)}</span>
                        </div>
                        <span
                          className={`rounded-md px-1.5 py-0.5 font-bold uppercase tracking-wider text-[9px] ${
                            isContact
                              ? "bg-orange-50 text-[#f97316]"
                              : "bg-sky-50 text-[#0284c7]"
                          }`}
                        >
                          {isContact ? "Contact" : "Service"}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Links */}
          <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/75 px-4 py-2.5">
            <Link
              to="/admin/service-requests"
              onClick={() => setDropdownOpen(false)}
              className="inline-flex items-center gap-1 font-mono text-[11px] font-bold text-[#0284c7] hover:text-[#082342] transition-colors"
            >
              <MessageSquareText className="size-3" />
              Service Requests
            </Link>

            <Link
              to="/admin/contact-messages"
              onClick={() => setDropdownOpen(false)}
              className="inline-flex items-center gap-1 font-mono text-[11px] font-bold text-[#f97316] hover:text-[#082342] transition-colors"
            >
              <Mail className="size-3" />
              Contact Messages
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
export default NotificationBell;

