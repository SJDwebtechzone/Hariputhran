const express = require("express");
const router = express.Router();
const {
  login,
  me,
  forgotPassword,
  resetPassword,
  changePassword,
  changeEmail,
} = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");
const {
  loginLimiter,
  forgotPasswordLimiter,
  resetPasswordLimiter,
} = require("../middleware/rateLimiters");

// Public routes with rate limiting
router.post("/login", loginLimiter, login);
router.post("/forgot-password", forgotPasswordLimiter, forgotPassword);
router.post("/reset-password", resetPasswordLimiter, resetPassword);

// Protected routes (JWT verification)
router.get("/me", authMiddleware, me);
router.put("/change-password", authMiddleware, changePassword);
router.put("/change-email", authMiddleware, changeEmail);

module.exports = router;
