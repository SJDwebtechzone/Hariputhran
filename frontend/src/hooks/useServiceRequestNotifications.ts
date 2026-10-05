import { useState, useEffect, useCallback, useRef } from "react";
import {
  fetchUnifiedNotifications,
  markAllUnifiedNotificationsAsRead,
} from "@/admin-contact-messages/api";
import { UnifiedNotificationItem } from "@/types/contactMessages";
import { toast } from "sonner";

export function useServiceRequestNotifications() {
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [serviceRequestsUnread, setServiceRequestsUnread] = useState<number>(0);
  const [contactMessagesUnread, setContactMessagesUnread] = useState<number>(0);
  const [latest, setLatest] = useState<UnifiedNotificationItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const previousUnreadCountRef = useRef<number | null>(null);

  const loadNotifications = useCallback(async (isBackground = false) => {
    // Only poll when window/tab is visible
    if (typeof document !== "undefined" && document.hidden && isBackground) {
      return;
    }

    try {
      const res = await fetchUnifiedNotifications();
      if (res && res.success) {
        setUnreadCount(res.unreadCount || 0);
        setServiceRequestsUnread(res.serviceRequestsUnread || 0);
        setContactMessagesUnread(res.contactMessagesUnread || 0);
        setLatest(res.latest || []);

        // Show toast notification only if unread count increased after initial load
        if (
          previousUnreadCountRef.current !== null &&
          res.unreadCount > previousUnreadCountRef.current &&
          res.latest &&
          res.latest.length > 0
        ) {
          const newest = res.latest[0];
          if (newest) {
            const isContact = newest.type === "contact_message";
            toast.info(
              isContact
                ? `New contact message from ${newest.name}`
                : `New service request from ${newest.name}`,
              {
                description: `${newest.title} • Click notification bell to view.`,
              }
            );
          }
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
    window.addEventListener("contact_messages_updated", handleFocus);

    return () => {
      clearInterval(intervalId);
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("service_requests_updated", handleFocus);
      window.removeEventListener("contact_messages_updated", handleFocus);
    };
  }, [loadNotifications]);

  const markAllAsRead = async () => {
    try {
      setLoading(true);
      await markAllUnifiedNotificationsAsRead();
      setUnreadCount(0);
      setServiceRequestsUnread(0);
      setContactMessagesUnread(0);
      setLatest([]);
      previousUnreadCountRef.current = 0;
      toast.success("All notifications marked as read.");
      window.dispatchEvent(new Event("service_requests_updated"));
      window.dispatchEvent(new Event("contact_messages_updated"));
    } catch (err: any) {
      toast.error("Failed to mark all as read: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    unreadCount,
    serviceRequestsUnread,
    contactMessagesUnread,
    latest,
    loading,
    refresh: () => loadNotifications(false),
    markAllAsRead,
  };
}

