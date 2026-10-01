const express = require("express");
const {
  getPublicRecentWorks,
  getRecentWorkImage,
  getAdminRecentWorks,
  updateRecentWork,
} = require("../controllers/recentWorksController");
const authMiddleware = require("../middleware/authMiddleware");
const { handleRecentWorkImageUpload } = require("../middleware/uploadRecentWorkImage");
const recentWorksLogger = require("../middleware/recentWorksLogger");

const publicRecentWorksRouter = express.Router();
const adminRecentWorksRouter = express.Router();

// Attach concise logger to both routers
publicRecentWorksRouter.use(recentWorksLogger);
adminRecentWorksRouter.use(recentWorksLogger);

// Public routes
publicRecentWorksRouter.get("/", getPublicRecentWorks);
publicRecentWorksRouter.get("/:id/image", getRecentWorkImage);

// Admin routes (protected by authMiddleware)
adminRecentWorksRouter.use(authMiddleware);

adminRecentWorksRouter.get("/", getAdminRecentWorks);
adminRecentWorksRouter.put("/:id", handleRecentWorkImageUpload("image"), updateRecentWork);

module.exports = {
  publicRecentWorksRouter,
  adminRecentWorksRouter,
};
