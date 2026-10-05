const pool = require("../db");

/**
 * Generate an array of date strings for the last N days in 'YYYY-MM-DD' format (Asia/Kolkata timezone)
 */
function getLastNDaysIST(n = 30) {
  const dates = [];
  // Current time in Asia/Kolkata
  const now = new Date();
  
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    // Format to YYYY-MM-DD in Asia/Kolkata
    const formatter = new Intl.DateTimeFormat("en-CA", {
      timeZone: "Asia/Kolkata",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
    dates.push(formatter.format(d));
  }
  return dates;
}

// GET /api/admin/overview
async function getAdminOverview(req, res) {
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");

  const warnings = [];
  let client;
  let dbLatencyMs = null;

  try {
    const startDb = Date.now();
    client = await pool.connect();
    await client.query("SELECT 1;");
    dbLatencyMs = Date.now() - startDb;
  } catch (dbConnErr) {
    warnings.push("database_connection");
    console.error("[AdminOverview] Database connection error:", dbConnErr.message);
    return res.status(500).json({
      success: false,
      message: "Database connection failed.",
      generatedAt: new Date().toISOString(),
      warnings: ["database_connection"],
    });
  }

  // 1. Service Requests Metrics
  let serviceRequestsData = null;
  try {
    const srStatsQuery = `
      SELECT
        COUNT(*) AS total,
        COUNT(*) FILTER (WHERE is_read = false) AS unread,
        COUNT(*) FILTER (WHERE created_at >= (NOW() AT TIME ZONE 'Asia/Kolkata' - INTERVAL '7 days')) AS this_week,
        COUNT(*) FILTER (WHERE created_at >= date_trunc('month', NOW() AT TIME ZONE 'Asia/Kolkata') AT TIME ZONE 'Asia/Kolkata') AS this_month,
        COUNT(*) FILTER (
          WHERE created_at >= date_trunc('month', NOW() AT TIME ZONE 'Asia/Kolkata' - INTERVAL '1 month') AT TIME ZONE 'Asia/Kolkata'
            AND created_at < date_trunc('month', NOW() AT TIME ZONE 'Asia/Kolkata') AT TIME ZONE 'Asia/Kolkata'
        ) AS last_month,
        COUNT(*) FILTER (WHERE status = 'new') AS status_new,
        COUNT(*) FILTER (WHERE status = 'contacted') AS status_contacted,
        COUNT(*) FILTER (WHERE status = 'in_progress') AS status_in_progress,
        COUNT(*) FILTER (WHERE status = 'closed') AS status_closed
      FROM service_requests;
    `;
    const srStatsRes = await client.query(srStatsQuery);
    const srRow = srStatsRes.rows[0] || {};

    // Top 5 services requested
    const srByServiceQuery = `
      SELECT
        COALESCE(service_name, 'General Service') AS name,
        COUNT(*) AS count
      FROM service_requests
      GROUP BY service_name
      ORDER BY count DESC
      LIMIT 5;
    `;
    const srByServiceRes = await client.query(srByServiceQuery);

    // Daily for last 30 days
    const srDailyQuery = `
      SELECT
        to_char(created_at AT TIME ZONE 'Asia/Kolkata', 'YYYY-MM-DD') AS date,
        COUNT(*) AS count
      FROM service_requests
      WHERE created_at >= (NOW() AT TIME ZONE 'Asia/Kolkata' - INTERVAL '30 days')
      GROUP BY to_char(created_at AT TIME ZONE 'Asia/Kolkata', 'YYYY-MM-DD');
    `;
    const srDailyRes = await client.query(srDailyQuery);
    const srDailyMap = {};
    for (const r of srDailyRes.rows) {
      srDailyMap[r.date] = parseInt(r.count, 10) || 0;
    }

    const last30Days = getLastNDaysIST(30);
    const srDailySeries = last30Days.map((date) => ({
      date,
      count: srDailyMap[date] || 0,
    }));

    serviceRequestsData = {
      total: parseInt(srRow.total, 10) || 0,
      unread: parseInt(srRow.unread, 10) || 0,
      thisWeek: parseInt(srRow.this_week, 10) || 0,
      thisMonth: parseInt(srRow.this_month, 10) || 0,
      lastMonth: parseInt(srRow.last_month, 10) || 0,
      byStatus: {
        new: parseInt(srRow.status_new, 10) || 0,
        contacted: parseInt(srRow.status_contacted, 10) || 0,
        in_progress: parseInt(srRow.status_in_progress, 10) || 0,
        closed: parseInt(srRow.status_closed, 10) || 0,
      },
      byService: srByServiceRes.rows.map((r) => ({
        name: r.name,
        count: parseInt(r.count, 10) || 0,
      })),
      daily: srDailySeries,
    };
  } catch (srErr) {
    console.error("[AdminOverview] Failed to fetch service requests stats:", srErr.message);
    warnings.push("service_requests");
  }

  // 2. Contact Messages Metrics
  let contactMessagesData = null;
  try {
    const cmStatsQuery = `
      SELECT
        COUNT(*) AS total,
        COUNT(*) FILTER (WHERE is_read = false) AS unread,
        COUNT(*) FILTER (WHERE created_at >= (NOW() AT TIME ZONE 'Asia/Kolkata' - INTERVAL '7 days')) AS this_week,
        COUNT(*) FILTER (WHERE created_at >= date_trunc('month', NOW() AT TIME ZONE 'Asia/Kolkata') AT TIME ZONE 'Asia/Kolkata') AS this_month,
        COUNT(*) FILTER (
          WHERE created_at >= date_trunc('month', NOW() AT TIME ZONE 'Asia/Kolkata' - INTERVAL '1 month') AT TIME ZONE 'Asia/Kolkata'
            AND created_at < date_trunc('month', NOW() AT TIME ZONE 'Asia/Kolkata') AT TIME ZONE 'Asia/Kolkata'
        ) AS last_month
      FROM contact_messages;
    `;
    const cmStatsRes = await client.query(cmStatsQuery);
    const cmRow = cmStatsRes.rows[0] || {};

    // Daily for last 30 days
    const cmDailyQuery = `
      SELECT
        to_char(created_at AT TIME ZONE 'Asia/Kolkata', 'YYYY-MM-DD') AS date,
        COUNT(*) AS count
      FROM contact_messages
      WHERE created_at >= (NOW() AT TIME ZONE 'Asia/Kolkata' - INTERVAL '30 days')
      GROUP BY to_char(created_at AT TIME ZONE 'Asia/Kolkata', 'YYYY-MM-DD');
    `;
    const cmDailyRes = await client.query(cmDailyQuery);
    const cmDailyMap = {};
    for (const r of cmDailyRes.rows) {
      cmDailyMap[r.date] = parseInt(r.count, 10) || 0;
    }

    const last30Days = getLastNDaysIST(30);
    const cmDailySeries = last30Days.map((date) => ({
      date,
      count: cmDailyMap[date] || 0,
    }));

    contactMessagesData = {
      total: parseInt(cmRow.total, 10) || 0,
      unread: parseInt(cmRow.unread, 10) || 0,
      thisWeek: parseInt(cmRow.this_week, 10) || 0,
      thisMonth: parseInt(cmRow.this_month, 10) || 0,
      lastMonth: parseInt(cmRow.last_month, 10) || 0,
      daily: cmDailySeries,
    };
  } catch (cmErr) {
    console.error("[AdminOverview] Failed to fetch contact messages stats:", cmErr.message);
    warnings.push("contact_messages");
  }

  // 3. Combined Enquiries (This Month vs Last Month)
  let enquiriesData = null;
  try {
    const srThisMonth = serviceRequestsData?.thisMonth || 0;
    const srLastMonth = serviceRequestsData?.lastMonth || 0;
    const cmThisMonth = contactMessagesData?.thisMonth || 0;
    const cmLastMonth = contactMessagesData?.lastMonth || 0;

    const totalThisMonth = srThisMonth + cmThisMonth;
    const totalLastMonth = srLastMonth + cmLastMonth;

    let changePercent = null;
    if (totalLastMonth > 0) {
      changePercent = Math.round(((totalThisMonth - totalLastMonth) / totalLastMonth) * 1000) / 10;
    }

    enquiriesData = {
      thisMonth: totalThisMonth,
      lastMonth: totalLastMonth,
      changePercent,
    };
  } catch (enqErr) {
    console.error("[AdminOverview] Failed to compute combined enquiries:", enqErr.message);
    warnings.push("enquiries");
  }

  // 4. Services Metrics (Excluding binary image data)
  let servicesData = null;
  try {
    const servicesQuery = `
      SELECT
        COUNT(*) AS total,
        COUNT(*) FILTER (WHERE is_active = true) AS active,
        COUNT(*) FILTER (WHERE is_active = false) AS hidden
      FROM services;
    `;
    const servicesRes = await client.query(servicesQuery);
    const sRow = servicesRes.rows[0] || {};
    servicesData = {
      total: parseInt(sRow.total, 10) || 0,
      active: parseInt(sRow.active, 10) || 0,
      hidden: parseInt(sRow.hidden, 10) || 0,
    };
  } catch (sErr) {
    console.error("[AdminOverview] Failed to fetch services stats:", sErr.message);
    warnings.push("services");
  }

  // 5. Recent Works Metrics (Excluding binary image data)
  let recentWorksData = null;
  try {
    const rwQuery = `
      SELECT
        COUNT(*) AS total,
        COUNT(*) FILTER (WHERE image_data IS NOT NULL) AS with_custom_photo
      FROM home_recent_works;
    `;
    const rwRes = await client.query(rwQuery);
    const rwRow = rwRes.rows[0] || {};
    recentWorksData = {
      total: parseInt(rwRow.total, 10) || 4,
      withCustomPhoto: parseInt(rwRow.with_custom_photo, 10) || 0,
    };
  } catch (rwErr) {
    console.error("[AdminOverview] Failed to fetch recent works stats:", rwErr.message);
    warnings.push("recent_works");
  }

  // 6. Recent Activity (Latest 8 across both tables)
  let recentActivityData = null;
  try {
    const activityQuery = `
      (
        SELECT
          'service_request' AS type,
          id,
          customer_name AS name,
          customer_email AS email,
          phone,
          service_name AS title,
          status,
          is_read,
          created_at
        FROM service_requests
      )
      UNION ALL
      (
        SELECT
          'contact_message' AS type,
          id,
          customer_name AS name,
          customer_email AS email,
          phone,
          COALESCE(subject, 'General Inquiry') AS title,
          status,
          is_read,
          created_at
        FROM contact_messages
      )
      ORDER BY created_at DESC
      LIMIT 8;
    `;
    const activityRes = await client.query(activityQuery);
    recentActivityData = activityRes.rows.map((r) => ({
      type: r.type,
      id: Number(r.id),
      name: r.name,
      email: r.email,
      phone: r.phone,
      title: r.title,
      status: r.status,
      isRead: Boolean(r.is_read),
      createdAt: r.created_at,
    }));
  } catch (actErr) {
    console.error("[AdminOverview] Failed to fetch recent activity:", actErr.message);
    warnings.push("recent_activity");
  }

  // 7. System status
  const emailConfigured = Boolean(
    process.env.SMTP_HOST &&
    process.env.SMTP_USER &&
    process.env.SMTP_PASS &&
    process.env.MAIL_FROM
  );
  const adminAlertsConfigured = Boolean(
    process.env.ADMIN_NOTIFY_EMAIL && process.env.ADMIN_NOTIFY_EMAIL.trim().length > 0
  );

  const systemData = {
    database: {
      connected: true,
      latencyMs: dbLatencyMs,
    },
    emailConfigured,
    adminAlertsConfigured,
  };

  client.release();

  return res.json({
    success: true,
    generatedAt: new Date().toISOString(),
    data: {
      serviceRequests: serviceRequestsData,
      contactMessages: contactMessagesData,
      enquiries: enquiriesData,
      services: servicesData,
      recentWorks: recentWorksData,
      recentActivity: recentActivityData,
      system: systemData,
    },
    warnings,
  });
}

module.exports = {
  getAdminOverview,
};
