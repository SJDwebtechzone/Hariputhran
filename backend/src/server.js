require("dotenv").config();
const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const { publicRouter, adminRouter } = require("./routes/serviceRoutes");
const { publicRecentWorksRouter, adminRecentWorksRouter } = require("./routes/recentWorksRoutes");
const { publicRouter: publicServiceRequestsRouter, adminRouter: adminServiceRequestsRouter } = require("./routes/serviceRequestRoutes");
const { publicRouter: publicContactMessagesRouter, adminRouter: adminContactMessagesRouter } = require("./routes/contactMessageRoutes");
const adminNotificationRoutes = require("./routes/adminNotificationRoutes");
const adminOverviewRoutes = require("./routes/adminOverviewRoutes");

const app = express();

// Trust proxy for rate limiting behind proxies (e.g. reverse proxies, load balancers)
app.set("trust proxy", 1);

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Pragma", "Cache-Control"],
  })
);
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend is running");
});

// Minimal health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ success: true, service: "hariputhiran-api" });
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
  console.error("Global Error Caught:", err);
  const status = err.status || err.statusCode || 500;
  return res.status(status).json({
    success: false,
    message: err.message || "An internal server error occurred.",
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log("Registered routes: /api/health, /api/auth, /api/services, /api/admin/services (CRUD, /reorder, /import-defaults)");
});