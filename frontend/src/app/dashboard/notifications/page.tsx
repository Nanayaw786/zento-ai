"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { getNotifications, markNotificationRead, markAllNotificationsRead } from "@/lib/api";

type Notification = {
  id: string;
  message: string;
  is_read: boolean;
  created_at: string;
};

export default function NotificationsPage() {
  const { businessId } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = () => {
    if (!businessId) return;
    getNotifications(businessId)
      .then((data) => setNotifications(data))
      .catch(() => setError("Could not load notifications."))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [businessId]);

  const handleMarkRead = async (id: string) => {
    if (!businessId) return;
    try {
      await markNotificationRead(id, businessId);
      load();
    } catch {
      setError("Could not update notification.");
    }
  };

  const handleMarkAllRead = async () => {
    if (!businessId) return;
    try {
      await markAllNotificationsRead(businessId);
      load();
    } catch {
      setError("Could not update notifications.");
    }
  };

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const timeAgo = (dateStr: string) => {
    const diffMs = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diffMs / 60000);
    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    return new Date(dateStr).toLocaleDateString();
  };

  if (loading) return <p className="text-black/50 text-sm">Loading...</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium text-zento-navy">
          Notifications
          {unreadCount > 0 && (
            <span className="ml-2 text-xs font-medium text-white bg-zento-gold-dark px-2 py-0.5 rounded-full">
              {unreadCount} new
            </span>
          )}
        </h2>
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllRead}
            className="text-sm text-zento-navy hover:underline"
          >
            Mark all as read
          </button>
        )}
      </div>

      {error && (
        <p className="text-red-600 text-sm mb-4 bg-red-50 px-3 py-2 rounded-lg">{error}</p>
      )}

      {notifications.length === 0 ? (
        <p className="text-black/50 text-sm">No notifications yet.</p>
      ) : (
        <div className="bg-white rounded-2xl border border-black/5 divide-y divide-black/5">
          {notifications.map((n) => (
            <div
              key={n.id}
              className={`px-5 py-4 flex items-center justify-between ${
                !n.is_read ? "bg-zento-gold/5" : ""
              }`}
            >
              <div className="flex items-center gap-3">
                {!n.is_read && (
                  <span className="w-2 h-2 rounded-full bg-zento-gold-dark shrink-0" />
                )}
                <div>
                  <p
                    className={`text-sm ${
                      n.is_read ? "text-black/60" : "text-zento-navy font-medium"
                    }`}
                  >
                    {n.message}
                  </p>
                  <p className="text-black/40 text-xs mt-0.5">{timeAgo(n.created_at)}</p>
                </div>
              </div>
              {!n.is_read && (
                <button
                  onClick={() => handleMarkRead(n.id)}
                  className="text-xs text-zento-navy hover:underline shrink-0"
                >
                  Mark read
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}