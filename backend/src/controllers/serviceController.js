const pool = require("../db");
const {
  ALLOWED_SERVICE_ICONS,
  DEFAULT_SERVICES,
  DEFAULT_BUTTON_LINK,
} = require("../constants/defaultServices");

function parseFeatures(raw) {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw;
  if (typeof raw === "string") {
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    } catch {
      return raw.split("\n").map((s) => s.trim()).filter(Boolean);
    }
  }
  return [];
}

// Format service row for client response
function formatServiceRow(row) {
  const hasImage = !!row.has_image || !!row.has_image_data;
  const version = row.image_updated_at ? new Date(row.image_updated_at).getTime() : 1;
  const imageUrl = hasImage ? `/api/services/${row.id}/image?v=${version}` : null;

  return {
    id: Number(row.id),
    title: row.title,
    description: row.description,
    features: Array.isArray(row.features)
      ? row.features
      : typeof row.features === "string"
      ? JSON.parse(row.features || "[]")
      : [],
    button_label: row.button_label || "Discuss Your Project",
    button_link: row.button_link || DEFAULT_BUTTON_LINK,
    icon_key: row.icon_key || null,
    sort_order: Number(row.sort_order || 0),
    is_active: row.is_active !== undefined ? Boolean(row.is_active) : true,
    has_image: hasImage,
    image_url: imageUrl,
    image_updated_at: row.image_updated_at || null,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

// 1. GET /api/services (Public list of active services)
async function getPublicServices(req, res) {
  try {
    res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");

    const query = `
      SELECT 
        id, title, description, features, button_label, button_link, icon_key, 
        sort_order, is_active, 
        (image_data IS NOT NULL) AS has_image_data,
        image_updated_at, created_at, updated_at
      FROM services
      WHERE is_active = TRUE
      ORDER BY sort_order ASC, id ASC
    `;
    const { rows } = await pool.query(query);

    const services = rows.map((r) => formatServiceRow(r));
    return res.json({ success: true, count: services.length, data: services });
  } catch (err) {
    console.error("Error fetching public services:", err);
    return res.status(500).json({ success: false, message: "Failed to fetch services." });
  }
}

// 2. GET /api/services/:id/image (Public streaming image with CORP and caching)
async function getServiceImage(req, res) {
  try {
    const { id } = req.params;
    const query = `
      SELECT image_data, image_mime, image_updated_at
      FROM services
      WHERE id = $1
    `;
    const { rows } = await pool.query(query, [id]);

    if (!rows.length || !rows[0].image_data) {
      return res.status(404).json({ success: false, message: "Image not found." });
    }

    const { image_data, image_mime, image_updated_at } = rows[0];
    const etag = `"${id}-${image_updated_at ? new Date(image_updated_at).getTime() : "1"}"`;

    if (req.headers["if-none-match"] === etag) {
      return res.status(304).end();
    }

    res.setHeader("Content-Type", image_mime || "image/jpeg");
    res.setHeader("Content-Length", image_data.length);
    res.setHeader("Cross-Origin-Resource-Policy", "cross-origin");
    res.setHeader("ETag", etag);
    res.setHeader("Cache-Control", "public, max-age=31536000, immutable");
    return res.send(image_data);
  } catch (err) {
    console.error("Error fetching service image:", err);
    return res.status(500).json({ success: false, message: "Failed to retrieve image." });
  }
}

// 3. GET /api/admin/services (Admin list of all services)
async function getAdminServices(req, res) {
  try {
    const query = `
      SELECT 
        id, title, description, features, button_label, button_link, icon_key, 
        sort_order, is_active, 
        (image_data IS NOT NULL) AS has_image_data,
        image_updated_at, created_at, updated_at
      FROM services
      ORDER BY sort_order ASC, id ASC
    `;
    const { rows } = await pool.query(query);

    const services = rows.map((r) => formatServiceRow(r));
    return res.json({
      success: true,
      count: services.length,
      data: services,
      meta: {
        total_count: services.length,
        active_count: services.filter((s) => s.is_active).length,
      },
    });
  } catch (err) {
    console.error("Error fetching admin services:", err);
    return res.status(500).json({ success: false, message: "Failed to fetch services." });
  }
}

// 4. POST /api/admin/services (Admin Create)
async function createService(req, res) {
  try {
    const { title, description, button_label, icon_key, is_active } = req.body;
    const rawFeatures = req.body.features;

    if (!title || !title.trim()) {
      return res.status(400).json({ success: false, message: "Service title is required." });
    }
    if (title.trim().length > 120) {
      return res.status(400).json({ success: false, message: "Title must not exceed 120 characters." });
    }
    if (!description || !description.trim()) {
      return res.status(400).json({ success: false, message: "Description is required." });
    }
    if (description.trim().length > 600) {
      return res.status(400).json({ success: false, message: "Description must not exceed 600 characters." });
    }

    // Optional icon_key validation: null if missing, empty, or "none"
    let validatedIcon = null;
    if (icon_key && icon_key !== "none" && icon_key !== "" && icon_key !== "null") {
      if (!ALLOWED_SERVICE_ICONS.includes(icon_key)) {
        return res.status(400).json({
          success: false,
          message: `Invalid icon_key "${icon_key}". Allowed icons: ${ALLOWED_SERVICE_ICONS.join(", ")}`,
        });
      }
      validatedIcon = icon_key;
    }

    const featuresList = parseFeatures(rawFeatures).slice(0, 8).map((f) => String(f).trim().slice(0, 80));
    const activeBool = is_active !== undefined ? is_active === "true" || is_active === true : true;

    // Next sort order
    const orderRes = await pool.query("SELECT COALESCE(MAX(sort_order), 0) + 1 AS next_order FROM services");
    const nextOrder = orderRes.rows[0].next_order;

    let imageData = null;
    let imageMime = null;
    let imageUpdatedAt = null;

    if (req.file) {
      imageData = req.file.buffer;
      imageMime = req.file.verifiedMime || req.file.mimetype;
      imageUpdatedAt = new Date();
    }

    const insertQuery = `
      INSERT INTO services (
        title, description, features, button_label, button_link, icon_key,
        sort_order, is_active, image_data, image_mime, image_updated_at,
        created_at, updated_at
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW(), NOW())
      RETURNING id, title, description, features, button_label, button_link, icon_key,
                sort_order, is_active, (image_data IS NOT NULL) AS has_image_data,
                image_updated_at, created_at, updated_at
    `;

    const { rows } = await pool.query(insertQuery, [
      title.trim(),
      description.trim(),
      JSON.stringify(featuresList),
      (button_label || "Discuss Your Project").trim().slice(0, 40),
      DEFAULT_BUTTON_LINK,
      validatedIcon,
      nextOrder,
      activeBool,
      imageData,
      imageMime,
      imageUpdatedAt,
    ]);

    return res.status(201).json({
      success: true,
      message: "Service created successfully.",
      data: formatServiceRow(rows[0]),
    });
  } catch (err) {
    console.error("Error creating service:", err);
    return res.status(500).json({ success: false, message: "Failed to create service: " + err.message });
  }
}

// 5. PUT /api/admin/services/:id (Admin Update)
async function updateService(req, res) {
  try {
    const { id } = req.params;
    const { title, description, button_label, icon_key, is_active, removeImage, remove_image } = req.body;
    const rawFeatures = req.body.features;

    // Check service exists
    const checkRes = await pool.query("SELECT id, button_link FROM services WHERE id = $1", [id]);
    if (!checkRes.rows.length) {
      return res.status(404).json({ success: false, message: "Service not found." });
    }

    if (!title || !title.trim()) {
      return res.status(400).json({ success: false, message: "Service title is required." });
    }
    if (title.trim().length > 120) {
      return res.status(400).json({ success: false, message: "Title must not exceed 120 characters." });
    }
    if (!description || !description.trim()) {
      return res.status(400).json({ success: false, message: "Description is required." });
    }
    if (description.trim().length > 600) {
      return res.status(400).json({ success: false, message: "Description must not exceed 600 characters." });
    }

    // Handle icon_key update
    let validatedIcon = null;
    if (icon_key !== undefined) {
      if (icon_key && icon_key !== "none" && icon_key !== "" && icon_key !== "null") {
        if (!ALLOWED_SERVICE_ICONS.includes(icon_key)) {
          return res.status(400).json({
            success: false,
            message: `Invalid icon_key "${icon_key}". Allowed icons: ${ALLOWED_SERVICE_ICONS.join(", ")}`,
          });
        }
        validatedIcon = icon_key;
      } else {
        validatedIcon = null; // explicit clear / no icon
      }
    }

    const featuresList = parseFeatures(rawFeatures).slice(0, 8).map((f) => String(f).trim().slice(0, 80));
    const activeBool = is_active !== undefined ? is_active === "true" || is_active === true : true;
    const shouldRemoveImage =
      removeImage === "true" || removeImage === true || remove_image === "true" || remove_image === true;

    let updateQuery;
    let queryParams;

    if (req.file) {
      // New image uploaded
      updateQuery = `
        UPDATE services SET
          title = $1,
          description = $2,
          features = $3,
          button_label = $4,
          icon_key = $5,
          is_active = $6,
          image_data = $7,
          image_mime = $8,
          image_updated_at = NOW(),
          updated_at = NOW()
        WHERE id = $9
        RETURNING id, title, description, features, button_label, button_link, icon_key,
                  sort_order, is_active, (image_data IS NOT NULL) AS has_image_data,
                  image_updated_at, created_at, updated_at
      `;
      queryParams = [
        title.trim(),
        description.trim(),
        JSON.stringify(featuresList),
        (button_label || "Discuss Your Project").trim().slice(0, 40),
        validatedIcon,
        activeBool,
        req.file.buffer,
        req.file.verifiedMime || req.file.mimetype,
        id,
      ];
    } else if (shouldRemoveImage) {
      // Image explicitly removed
      updateQuery = `
        UPDATE services SET
          title = $1,
          description = $2,
          features = $3,
          button_label = $4,
          icon_key = $5,
          is_active = $6,
          image_data = NULL,
          image_mime = NULL,
          image_updated_at = NOW(),
          updated_at = NOW()
        WHERE id = $7
        RETURNING id, title, description, features, button_label, button_link, icon_key,
                  sort_order, is_active, (image_data IS NOT NULL) AS has_image_data,
                  image_updated_at, created_at, updated_at
      `;
      queryParams = [
        title.trim(),
        description.trim(),
        JSON.stringify(featuresList),
        (button_label || "Discuss Your Project").trim().slice(0, 40),
        validatedIcon,
        activeBool,
        id,
      ];
    } else {
      // Keep existing image intact
      updateQuery = `
        UPDATE services SET
          title = $1,
          description = $2,
          features = $3,
          button_label = $4,
          icon_key = $5,
          is_active = $6,
          updated_at = NOW()
        WHERE id = $7
        RETURNING id, title, description, features, button_label, button_link, icon_key,
                  sort_order, is_active, (image_data IS NOT NULL) AS has_image_data,
                  image_updated_at, created_at, updated_at
      `;
      queryParams = [
        title.trim(),
        description.trim(),
        JSON.stringify(featuresList),
        (button_label || "Discuss Your Project").trim().slice(0, 40),
        validatedIcon,
        activeBool,
        id,
      ];
    }

    const { rows } = await pool.query(updateQuery, queryParams);

    return res.json({
      success: true,
      message: "Service updated successfully.",
      data: formatServiceRow(rows[0]),
    });
  } catch (err) {
    console.error("Error updating service:", err);
    return res.status(500).json({ success: false, message: "Failed to update service: " + err.message });
  }
}

// 6. PATCH /api/admin/services/:id/active (Admin Toggle Active)
async function toggleActive(req, res) {
  try {
    const { id } = req.params;
    let { is_active } = req.body;

    let query;
    let params;

    if (is_active !== undefined) {
      const activeBool = is_active === "true" || is_active === true;
      query = `
        UPDATE services 
        SET is_active = $1, updated_at = NOW()
        WHERE id = $2
        RETURNING id, title, description, features, button_label, button_link, icon_key,
                  sort_order, is_active, (image_data IS NOT NULL) AS has_image_data,
                  image_updated_at, created_at, updated_at
      `;
      params = [activeBool, id];
    } else {
      query = `
        UPDATE services 
        SET is_active = NOT is_active, updated_at = NOW()
        WHERE id = $1
        RETURNING id, title, description, features, button_label, button_link, icon_key,
                  sort_order, is_active, (image_data IS NOT NULL) AS has_image_data,
                  image_updated_at, created_at, updated_at
      `;
      params = [id];
    }

    const { rows } = await pool.query(query, params);
    if (!rows.length) {
      return res.status(404).json({ success: false, message: "Service not found." });
    }

    return res.json({
      success: true,
      message: `Service is now ${rows[0].is_active ? "active" : "hidden"}.`,
      data: formatServiceRow(rows[0]),
    });
  } catch (err) {
    console.error("Error toggling service active state:", err);
    return res.status(500).json({ success: false, message: "Failed to update status." });
  }
}

// 7. PUT /api/admin/services/reorder (Admin Reorder)
async function reorderServices(req, res) {
  const client = await pool.connect();
  try {
    const { order } = req.body;

    if (!Array.isArray(order) || !order.length) {
      return res.status(400).json({ success: false, message: "Invalid order array." });
    }

    await client.query("BEGIN");

    for (let i = 0; i < order.length; i++) {
      const item = order[i];
      const serviceId = typeof item === "object" ? item.id : item;
      const sortOrder = typeof item === "object" && item.sort_order !== undefined ? item.sort_order : i + 1;

      await client.query(
        "UPDATE services SET sort_order = $1, updated_at = NOW() WHERE id = $2",
        [sortOrder, serviceId]
      );
    }

    await client.query("COMMIT");

    return res.json({
      success: true,
      message: "Services reordered successfully.",
    });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Error reordering services:", err);
    return res.status(500).json({ success: false, message: "Failed to reorder services." });
  } finally {
    client.release();
  }
}

// 8. DELETE /api/admin/services/:id (Admin Delete)
async function deleteService(req, res) {
  try {
    const { id } = req.params;
    const { rowCount } = await pool.query("DELETE FROM services WHERE id = $1", [id]);

    if (!rowCount) {
      return res.status(404).json({ success: false, message: "Service not found." });
    }

    return res.json({
      success: true,
      message: "Service deleted successfully.",
    });
  } catch (err) {
    console.error("Error deleting service:", err);
    return res.status(500).json({ success: false, message: "Failed to delete service." });
  }
}

// 9. POST /api/admin/services/import-defaults (Import Defaults Safety Net)
async function importDefaults(req, res) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    const countRes = await client.query("SELECT COUNT(*) FROM services");
    const count = parseInt(countRes.rows[0].count, 10);

    if (count > 0) {
      await client.query("ROLLBACK");
      return res.status(409).json({
        success: false,
        message: `Database already contains ${count} services. Import aborted.`,
      });
    }

    const insertedRows = [];
    for (const s of DEFAULT_SERVICES) {
      const insertRes = await client.query(
        `INSERT INTO services (
          title, description, features, button_label, button_link, icon_key,
          sort_order, is_active, created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())
        RETURNING id, title, description, features, button_label, button_link, icon_key,
                  sort_order, is_active, (image_data IS NOT NULL) AS has_image_data,
                  image_updated_at, created_at, updated_at`,
        [
          s.title,
          s.description,
          JSON.stringify(s.features),
          s.button_label,
          s.button_link || DEFAULT_BUTTON_LINK,
          s.icon_key,
          s.sort_order,
          s.is_active,
        ]
      );
      insertedRows.push(formatServiceRow(insertRes.rows[0]));
    }

    await client.query("COMMIT");

    return res.status(201).json({
      success: true,
      message: `Successfully imported ${insertedRows.length} default services.`,
      data: insertedRows,
    });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Error importing default services:", err);
    return res.status(500).json({ success: false, message: "Failed to import default services." });
  } finally {
    client.release();
  }
}

module.exports = {
  getPublicServices,
  getServiceImage,
  getAdminServices,
  createService,
  updateService,
  toggleActive,
  reorderServices,
  deleteService,
  importDefaults,
};
