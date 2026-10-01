const pool = require("../db");

// Helper to format row for client responses
function formatRecentWorkRow(row, isAdmin = false) {
  const hasImage = !!row.has_image || !!row.has_image_data;
  const version = row.image_updated_at ? new Date(row.image_updated_at).getTime() : 1;
  const imageUrl = hasImage ? `/api/recent-works/${row.id}/image?v=${version}` : null;

  const result = {
    id: Number(row.id),
    position: Number(row.id),
    title: row.title,
    location: row.location,
    hasImage: hasImage,
    imageUrl: imageUrl,
  };

  if (isAdmin) {
    result.updatedAt = row.updated_at || null;
    result.imageUpdatedAt = row.image_updated_at || null;
  }

  return result;
}

// 1. GET /api/recent-works (Public list)
async function getPublicRecentWorks(req, res) {
  try {
    res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");

    const query = `
      SELECT 
        id, title, location,
        (image_data IS NOT NULL) AS has_image_data,
        image_updated_at
      FROM home_recent_works
      ORDER BY id ASC
    `;
    const { rows } = await pool.query(query);

    const items = rows.map((r) => formatRecentWorkRow(r, false));
    return res.json({ success: true, count: items.length, data: items });
  } catch (err) {
    console.error("Error fetching public recent works:", err);
    return res.status(500).json({ success: false, message: "Failed to fetch recent works." });
  }
}

// 2. GET /api/recent-works/:id/image (Public streaming image with CORP and caching)
async function getRecentWorkImage(req, res) {
  try {
    const rawId = req.params.id;
    const id = parseInt(rawId, 10);

    if (isNaN(id) || id < 1 || id > 4) {
      return res.status(400).json({ success: false, message: "Invalid recent work ID. ID must be an integer between 1 and 4." });
    }

    const query = `
      SELECT image_data, image_mime, image_updated_at
      FROM home_recent_works
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
    console.error("Error fetching recent work image:", err);
    return res.status(500).json({ success: false, message: "Failed to retrieve image." });
  }
}

// 3. GET /api/admin/recent-works (Admin list)
async function getAdminRecentWorks(req, res) {
  try {
    const query = `
      SELECT 
        id, title, location,
        (image_data IS NOT NULL) AS has_image_data,
        image_updated_at, updated_at
      FROM home_recent_works
      ORDER BY id ASC
    `;
    const { rows } = await pool.query(query);

    const items = rows.map((r) => formatRecentWorkRow(r, true));
    return res.json({ success: true, count: items.length, data: items });
  } catch (err) {
    console.error("Error fetching admin recent works:", err);
    return res.status(500).json({ success: false, message: "Failed to fetch recent works." });
  }
}

// 4. PUT /api/admin/recent-works/:id (Admin update text and/or image)
async function updateRecentWork(req, res) {
  try {
    const rawId = req.params.id;
    const id = parseInt(rawId, 10);

    if (isNaN(id) || id < 1 || id > 4) {
      return res.status(404).json({ success: false, message: "Recent work card not found. ID must be between 1 and 4." });
    }

    const { title, location, removeImage, remove_image } = req.body;

    // Check card exists
    const checkRes = await pool.query("SELECT id FROM home_recent_works WHERE id = $1", [id]);
    if (!checkRes.rows.length) {
      return res.status(404).json({ success: false, message: "Recent work card not found." });
    }

    if (!title || !title.trim()) {
      return res.status(400).json({ success: false, message: "Title is required." });
    }
    const trimmedTitle = title.trim();
    if (trimmedTitle.length > 120) {
      return res.status(400).json({ success: false, message: "Title must not exceed 120 characters." });
    }

    if (!location || !location.trim()) {
      return res.status(400).json({ success: false, message: "Location is required." });
    }
    const trimmedLocation = location.trim();
    if (trimmedLocation.length > 120) {
      return res.status(400).json({ success: false, message: "Location must not exceed 120 characters." });
    }

    const shouldRemoveImage =
      removeImage === true ||
      removeImage === "true" ||
      remove_image === true ||
      remove_image === "true";

    let updateQuery;
    let queryParams;

    if (req.file) {
      const imageData = req.file.buffer;
      const imageMime = req.file.verifiedMime || req.file.mimetype || "image/jpeg";

      updateQuery = `
        UPDATE home_recent_works
        SET title = $1,
            location = $2,
            image_data = $3,
            image_mime = $4,
            image_updated_at = NOW(),
            updated_at = NOW()
        WHERE id = $5
        RETURNING id, title, location, (image_data IS NOT NULL) AS has_image_data, image_updated_at, updated_at
      `;
      queryParams = [trimmedTitle, trimmedLocation, imageData, imageMime, id];
    } else if (shouldRemoveImage) {
      updateQuery = `
        UPDATE home_recent_works
        SET title = $1,
            location = $2,
            image_data = NULL,
            image_mime = NULL,
            image_updated_at = NULL,
            updated_at = NOW()
        WHERE id = $3
        RETURNING id, title, location, (image_data IS NOT NULL) AS has_image_data, image_updated_at, updated_at
      `;
      queryParams = [trimmedTitle, trimmedLocation, id];
    } else {
      updateQuery = `
        UPDATE home_recent_works
        SET title = $1,
            location = $2,
            updated_at = NOW()
        WHERE id = $3
        RETURNING id, title, location, (image_data IS NOT NULL) AS has_image_data, image_updated_at, updated_at
      `;
      queryParams = [trimmedTitle, trimmedLocation, id];
    }

    const { rows } = await pool.query(updateQuery, queryParams);

    return res.json({
      success: true,
      message: "Recent work card updated successfully.",
      data: formatRecentWorkRow(rows[0], true),
    });
  } catch (err) {
    console.error("Error updating recent work:", err);
    return res.status(500).json({ success: false, message: "Failed to update recent work: " + err.message });
  }
}

module.exports = {
  getPublicRecentWorks,
  getRecentWorkImage,
  getAdminRecentWorks,
  updateRecentWork,
};
