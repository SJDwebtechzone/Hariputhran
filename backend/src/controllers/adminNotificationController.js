const pool = require("../db");

// 1. GET /api/admin/notifications (Unified Notifications from service_requests and contact_messages)
async function getAdminNotifications(req, res) {
  let client;
  try {
    client = await pool.connect();

    // Query 1: Unread counts from both tables
    const countsQuery = `
      SELECT 
        (SELECT COUNT(*) FROM service_requests WHERE is_read = false) as service_requests_unread,
        (SELECT COUNT(*) FROM contact_messages WHERE is_read = false) as contact_messages_unread;
    `;
    const countsRes = await client.query(countsQuery);
    const serviceRequestsUnread = parseInt(countsRes.rows[0].service_requests_unread, 10) || 0;
    const contactMessagesUnread = parseInt(countsRes.rows[0].contact_messages_unread, 10) || 0;
    const unreadCount = serviceRequestsUnread + contactMessagesUnread;

    // Query 2: Up to 6 newest unread from BOTH tables by created_at
    const latestQuery = `
      (
        SELECT 
          'service_request' as type,
          id,
          customer_name as name,
          service_name as title,
          created_at
        FROM service_requests
        WHERE is_read = false
      )
      UNION ALL
      (
        SELECT 
          'contact_message' as type,
          id,
          customer_name as name,
          COALESCE(subject, 'General Inquiry') as title,
          created_at
        FROM contact_messages
        WHERE is_read = false
      )
      ORDER BY created_at DESC
      LIMIT 6;
    `;
    const latestRes = await client.query(latestQuery);

    const formattedLatest = latestRes.rows.map((row) => ({
      type: row.type,
      id: Number(row.id),
      name: row.name,
      title: row.title,
      createdAt: row.created_at,
    }));

    return res.json({
      success: true,
      unreadCount,
      serviceRequestsUnread,
      contactMessagesUnread,
      latest: formattedLatest,
    });
  } catch (err) {
    console.error("Unified notifications error:", err.message);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve notifications.",
    });
  } finally {
    if (client) client.release();
  }
}

// 2. PATCH /api/admin/notifications/read-all (Mark all unread in both tables)
async function markAllNotificationsAsRead(req, res) {
  let client;
  try {
    client = await pool.connect();

    await client.query("BEGIN;");
    await client.query("UPDATE service_requests SET is_read = true WHERE is_read = false;");
    await client.query("UPDATE contact_messages SET is_read = true WHERE is_read = false;");
    await client.query("COMMIT;");

    return res.json({
      success: true,
      message: "All notifications marked as read.",
      unreadCount: 0,
      serviceRequestsUnread: 0,
      contactMessagesUnread: 0,
      latest: [],
    });
  } catch (err) {
    if (client) {
      try {
        await client.query("ROLLBACK;");
      } catch (rbErr) {
        // ignore rollback error
      }
    }
    console.error("Unified mark all read error:", err.message);
    return res.status(500).json({
      success: false,
      message: "Failed to mark notifications as read.",
    });
  } finally {
    if (client) client.release();
  }
}

module.exports = {
  getAdminNotifications,
  markAllNotificationsAsRead,
};
