const express = require("express");
const rateLimit = require("express-rate-limit");
const {
  createContactMessage,
  getAdminContactMessages,
  markAllAsRead,
  getAdminContactMessageById,
  updateAdminContactMessage,
  deleteAdminContactMessage,
} = require("../controllers/contactMessageController");
const authMiddleware = require("../middleware/authMiddleware");

// Custom short logger for contact messages
function contactMessageLogger(req, res, next) {
  const start = Date.now();
  const method = req.method;
  const url = req.originalUrl || req.url;

  res.on("finish", () => {
    const duration = Date.now() - start;
    const status = res.statusCode;
    const isError = status >= 400;
    const logMsg = `[ContactMessages API] ${method} ${url} -> ${status} (${duration}ms)`;
    if (isError) {
      console.warn(logMsg);
    } else {
      console.log(logMsg);
    }
  });

  next();
}

// Rate limiter for public contact submissions: 10 requests per hour per IP
const contactMessageLimiter = rateLimit({
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

publicRouter.use(contactMessageLogger);
adminRouter.use(contactMessageLogger);

// Public route: Submit contact message
publicRouter.post("/", contactMessageLimiter, createContactMessage);

// Admin routes (all protected by JWT authMiddleware)
adminRouter.use(authMiddleware);

// Static paths first to avoid :id collisions
adminRouter.patch("/read-all", markAllAsRead);

// CRUD routes
adminRouter.get("/", getAdminContactMessages);
adminRouter.get("/:id", getAdminContactMessageById);
adminRouter.patch("/:id", updateAdminContactMessage);
adminRouter.delete("/:id", deleteAdminContactMessage);

module.exports = {
  publicRouter,
  adminRouter,
};
