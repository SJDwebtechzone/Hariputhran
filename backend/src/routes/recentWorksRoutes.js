const express = require("express");
const {
  getPublicRecentWorks,
  getRecentWorkImage,
  getAdminRecentWorks,
  updateRecentWork,
  updateRecentWorkActive,
  updateSectionActive,
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
adminRecentWorksRouter.patch("/section/active", updateSectionActive);
adminRecentWorksRouter.put("/:id", handleRecentWorkImageUpload("image"), updateRecentWork);
adminRecentWorksRouter.patch("/:id/active", updateRecentWorkActive);

module.exports = {
  publicRecentWorksRouter,
  adminRecentWorksRouter,
};
