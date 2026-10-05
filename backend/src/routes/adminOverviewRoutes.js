const express = require("express");
const { getAdminOverview } = require("../controllers/adminOverviewController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.use(authMiddleware);

router.get("/", getAdminOverview);

module.exports = router;
