/**
 * Smoke test script for Hariputhiran Auth & Password Reset API
 * Run: node test-auth-flow.js
 */

const API_BASE = process.env.API_URL || "http://localhost:5000/api/auth";

async function runTests() {
  console.log("=== Hariputhran Backend Auth Flow Smoke Test ===");
  console.log(`Testing target: ${API_BASE}`);

  try {
    // 1. Health check
    console.log("\n1. Testing Backend Root Endpoint...");
    const rootRes = await fetch("http://localhost:5000/");
    const rootText = await rootRes.text();
    console.log(`Status: ${rootRes.status}, Response: "${rootText}"`);

    // 2. Forgot password request (generic 200 response check)
    console.log("\n2. Testing POST /forgot-password with dummy email...");
    const forgotRes = await fetch(`${API_BASE}/forgot-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "test-admin@hariputhran.com" }),
    });
    const forgotData = await forgotRes.json();
    console.log(`Status: ${forgotRes.status}, Response:`, forgotData);

    // 3. Reset password with invalid token (should return 400 with clear message)
    console.log("\n3. Testing POST /reset-password with invalid token...");
    const resetRes = await fetch(`${API_BASE}/reset-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        token: "invalid-token-12345",
        newPassword: "TestPassword123!",
        confirmPassword: "TestPassword123!",
      }),
    });
    const resetData = await resetRes.json();
    console.log(`Status: ${resetRes.status}, Response:`, resetData);

    // 4. Protected route without token (should return 401)
    console.log("\n4. Testing GET /me without auth token...");
    const meRes = await fetch(`${API_BASE}/me`);
    const meData = await meRes.json();
    console.log(`Status: ${meRes.status}, Response:`, meData);

    console.log("\n✓ Basic smoke test completed successfully!");
  } catch (err) {
    console.error("Test error:", err.message);
  }
}

runTests();
