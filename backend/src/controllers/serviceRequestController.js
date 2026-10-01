const pool = require("../db");
const {
  sendCustomerConfirmationEmail,
  sendAdminNotificationEmail,
  formatReference,
} = require("../utils/serviceRequestMailer");

// Normalize Indian mobile number to 10 digits
function normalizeIndianPhone(input) {
  if (!input || typeof input !== "string") return null;
  // Remove spaces, hyphens, parentheses
  let cleaned = input.replace(/[\s\-\(\)\.]/g, "");

  // Remove leading +91, 91, or 0 if followed by 10 digits
  if (cleaned.startsWith("+91") && cleaned.length === 13) {
    cleaned = cleaned.slice(3);
  } else if (cleaned.startsWith("91") && cleaned.length === 12) {
    cleaned = cleaned.slice(2);
  } else if (cleaned.startsWith("0") && cleaned.length === 11) {
    cleaned = cleaned.slice(1);
  }

  // Validate ^[6-9]\d{9}$
  if (/^[6-9]\d{9}$/.test(cleaned)) {
    return cleaned;
  }
  return null;
}

// Sensible email validation (no CRLF, valid domain, no consecutive dots)
function isValidEmail(email) {
  if (!email || typeof email !== "string") return false;
  if (/[\r\n]/.test(email)) return false;
  if (email.length > 255) return false;
  // Standard strict regex
  const regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  return regex.test(email) && !email.includes("..");
}

// Format DB row to camelCase
function formatServiceRequestRow(row) {
  return {
    id: Number(row.id),
    reference: formatReference(row.id),
    serviceId: row.service_id ? Number(row.service_id) : null,
    serviceName: row.service_name,
    customerName: row.customer_name,
    customerEmail: row.customer_email || null,
    phone: row.phone,
    message: row.message || null,
    status: row.status,
    isRead: Boolean(row.is_read),
    adminNotes: row.admin_notes || null,
    confirmationSentAt: row.confirmation_sent_at || null,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

// 1. POST /api/service-requests (Public creation)
async function createServiceRequest(req, res) {
  try {
    const { serviceId, serviceName, name, email, phone, message, website } = req.body || {};

    // Honeypot check: If non-empty, silently respond 201 without saving
    if (website && String(website).trim().length > 0) {
      return res.status(201).json({
        success: true,
        message: "Thank you for choosing this service. A confirmation email will be sent to your email address, and our team will contact you shortly.",
        data: { id: 0, serviceName: String(serviceName || "Core Service").slice(0, 160) },
      });
    }

    const errors = {};

    // Validate name
    if (!name || typeof name !== "string" || !name.trim()) {
      errors.name = "Full name is required.";
    } else if (/[\r\n]/.test(name)) {
      errors.name = "Name must not contain line breaks.";
    } else {
      const cleanName = name.replace(/\s+/g, " ").trim();
      if (cleanName.length < 2 || cleanName.length > 100) {
        errors.name = "Full name must be between 2 and 100 characters.";
      }
    }

    // Validate email
    if (!email || typeof email !== "string" || !email.trim()) {
      errors.email = "Email address is required.";
    } else {
      const cleanEmail = email.trim().toLowerCase();
      if (!isValidEmail(cleanEmail)) {
        errors.email = "Please enter a valid email address (e.g. name@domain.com).";
      }
    }

    // Validate phone
    const normalizedPhone = normalizeIndianPhone(phone);
    if (!phone || typeof phone !== "string" || !phone.trim()) {
      errors.phone = "Mobile number is required.";
    } else if (!normalizedPhone) {
      errors.phone = "Please enter a valid 10-digit Indian mobile number starting with 6-9.";
    }

    // Validate serviceName
    if (!serviceName || typeof serviceName !== "string" || !serviceName.trim()) {
      errors.serviceName = "Service requirement is required.";
    }

    // Validate message length
    let cleanMessage = null;
    if (message && typeof message === "string") {
      cleanMessage = message.trim();
      if (cleanMessage.length > 1000) {
        errors.message = "Message must not exceed 1000 characters.";
      }
    }

    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        success: false,
        message: "Validation failed. Please check the entered fields.",
        errors,
      });
    }

    const cleanName = name.replace(/\s+/g, " ").trim();
    const cleanEmail = email.trim().toLowerCase();
    let validatedServiceName = serviceName.trim().slice(0, 160);
    let validServiceId = null;

    // Verify serviceId if provided
    if (serviceId) {
      const sIdNum = parseInt(serviceId, 10);
      if (!isNaN(sIdNum) && sIdNum > 0) {
        const sRes = await pool.query("SELECT id, title FROM services WHERE id = $1", [sIdNum]);
        if (sRes.rows.length > 0) {
          validServiceId = sRes.rows[0].id;
          validatedServiceName = sRes.rows[0].title;
        }
      }
    }

    // Insert into PostgreSQL
    const insertQuery = `
      INSERT INTO service_requests (
        service_id, service_name, customer_name, customer_email, phone, message,
        status, is_read, created_at, updated_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, 'new', FALSE, NOW(), NOW())
      RETURNING id, service_id, service_name, customer_name, customer_email, phone, message,
                status, is_read, confirmation_sent_at, created_at, updated_at
    `;

    const { rows } = await pool.query(insertQuery, [
      validServiceId,
      validatedServiceName,
      cleanName,
      cleanEmail,
      normalizedPhone,
      cleanMessage || null,
    ]);

    const savedRecord = rows[0];
    const requestId = Number(savedRecord.id);

    // Send HTTP Response immediately
    res.status(201).json({
      success: true,
      message: `Thank you for choosing ${validatedServiceName}. A confirmation email will be sent to your email address, and our team will contact you shortly.`,
      data: {
        id: requestId,
        serviceName: validatedServiceName,
      },
    });

    // Background mail handling (does not block HTTP response)
    setImmediate(async () => {
      try {
        // Anti-abuse check: Check if same email received 3+ confirmations in last 24h
        const rateQuery = `
          SELECT COUNT(*) AS sent_count
          FROM service_requests
          WHERE LOWER(customer_email) = $1
            AND confirmation_sent_at IS NOT NULL
            AND confirmation_sent_at > NOW() - INTERVAL '24 hours'
        `;
        const rateRes = await pool.query(rateQuery, [cleanEmail]);
        const sentCount = parseInt(rateRes.rows[0]?.sent_count || "0", 10);

        const emailPayload = {
          id: requestId,
          serviceName: validatedServiceName,
          name: cleanName,
          email: cleanEmail,
          phone: normalizedPhone,
          message: cleanMessage,
        };

        if (sentCount < 3) {
          await sendCustomerConfirmationEmail(emailPayload);
          // Set confirmation_sent_at
          await pool.query(
            "UPDATE service_requests SET confirmation_sent_at = NOW() WHERE id = $1",
            [requestId]
          );
        }

        // Send Admin notification
        await sendAdminNotificationEmail(emailPayload);
      } catch (mailErr) {
        console.error(`[ServiceRequestMailer] Mail dispatch failed for request ID ${requestId}:`, mailErr.message);
      }
    });
  } catch (err) {
    console.error("Error creating service request:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to submit service request. Please try again later.",
    });
  }
}

// 2. GET /api/admin/service-requests (Admin list with server-side pagination and filters)
async function getAdminServiceRequests(req, res) {
  try {
    const page = Math.max(1, parseInt(req.query.page || "1", 10));
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit || "20", 10)));
    const offset = (page - 1) * limit;

    const { status, service, q, unread } = req.query;

    const conditions = [];
    const params = [];
    let paramIndex = 1;

    if (status && ["new", "contacted", "in_progress", "closed"].includes(status)) {
      conditions.push(`status = $${paramIndex++}`);
      params.push(status);
    }

    if (service && service.trim()) {
      conditions.push(`service_name = $${paramIndex++}`);
      params.push(service.trim());
    }

    if (unread === "true") {
      conditions.push(`is_read = FALSE`);
    }

    if (q && q.trim()) {
      const searchTerm = `%${q.trim().replace(/([%_\\])/g, "\\$1")}%`;
      conditions.push(
        `(customer_name ILIKE $${paramIndex} OR customer_email ILIKE $${paramIndex} OR phone ILIKE $${paramIndex} OR service_name ILIKE $${paramIndex} OR message ILIKE $${paramIndex})`
      );
      params.push(searchTerm);
      paramIndex++;
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    // Total count for filtered query
    const countQuery = `SELECT COUNT(*) as total FROM service_requests ${whereClause}`;
    const countRes = await pool.query(countQuery, params);
    const total = parseInt(countRes.rows[0]?.total || "0", 10);
    const totalPages = Math.ceil(total / limit) || 1;

    // Data query
    const dataQuery = `
      SELECT 
        id, service_id, service_name, customer_name, customer_email, phone, message,
        status, is_read, admin_notes, confirmation_sent_at, created_at, updated_at
      FROM service_requests
      ${whereClause}
      ORDER BY created_at DESC, id DESC
      LIMIT $${paramIndex++} OFFSET $${paramIndex++}
    `;
    const dataRes = await pool.query(dataQuery, [...params, limit, offset]);

    // Independent global counts
    const globalCountsQuery = `
      SELECT 
        COUNT(*) as total,
        COUNT(*) FILTER (WHERE status = 'new') as new,
        COUNT(*) FILTER (WHERE status = 'contacted') as contacted,
        COUNT(*) FILTER (WHERE status = 'in_progress') as in_progress,
        COUNT(*) FILTER (WHERE status = 'closed') as closed,
        COUNT(*) FILTER (WHERE is_read = FALSE) as unread
      FROM service_requests
    `;
    const countsRes = await pool.query(globalCountsQuery);
    const countsRow = countsRes.rows[0] || {};

    const counts = {
      total: parseInt(countsRow.total || "0", 10),
      new: parseInt(countsRow.new || "0", 10),
      contacted: parseInt(countsRow.contacted || "0", 10),
      in_progress: parseInt(countsRow.in_progress || "0", 10),
      closed: parseInt(countsRow.closed || "0", 10),
      unread: parseInt(countsRow.unread || "0", 10),
    };

    const formattedList = dataRes.rows.map(formatServiceRequestRow);

    return res.json({
      success: true,
      data: formattedList,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
      counts,
    });
  } catch (err) {
    console.error("Error fetching admin service requests:", err);
    return res.status(500).json({ success: false, message: "Failed to load service requests." });
  }
}

// 3. GET /api/admin/service-requests/notifications (Light query for notification bell)
async function getNotifications(req, res) {
  try {
    const unreadCountRes = await pool.query(
      "SELECT COUNT(*) as unread_count FROM service_requests WHERE is_read = FALSE"
    );
    const unreadCount = parseInt(unreadCountRes.rows[0]?.unread_count || "0", 10);

    const latestRes = await pool.query(`
      SELECT id, customer_name, service_name, created_at
      FROM service_requests
      WHERE is_read = FALSE
      ORDER BY created_at DESC, id DESC
      LIMIT 6
    `);

    const latest = latestRes.rows.map((r) => ({
      id: Number(r.id),
      customerName: r.customer_name,
      serviceName: r.service_name,
      createdAt: r.created_at,
    }));

    return res.json({
      success: true,
      unreadCount,
      latest,
    });
  } catch (err) {
    console.error("Error fetching notifications:", err);
    return res.status(500).json({ success: false, message: "Failed to fetch notifications." });
  }
}

// 4. PATCH /api/admin/service-requests/read-all (Mark all unread requests as read)
async function markAllAsRead(req, res) {
  try {
    await pool.query("UPDATE service_requests SET is_read = TRUE, updated_at = NOW() WHERE is_read = FALSE");
    return res.json({
      success: true,
      message: "All service requests marked as read.",
      unreadCount: 0,
    });
  } catch (err) {
    console.error("Error marking all as read:", err);
    return res.status(500).json({ success: false, message: "Failed to mark all as read." });
  }
}

// 5. GET /api/admin/service-requests/export.csv (CSV export with formula injection prevention)
async function exportCsv(req, res) {
  try {
    const { status, service, q, unread } = req.query;

    const conditions = [];
    const params = [];
    let paramIndex = 1;

    if (status && ["new", "contacted", "in_progress", "closed"].includes(status)) {
      conditions.push(`status = $${paramIndex++}`);
      params.push(status);
    }

    if (service && service.trim()) {
      conditions.push(`service_name = $${paramIndex++}`);
      params.push(service.trim());
    }

    if (unread === "true") {
      conditions.push(`is_read = FALSE`);
    }

    if (q && q.trim()) {
      const searchTerm = `%${q.trim().replace(/([%_\\])/g, "\\$1")}%`;
      conditions.push(
        `(customer_name ILIKE $${paramIndex} OR customer_email ILIKE $${paramIndex} OR phone ILIKE $${paramIndex} OR service_name ILIKE $${paramIndex} OR message ILIKE $${paramIndex})`
      );
      params.push(searchTerm);
      paramIndex++;
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    const query = `
      SELECT 
        id, service_name, customer_name, customer_email, phone, message,
        status, admin_notes, confirmation_sent_at, created_at
      FROM service_requests
      ${whereClause}
      ORDER BY created_at DESC, id DESC
    `;

    const { rows } = await pool.query(query, params);

    // Escape CSV cell and guard against spreadsheet formula injection
    const escapeCsv = (val) => {
      if (val === null || val === undefined) return '""';
      let str = String(val);
      // Formula injection guard: if starts with =, +, -, @, prepend single quote
      if (/^[=\+\-@]/.test(str)) {
        str = "'" + str;
      }
      return `"${str.replace(/"/g, '""')}"`;
    };

    const headers = [
      "ID",
      "Reference",
      "Received",
      "Name",
      "Email",
      "Mobile",
      "Service",
      "Message",
      "Status",
      "Notes",
      "Confirmation sent",
    ];

    const csvRows = [headers.join(",")];

    for (const r of rows) {
      const confirmationSent = r.confirmation_sent_at ? "Yes" : "No";
      const rowData = [
        escapeCsv(r.id),
        escapeCsv(formatReference(r.id)),
        escapeCsv(new Date(r.created_at).toISOString()),
        escapeCsv(r.customer_name),
        escapeCsv(r.customer_email || "Not provided"),
        escapeCsv(r.phone),
        escapeCsv(r.service_name),
        escapeCsv(r.message || ""),
        escapeCsv(r.status),
        escapeCsv(r.admin_notes || ""),
        escapeCsv(confirmationSent),
      ];
      csvRows.push(rowData.join(","));
    }

    const csvContent = csvRows.join("\r\n");
    const dateStr = new Date().toISOString().slice(0, 10);

    res.setHeader("Content-Type", "text/csv; charset=utf-8");
    res.setHeader("Content-Disposition", `attachment; filename="service-requests-${dateStr}.csv"`);
    return res.send(csvContent);
  } catch (err) {
    console.error("Error exporting CSV:", err);
    return res.status(500).json({ success: false, message: "Failed to export CSV." });
  }
}

// 6. GET /api/admin/service-requests/:id (Single request detail)
async function getAdminServiceRequestById(req, res) {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id) || id <= 0) {
      return res.status(400).json({ success: false, message: "Invalid request ID." });
    }

    const { rows } = await pool.query(
      `SELECT id, service_id, service_name, customer_name, customer_email, phone, message,
              status, is_read, admin_notes, confirmation_sent_at, created_at, updated_at
       FROM service_requests
       WHERE id = $1`,
      [id]
    );

    if (!rows.length) {
      return res.status(404).json({ success: false, message: "Service request not found." });
    }

    return res.json({
      success: true,
      data: formatServiceRequestRow(rows[0]),
    });
  } catch (err) {
    console.error("Error fetching service request:", err);
    return res.status(500).json({ success: false, message: "Failed to fetch service request." });
  }
}

// 7. PATCH /api/admin/service-requests/:id (Update status, notes, or isRead)
async function updateAdminServiceRequest(req, res) {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id) || id <= 0) {
      return res.status(400).json({ success: false, message: "Invalid request ID." });
    }

    const { status, adminNotes, isRead } = req.body || {};

    const updates = [];
    const params = [];
    let paramIndex = 1;

    if (status !== undefined) {
      if (!["new", "contacted", "in_progress", "closed"].includes(status)) {
        return res.status(400).json({
          success: false,
          message: "Invalid status value. Must be 'new', 'contacted', 'in_progress', or 'closed'.",
        });
      }
      updates.push(`status = $${paramIndex++}`);
      params.push(status);
    }

    if (adminNotes !== undefined) {
      const trimmedNotes = typeof adminNotes === "string" ? adminNotes.trim().slice(0, 2000) : null;
      updates.push(`admin_notes = $${paramIndex++}`);
      params.push(trimmedNotes);
    }

    if (isRead !== undefined) {
      updates.push(`is_read = $${paramIndex++}`);
      params.push(Boolean(isRead));
    }

    if (updates.length === 0) {
      return res.status(400).json({ success: false, message: "No valid fields provided for update." });
    }

    updates.push("updated_at = NOW()");
    params.push(id);

    const updateQuery = `
      UPDATE service_requests
      SET ${updates.join(", ")}
      WHERE id = $${paramIndex}
      RETURNING id, service_id, service_name, customer_name, customer_email, phone, message,
                status, is_read, admin_notes, confirmation_sent_at, created_at, updated_at
    `;

    const { rows } = await pool.query(updateQuery, params);

    if (!rows.length) {
      return res.status(404).json({ success: false, message: "Service request not found." });
    }

    return res.json({
      success: true,
      message: "Service request updated successfully.",
      data: formatServiceRequestRow(rows[0]),
    });
  } catch (err) {
    console.error("Error updating service request:", err);
    return res.status(500).json({ success: false, message: "Failed to update service request." });
  }
}

// 8. DELETE /api/admin/service-requests/:id
async function deleteAdminServiceRequest(req, res) {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id) || id <= 0) {
      return res.status(400).json({ success: false, message: "Invalid request ID." });
    }

    const { rowCount } = await pool.query("DELETE FROM service_requests WHERE id = $1", [id]);

    if (!rowCount) {
      return res.status(404).json({ success: false, message: "Service request not found." });
    }

    return res.json({
      success: true,
      message: "Service request deleted successfully.",
    });
  } catch (err) {
    console.error("Error deleting service request:", err);
    return res.status(500).json({ success: false, message: "Failed to delete service request." });
  }
}

module.exports = {
  createServiceRequest,
  getAdminServiceRequests,
  getNotifications,
  markAllAsRead,
  exportCsv,
  getAdminServiceRequestById,
  updateAdminServiceRequest,
  deleteAdminServiceRequest,
  normalizeIndianPhone,
  isValidEmail,
};
