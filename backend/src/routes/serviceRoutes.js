const express = require("express");
const {
  getPublicServices,
  getServiceImage,
  getAdminServices,
  createService,
  updateService,
  toggleActive,
  reorderServices,
  deleteService,
  importDefaults,
} = require("../controllers/serviceController");
const authMiddleware = require("../middleware/authMiddleware");
const { handleImageUpload } = require("../middleware/uploadImage");
const serviceLogger = require("../middleware/requestLogger");

const publicRouter = express.Router();
const adminRouter = express.Router();

// Attach concise logger to both routers
publicRouter.use(serviceLogger);
adminRouter.use(serviceLogger);

// Public routes
publicRouter.get("/", getPublicServices);
publicRouter.get("/:id/image", getServiceImage);

// Admin routes (all protected by authMiddleware)
adminRouter.use(authMiddleware);

adminRouter.get("/", getAdminServices);
// NOTE: Specific endpoints MUST be defined BEFORE /:id to prevent string matching as an ID
adminRouter.post("/import-defaults", importDefaults);
adminRouter.put("/reorder", reorderServices);
adminRouter.post("/", handleImageUpload("image"), createService);
adminRouter.put("/:id", handleImageUpload("image"), updateService);
adminRouter.patch("/:id/active", toggleActive);
adminRouter.delete("/:id", deleteService);

module.exports = {
  publicRouter,
  adminRouter,
};
