const express = require("express");
const router = express.Router();

const {
  getAllFiches,
  getFicheBySlug
} = require("../controllers/ficheController");

const authenticateToken = require("../middlewares/authMiddleware");
const requireRole = require("../middlewares/roleMiddleware");

router.get("/", getAllFiches);
router.get("/:slug", getFicheBySlug);

module.exports = router;