require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const authRoutes = require("./routes/authRoutes");
const { publicRouter, adminRouter } = require("./routes/serviceRoutes");
const { publicRecentWorksRouter, adminRecentWorksRouter } = require("./routes/recentWorksRoutes");
const { publicRouter: publicServiceRequestsRouter, adminRouter: adminServiceRequestsRouter } = require("./routes/serviceRequestRoutes");
const { publicRouter: publicContactMessagesRouter, adminRouter: adminContactMessagesRouter } = require("./routes/contactMessageRoutes");
const adminNotificationRoutes = require("./routes/adminNotificationRoutes");
const adminOverviewRoutes = require("./routes/adminOverviewRoutes");

// Production startup guards
const isProd = process.env.NODE_ENV === "production";

if (isProd) {
  const jwtSecret = process.env.JWT_SECRET || "";
  if (!jwtSecret || jwtSecret.length < 32) {
    console.error("FATAL: JWT_SECRET is required and must be at least 32 characters in production.");
    process.exit(1);
  }

  const requiredMailVars = ["SMTP_HOST", "SMTP_USER", "SMTP_PASS", "MAIL_FROM", "ADMIN_NOTIFY_EMAIL", "FRONTEND_URL"];
  const missingMailVars = requiredMailVars.filter((v) => !process.env[v]);
  if (missingMailVars.length > 0) {
    console.warn(`[Production Warning] Missing mail/frontend configuration: ${missingMailVars.join(", ")}`);
  }
}

const app = express();

// Helmet security headers (CORP cross-origin for image streaming, CSP disabled)
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    contentSecurityPolicy: false,
  })
);

// Trust proxy for rate limiting behind proxies (e.g. reverse proxies, load balancers)
app.set("trust proxy", 1);

// CORS configuration
if (isProd) {
  const rawOrigins = process.env.ALLOWED_ORIGINS || "";
  const allowedOriginsList = rawOrigins
    .split(",")
    .map((o) => o.trim())
    .filter(Boolean);

  if (allowedOriginsList.length === 0) {
    console.warn("[Production Warning] ALLOWED_ORIGINS is not set. All origins with Origin header will be blocked.");
  }

  app.use(
    cors({
      origin: (origin, callback) => {
        // Allow requests with no origin (e.g., mobile apps, curl, server-to-server)
        if (!origin) return callback(null, true);
        if (allowedOriginsList.includes(origin)) {
          return callback(null, true);
        }
        return callback(new Error(`CORS origin not allowed: ${origin}`));
      },
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization", "Pragma", "Cache-Control"],
      credentials: true,
    })
  );
} else {
  // Development / test behavior
  app.use(
    cors({
      origin: "*",
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization", "Pragma", "Cache-Control"],
    })
  );
}

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend is running");
});

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ success: true, status: "ok", service: "hariputhiran-api" });
});

app.use("/api/auth", authRoutes);
app.use("/api/services", publicRouter);
app.use("/api/admin/services", adminRouter);
app.use("/api/recent-works", publicRecentWorksRouter);
app.use("/api/admin/recent-works", adminRecentWorksRouter);
app.use("/api/service-requests", publicServiceRequestsRouter);
app.use("/api/admin/service-requests", adminServiceRequestsRouter);
app.use("/api/contact-messages", publicContactMessagesRouter);
app.use("/api/admin/contact-messages", adminContactMessagesRouter);
app.use("/api/admin/notifications", adminNotificationRoutes);
app.use("/api/admin/overview", adminOverviewRoutes);

// Global Error Handler Middleware
app.use((err, req, res, next) => {
  console.error("Global Error Caught:", err.message || err);
  const status = err.status || err.statusCode || (err.message?.includes("CORS origin not allowed") ? 403 : 500);
  return res.status(status).json({
    success: false,
    message: isProd && status === 500 ? "An internal server error occurred." : err.message || "An internal server error occurred.",
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log("Registered routes: /api/health, /api/auth, /api/services, /api/admin/services, /api/recent-works, /api/service-requests, /api/contact-messages");
});