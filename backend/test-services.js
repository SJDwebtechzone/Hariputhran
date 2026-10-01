require("dotenv").config();
const pool = require("./src/db");
const jwt = require("jsonwebtoken");

// Tiny valid 1x1 PNG image buffer (67 bytes)
const TINY_PNG_BUFFER = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
  "base64"
);

const API_BASE = "http://localhost:5000";

async function runSmokeTests() {
  console.log("=== STARTING SMOKE TESTS: CORE SERVICES ===");
  const createdTestIds = [];

  try {
    // 1. Authenticate with local admin token
    const adminRes = await pool.query("SELECT id, username, email FROM admins LIMIT 1");
    if (!adminRes.rows.length) {
      throw new Error("No admin account found in database. Seed admins first.");
    }
    const admin = adminRes.rows[0];
    const token = jwt.sign(
      { id: admin.id, username: admin.username, email: admin.email },
      process.env.JWT_SECRET || "hariputhiran_super_secret_jwt_key_2026",
      { expiresIn: "1h" }
    );
    const authHeader = { Authorization: `Bearer ${token}` };

    // 2. Test 1: Create a service WITHOUT image & WITHOUT icon
    console.log("\n[TEST 1] Create Service WITHOUT image & WITHOUT icon...");
    const form1 = new FormData();
    form1.append("title", "Test Service 1 - No Image No Icon");
    form1.append("description", "A robust test service created without image or icon.");
    form1.append("features", JSON.stringify(["Feature A", "Feature B"]));
    form1.append("button_label", "Discuss Project");
    form1.append("icon_key", "none"); // Explicit "none"
    form1.append("is_active", "true");

    const res1 = await fetch(`${API_BASE}/api/admin/services`, {
      method: "POST",
      headers: authHeader,
      body: form1,
    });
    const data1 = await res1.json();
    if (res1.status !== 201 || !data1.success) {
      throw new Error(`Test 1 Failed: HTTP ${res1.status} - ${JSON.stringify(data1)}`);
    }
    const id1 = data1.data.id;
    createdTestIds.push(id1);
    console.log(`✓ Test 1 Passed! ID: ${id1}, icon_key: ${data1.data.icon_key} (Expected: null), has_image: ${data1.data.has_image}`);
    if (data1.data.icon_key !== null) {
      throw new Error(`Expected icon_key to be null, got: ${data1.data.icon_key}`);
    }

    // 3. Test 2: Create a service WITH a valid image (< 200 KB) and custom icon
    console.log("\n[TEST 2] Create Service WITH valid tiny image & custom icon...");
    const form2 = new FormData();
    form2.append("title", "Test Service 2 - With Image & Icon");
    form2.append("description", "A test service with custom photo and icon.");
    form2.append("features", JSON.stringify(["Precision Trenching", "Radar Scanning"]));
    form2.append("button_label", "Get Quote");
    form2.append("icon_key", "Wrench");
    form2.append("is_active", "true");
    form2.append("image", new Blob([TINY_PNG_BUFFER], { type: "image/png" }), "test_pixel.png");

    const res2 = await fetch(`${API_BASE}/api/admin/services`, {
      method: "POST",
      headers: authHeader,
      body: form2,
    });
    const data2 = await res2.json();
    if (res2.status !== 201 || !data2.success) {
      throw new Error(`Test 2 Failed: HTTP ${res2.status} - ${JSON.stringify(data2)}`);
    }
    const id2 = data2.data.id;
    createdTestIds.push(id2);
    console.log(`✓ Test 2 Passed! ID: ${id2}, icon_key: ${data2.data.icon_key}, has_image: ${data2.data.has_image}, image_url: ${data2.data.image_url}`);
    if (!data2.data.has_image || !data2.data.image_url) {
      throw new Error("Expected has_image to be true and image_url to be present");
    }

    // 4. Test 3: Fetch image route
    console.log("\n[TEST 3] Fetching image route GET /api/services/:id/image...");
    const imgRes = await fetch(`${API_BASE}/api/services/${id2}/image`);
    console.log(`  Status: ${imgRes.status}, Content-Type: ${imgRes.headers.get("content-type")}, CORP: ${imgRes.headers.get("cross-origin-resource-policy")}`);
    if (imgRes.status !== 200 || imgRes.headers.get("content-type") !== "image/png") {
      throw new Error(`Test 3 Failed: Image endpoint returned status ${imgRes.status}, expected 200 and image/png`);
    }
    if (imgRes.headers.get("cross-origin-resource-policy") !== "cross-origin") {
      throw new Error(`Test 3 Failed: Expected Cross-Origin-Resource-Policy: cross-origin header`);
    }
    const imgBuffer = Buffer.from(await imgRes.arrayBuffer());
    if (imgBuffer.length !== TINY_PNG_BUFFER.length) {
      throw new Error(`Test 3 Failed: Image byte length mismatch (expected ${TINY_PNG_BUFFER.length}, got ${imgBuffer.length})`);
    }
    console.log(`✓ Test 3 Passed! Image stream matches uploaded byte length exactly (${imgBuffer.length} bytes).`);

    // 5. Test 4: Reject Oversized Image (> 200 KB)
    console.log("\n[TEST 4] Attempting upload of oversized image (250 KB)...");
    const largeBuffer = Buffer.alloc(250 * 1024);
    const formOver = new FormData();
    formOver.append("title", "Oversized Test Service");
    formOver.append("description", "Testing multer 200KB limit.");
    formOver.append("image", new Blob([largeBuffer], { type: "image/jpeg" }), "too_large.jpg");

    const resOver = await fetch(`${API_BASE}/api/admin/services`, {
      method: "POST",
      headers: authHeader,
      body: formOver,
    });
    const dataOver = await resOver.json().catch(() => ({}));
    console.log(`  Status: ${resOver.status}, Message: "${dataOver.message}"`);
    if (resOver.status !== 413) {
      throw new Error(`Test 4 Failed: Expected HTTP 413, got ${resOver.status}`);
    }
    console.log("✓ Test 4 Passed! Oversized image was correctly rejected with HTTP 413.");

    // 6. Test 5: GET Public & Admin Lists
    console.log("\n[TEST 5] Verifying GET /api/services and GET /api/admin/services...");
    const pubRes = await fetch(`${API_BASE}/api/services`);
    const pubData = await pubRes.json();
    console.log(`  Public count: ${pubData.count || pubData.data?.length}`);

    const adminListRes = await fetch(`${API_BASE}/api/admin/services`, {
      headers: authHeader,
    });
    const adminListData = await adminListRes.json();
    console.log(`  Admin count: ${adminListData.count || adminListData.data?.length}`);
    if (pubRes.status !== 200 || adminListRes.status !== 200) {
      throw new Error("Test 5 Failed: Could not fetch public or admin services.");
    }
    console.log("✓ Test 5 Passed! Both list endpoints returned HTTP 200.");

    // 7. Test 6: Toggle Active Status
    console.log("\n[TEST 6] Toggling active status for Service #1...");
    const toggleRes = await fetch(`${API_BASE}/api/admin/services/${id1}/active`, {
      method: "PATCH",
      headers: { ...authHeader, "Content-Type": "application/json" },
      body: JSON.stringify({ is_active: false }),
    });
    const toggleData = await toggleRes.json();
    if (toggleRes.status !== 200 || toggleData.data.is_active !== false) {
      throw new Error("Test 6 Failed: Active status did not update to false.");
    }
    console.log("✓ Test 6 Passed! Service status toggled to hidden (is_active: false).");

    // 8. Test 7: Update Service & Remove Image
    console.log("\n[TEST 7] Updating Service #2 (removing image and updating title)...");
    const formUpdate = new FormData();
    formUpdate.append("title", "Test Service 2 - Updated Title");
    formUpdate.append("description", "Updated description.");
    formUpdate.append("removeImage", "true");

    const updateRes = await fetch(`${API_BASE}/api/admin/services/${id2}`, {
      method: "PUT",
      headers: authHeader,
      body: formUpdate,
    });
    const updateData = await updateRes.json();
    if (updateRes.status !== 200 || updateData.data.has_image !== false || updateData.data.image_url !== null) {
      throw new Error(`Test 7 Failed: Remove image did not reset image_url to null. Received: ${JSON.stringify(updateData)}`);
    }
    console.log("✓ Test 7 Passed! Image removed and title updated successfully.");

    // 9. Test 8: Reorder
    console.log("\n[TEST 8] Testing Reorder endpoint PUT /api/admin/services/reorder...");
    const reorderRes = await fetch(`${API_BASE}/api/admin/services/reorder`, {
      method: "PUT",
      headers: { ...authHeader, "Content-Type": "application/json" },
      body: JSON.stringify({
        order: [
          { id: id2, sort_order: 1 },
          { id: id1, sort_order: 2 },
        ],
      }),
    });
    const reorderData = await reorderRes.json();
    if (reorderRes.status !== 200 || !reorderData.success) {
      throw new Error("Test 8 Failed: Reorder failed.");
    }
    console.log("✓ Test 8 Passed! Reorder completed successfully.");

  } finally {
    // Clean up test rows
    if (createdTestIds.length) {
      console.log(`\n[CLEANUP] Cleaning up ${createdTestIds.length} test service rows...`);
      for (const id of createdTestIds) {
        await pool.query("DELETE FROM services WHERE id = $1", [id]);
      }
      console.log("✓ Cleanup finished.");
    }
    await pool.end();
  }

  console.log("\n=== ALL SMOKE TESTS PASSED CLEANLY! ===");
}

runSmokeTests().catch((err) => {
  console.error("\n❌ SMOKE TEST FAILED:", err);
  process.exit(1);
});
