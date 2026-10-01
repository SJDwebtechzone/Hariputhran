import { useState, useEffect, useCallback, useRef } from "react";
import {
  fetchServiceRequestNotifications,
  markAllServiceRequestsAsRead,
} from "@/admin-service-requests/api";
import { NotificationItem } from "@/types/serviceRequests";
import { toast } from "sonner";

export function useServiceRequestNotifications() {
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [latest, setLatest] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const previousUnreadCountRef = useRef<number | null>(null);

  const loadNotifications = useCallback(async (isBackground = false) => {
    // Only poll when window/tab is visible
    if (typeof document !== "undefined" && document.hidden && isBackground) {
      return;
    }

    try {
      const res = await fetchServiceRequestNotifications();
      if (res && res.success) {
        setUnreadCount(res.unreadCount);
        setLatest(res.latest || []);

        // Show toast notification only if unread count increased after initial load
        if (
          previousUnreadCountRef.current !== null &&
          res.unreadCount > previousUnreadCountRef.current &&
          res.latest &&
          res.latest.length > 0
        ) {
          const newest = res.latest[0];
          toast.info(`New service request from ${newest.customerName}`, {
            description: `${newest.serviceName} • Click notification bell to view.`,
          });
        }

        previousUnreadCountRef.current = res.unreadCount;
      }
    } catch (err: any) {
      // Avoid spamming error popups for background polls
      if (!isBackground) {
        console.warn("[Notifications] Failed to load notification count:", err?.message || err);
      }
    }
  }, []);

  useEffect(() => {
    loadNotifications(false);

    // 30 second polling interval
    const intervalId = setInterval(() => {
      loadNotifications(true);
    }, 30000);

    const handleFocus = () => {
      loadNotifications(true);
    };

    window.addEventListener("focus", handleFocus);
    window.addEventListener("service_requests_updated", handleFocus);

    return () => {
      clearInterval(intervalId);
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("service_requests_updated", handleFocus);
    };
  }, [loadNotifications]);

  const markAllAsRead = async () => {
    try {
      setLoading(true);
      await markAllServiceRequestsAsRead();
      setUnreadCount(0);
      setLatest([]);
      previousUnreadCountRef.current = 0;
      toast.success("All service requests marked as read.");
      window.dispatchEvent(new Event("service_requests_updated"));
    } catch (err: any) {
      toast.error("Failed to mark all as read: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    unreadCount,
    latest,
    loading,
    refresh: () => loadNotifications(false),
    markAllAsRead,
  };
}
