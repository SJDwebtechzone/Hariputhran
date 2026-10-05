const express = require("express");
const {
  getAdminNotifications,
  markAllNotificationsAsRead,
} = require("../controllers/adminNotificationController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.use(authMiddleware);

router.get("/", getAdminNotifications);
router.patch("/read-all", markAllNotificationsAsRead);

module.exports = router;
