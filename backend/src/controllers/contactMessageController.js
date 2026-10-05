const pool = require("../db");
const {
  sendCustomerThankYouEmail,
  sendAdminNotificationEmail,
  formatReference,
} = require("../utils/contactMailer");

// Normalize Indian mobile number
function normalizeIndianPhone(input) {
  if (!input || typeof input !== "string") return null;
  let cleaned = input.replace(/[\s\-\(\)\.]/g, "");

  if (cleaned.startsWith("+91") && cleaned.length === 13) {
    cleaned = cleaned.slice(3);
  } else if (cleaned.startsWith("91") && cleaned.length === 12) {
    cleaned = cleaned.slice(2);
  } else if (cleaned.startsWith("0") && cleaned.length === 11) {
    cleaned = cleaned.slice(1);
  }

  if (/^[6-9]\d{9}$/.test(cleaned)) {
    return cleaned;
  }
  return null;
}

// Strict email validation
function isValidEmail(email) {
  if (!email || typeof email !== "string") return false;
  if (/[\r\n]/.test(email)) return false;
  if (email.length > 255) return false;
  const regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  return regex.test(email) && !email.includes("..");
}

// Format DB row to camelCase
function formatContactMessageRow(row) {
  return {
    id: Number(row.id),
    reference: formatReference(row.id),
    customerName: row.customer_name,
    customerEmail: row.customer_email || null,
    phone: row.phone || null,
    subject: row.subject || null,
    message: row.message,
    status: row.status,
    isRead: Boolean(row.is_read),
    adminNotes: row.admin_notes || null,
    confirmationSentAt: row.confirmation_sent_at || null,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

// 1. POST /api/contact-messages (Public creation)
async function createContactMessage(req, res) {
  const { name, email, phone, subject, message, website } = req.body || {};

  // Honeypot check: If filled, respond 201 silently without saving
  if (website && String(website).trim().length > 0) {
    return res.status(201).json({
      success: true,
      message: "Thank you for contacting us. We have received your message and will get back to you within 24 hours.",
      data: { id: 0 },
    });
  }

  const errors = {};

  // Validate Name (2-100 chars, strip control chars)
  const cleanName = (typeof name === "string" ? name : "").replace(/[\x00-\x1F\x7F]/g, "").trim();
  if (!cleanName || cleanName.length < 2 || cleanName.length > 100) {
    errors.name = "Please enter your name (2-100 characters).";
  }

  // Validate Email (required, trimmed, lowercased, max 255, valid format, no CR/LF)
  const cleanEmail = (typeof email === "string" ? email : "").trim().toLowerCase();
  if (!cleanEmail) {
    errors.email = "Please enter your email address.";
  } else if (!isValidEmail(cleanEmail)) {
    errors.email = "Please enter a valid email address.";
  }

  // Validate Phone (optional, if given must be valid Indian mobile)
  let cleanPhone = null;
  if (phone !== undefined && phone !== null && String(phone).trim().length > 0) {
    cleanPhone = normalizeIndianPhone(String(phone));
    if (!cleanPhone) {
      errors.phone = "Please enter a valid 10-digit Indian mobile number starting with 6-9.";
    }
  }

  // Validate Subject (optional max 160)
  const cleanSubject = (typeof subject === "string" ? subject : "")
    .replace(/[\x00-\x1F\x7F]/g, "")
    .trim()
    .slice(0, 160);

  // Validate Message (5-2000 chars, strip control chars except newlines and tabs)
  const cleanMessage = (typeof message === "string" ? message : "")
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "")
    .trim();
  if (!cleanMessage || cleanMessage.length < 5 || cleanMessage.length > 2000) {
    errors.message = "Please enter a message between 5 and 2000 characters.";
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({
      success: false,
      message: "Please correct the highlighted fields.",
      errors,
    });
  }

  let client;
  let insertedRow;

  try {
    client = await pool.connect();
    const query = `
      INSERT INTO contact_messages (
        customer_name,
        customer_email,
        phone,
        subject,
        message,
        status,
        is_read
      )
      VALUES ($1, $2, $3, $4, $5, 'new', false)
      RETURNING *;
    `;
    const values = [
      cleanName,
      cleanEmail,
      cleanPhone || null,
      cleanSubject || null,
      cleanMessage,
    ];

    const result = await client.query(query, values);
    insertedRow = result.rows[0];
  } catch (dbErr) {
    console.error("Database insert error on contact message:", dbErr.message);
    return res.status(500).json({
      success: false,
      message: "An error occurred while submitting your message. Please try again.",
    });
  } finally {
    if (client) client.release();
  }

  // Respond immediately with 201
  res.status(201).json({
    success: true,
    message: "Thank you for contacting us. We have received your message and will get back to you within 24 hours.",
    data: {
      id: Number(insertedRow.id),
      reference: formatReference(insertedRow.id),
    },
  });

  // Background email handling (never delays response or fails request)
  setImmediate(async () => {
    let emailClient;
    try {
      emailClient = await pool.connect();

      // Check rate: max 3 customer confirmations to the same email in the last 24 hours
      const countRes = await emailClient.query(
        `SELECT COUNT(*) FROM contact_messages 
         WHERE LOWER(customer_email) = $1 
           AND confirmation_sent_at IS NOT NULL 
           AND confirmation_sent_at >= NOW() - INTERVAL '24 hours'`,
        [cleanEmail]
      );
      const confirmationsSent = parseInt(countRes.rows[0].count, 10) || 0;

      let shouldSendCustomerEmail = confirmationsSent < 3;

      const emailPayload = {
        id: insertedRow.id,
        name: cleanName,
        email: cleanEmail,
        phone: cleanPhone,
        subject: cleanSubject,
        message: cleanMessage,
      };

      if (shouldSendCustomerEmail) {
        try {
          await sendCustomerThankYouEmail(emailPayload);
          // Update confirmation_sent_at
          await emailClient.query(
            `UPDATE contact_messages SET confirmation_sent_at = NOW() WHERE id = $1`,
            [insertedRow.id]
          );
        } catch (sendErr) {
          console.error(`Failed to send customer confirmation email (ID: ${insertedRow.id}):`, sendErr.message);
        }
      }

      // Send admin notification
      try {
        await sendAdminNotificationEmail(emailPayload);
      } catch (adminSendErr) {
        console.error(`Failed to send admin notification email (ID: ${insertedRow.id}):`, adminSendErr.message);
      }
    } catch (bgErr) {
      console.error(`Background email task error (ID: ${insertedRow?.id}):`, bgErr.message);
    } finally {
      if (emailClient) emailClient.release();
    }
  });
}

// 2. GET /api/admin/contact-messages (Admin List with Pagination, Search & Counts)
async function getAdminContactMessages(req, res) {
  let client;
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 20));
    const offset = (page - 1) * limit;

    const { status, q, unread } = req.query;

    client = await pool.connect();

    // Query 1: Aggregated Counts
    const countsQuery = `
      SELECT 
        COUNT(*) as total,
        COUNT(*) FILTER (WHERE status = 'new') as new,
        COUNT(*) FILTER (WHERE status = 'contacted') as contacted,
        COUNT(*) FILTER (WHERE status = 'in_progress') as in_progress,
        COUNT(*) FILTER (WHERE status = 'closed') as closed,
        COUNT(*) FILTER (WHERE is_read = false) as unread
      FROM contact_messages;
    `;
    const countsResult = await client.query(countsQuery);
    const countsRow = countsResult.rows[0] || {};
    const counts = {
      total: parseInt(countsRow.total, 10) || 0,
      new: parseInt(countsRow.new, 10) || 0,
      contacted: parseInt(countsRow.contacted, 10) || 0,
      in_progress: parseInt(countsRow.in_progress, 10) || 0,
      closed: parseInt(countsRow.closed, 10) || 0,
      unread: parseInt(countsRow.unread, 10) || 0,
    };

    // Query 2: Filtered Data List
    const conditions = [];
    const params = [];
    let paramIndex = 1;

    if (status && ["new", "contacted", "in_progress", "closed"].includes(status.toLowerCase())) {
      conditions.push(`status = $${paramIndex}`);
      params.push(status.toLowerCase());
      paramIndex++;
    }

    if (unread === "true" || unread === "1") {
      conditions.push(`is_read = false`);
    }

    if (q && q.trim().length > 0) {
      const searchTerm = `%${q.trim().replace(/([%_\\])/g, "\\$1")}%`;
      conditions.push(
        `(customer_name ILIKE $${paramIndex} OR customer_email ILIKE $${paramIndex} OR COALESCE(phone, '') ILIKE $${paramIndex} OR COALESCE(subject, '') ILIKE $${paramIndex} OR message ILIKE $${paramIndex})`
      );
      params.push(searchTerm);
      paramIndex++;
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    const countFilteredQuery = `SELECT COUNT(*) FROM contact_messages ${whereClause};`;
    const totalFilteredResult = await client.query(countFilteredQuery, params);
    const total = parseInt(totalFilteredResult.rows[0].count, 10) || 0;
    const totalPages = Math.ceil(total / limit) || 1;

    const dataQuery = `
      SELECT * FROM contact_messages
      ${whereClause}
      ORDER BY created_at DESC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1};
    `;
    params.push(limit, offset);

    const dataResult = await client.query(dataQuery, params);
    const formattedData = dataResult.rows.map(formatContactMessageRow);

    return res.json({
      success: true,
      data: formattedData,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
      counts,
    });
  } catch (err) {
    console.error("Admin list contact messages error:", err.message);
    return res.status(500).json({
      success: false,
      message: "Failed to load contact messages.",
    });
  } finally {
    if (client) client.release();
  }
}

// 3. PATCH /api/admin/contact-messages/read-all (Mark all unread as read)
async function markAllAsRead(req, res) {
  let client;
  try {
    client = await pool.connect();
    await client.query(`UPDATE contact_messages SET is_read = true WHERE is_read = false;`);
    return res.json({
      success: true,
      message: "All contact messages marked as read.",
    });
  } catch (err) {
    console.error("Mark all contact messages read error:", err.message);
    return res.status(500).json({
      success: false,
      message: "Failed to mark all contact messages as read.",
    });
  } finally {
    if (client) client.release();
  }
}

// 4. GET /api/admin/contact-messages/:id (Get single and mark read)
async function getAdminContactMessageById(req, res) {
  const id = parseInt(req.params.id, 10);
  if (!id || isNaN(id)) {
    return res.status(400).json({ success: false, message: "Invalid contact message ID." });
  }

  let client;
  try {
    client = await pool.connect();
    const result = await client.query(
      `UPDATE contact_messages SET is_read = true WHERE id = $1 RETURNING *;`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Contact message not found." });
    }

    return res.json({
      success: true,
      data: formatContactMessageRow(result.rows[0]),
    });
  } catch (err) {
    console.error("Get contact message by ID error:", err.message);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve contact message.",
    });
  } finally {
    if (client) client.release();
  }
}

// 5. PATCH /api/admin/contact-messages/:id (Update status / notes / isRead)
async function updateAdminContactMessage(req, res) {
  const id = parseInt(req.params.id, 10);
  if (!id || isNaN(id)) {
    return res.status(400).json({ success: false, message: "Invalid contact message ID." });
  }

  const { status, adminNotes, isRead } = req.body || {};
  const updates = [];
  const values = [];
  let paramIndex = 1;

  if (status !== undefined) {
    const validStatuses = ["new", "contacted", "in_progress", "closed"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status value." });
    }
    updates.push(`status = $${paramIndex}`);
    values.push(status);
    paramIndex++;
  }

  if (adminNotes !== undefined) {
    const cleanNotes = typeof adminNotes === "string" ? adminNotes.trim().slice(0, 2000) : null;
    updates.push(`admin_notes = $${paramIndex}`);
    values.push(cleanNotes);
    paramIndex++;
  }

  if (isRead !== undefined) {
    updates.push(`is_read = $${paramIndex}`);
    values.push(Boolean(isRead));
    paramIndex++;
  }

  if (updates.length === 0) {
    return res.status(400).json({ success: false, message: "No fields provided to update." });
  }

  updates.push(`updated_at = NOW()`);

  let client;
  try {
    client = await pool.connect();
    values.push(id);
    const query = `
      UPDATE contact_messages
      SET ${updates.join(", ")}
      WHERE id = $${paramIndex}
      RETURNING *;
    `;
    const result = await client.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Contact message not found." });
    }

    return res.json({
      success: true,
      message: "Contact message updated successfully.",
      data: formatContactMessageRow(result.rows[0]),
    });
  } catch (err) {
    console.error("Update contact message error:", err.message);
    return res.status(500).json({
      success: false,
      message: "Failed to update contact message.",
    });
  } finally {
    if (client) client.release();
  }
}

// 6. DELETE /api/admin/contact-messages/:id
async function deleteAdminContactMessage(req, res) {
  const id = parseInt(req.params.id, 10);
  if (!id || isNaN(id)) {
    return res.status(400).json({ success: false, message: "Invalid contact message ID." });
  }

  let client;
  try {
    client = await pool.connect();
    const result = await client.query(`DELETE FROM contact_messages WHERE id = $1 RETURNING id;`, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Contact message not found." });
    }

    return res.json({
      success: true,
      message: "Contact message deleted successfully.",
      data: { id },
    });
  } catch (err) {
    console.error("Delete contact message error:", err.message);
    return res.status(500).json({
      success: false,
      message: "Failed to delete contact message.",
    });
  } finally {
    if (client) client.release();
  }
}

module.exports = {
  createContactMessage,
  getAdminContactMessages,
  markAllAsRead,
  getAdminContactMessageById,
  updateAdminContactMessage,
  deleteAdminContactMessage,
};
