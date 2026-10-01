const express = require("express");
const rateLimit = require("express-rate-limit");
const {
  createServiceRequest,
  getAdminServiceRequests,
  getNotifications,
  markAllAsRead,
  exportCsv,
  getAdminServiceRequestById,
  updateAdminServiceRequest,
  deleteAdminServiceRequest,
} = require("../controllers/serviceRequestController");
const authMiddleware = require("../middleware/authMiddleware");

// Custom short logger for service requests
function serviceRequestLogger(req, res, next) {
  const start = Date.now();
  const method = req.method;
  const url = req.originalUrl || req.url;

  res.on("finish", () => {
    const duration = Date.now() - start;
    const status = res.statusCode;
    const isError = status >= 400;
    const logMsg = `[ServiceRequests API] ${method} ${url} -> ${status} (${duration}ms)`;
    if (isError) {
      console.warn(logMsg);
    } else {
      console.log(logMsg);
    }
  });

  next();
}

// 10 requests per hour per IP on public endpoint
const serviceRequestLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests. Please try again later.",
  },
});

const publicRouter = express.Router();
const adminRouter = express.Router();

publicRouter.use(serviceRequestLogger);
adminRouter.use(serviceRequestLogger);

// Public route: Submit service request
publicRouter.post("/", serviceRequestLimiter, createServiceRequest);

// Admin routes (all protected by JWT)
adminRouter.use(authMiddleware);

// Declare static endpoints FIRST to avoid collision with /:id
adminRouter.get("/notifications", getNotifications);
adminRouter.patch("/read-all", markAllAsRead);
adminRouter.get("/export.csv", exportCsv);
adminRouter.get("/", getAdminServiceRequests);

// Dynamic endpoints with :id
adminRouter.get("/:id", getAdminServiceRequestById);
adminRouter.patch("/:id", updateAdminServiceRequest);
adminRouter.delete("/:id", deleteAdminServiceRequest);

module.exports = {
  publicRouter,
  adminRouter,
};
