const express = require("express");
const router = express.Router();

const {
  getAllFiches,
  getFicheBySlug,
  createFiche,
  updateTitleFiche,
  updateDescriptionFiche,
  updateContentFiche,
  deleteFiche,
} = require("../controllers/ficheController");

const authenticateToken = require("../middlewares/authMiddleware");
const requireRole = require("../middlewares/roleMiddleware");

// --- Routes publiques ---
router.get("/", getAllFiches);
router.get("/:slug", getFicheBySlug);

// --- Routes protégées (Réservées à l'administrateur) ---
router.post("/", authenticateToken, requireRole("admin"), createFiche);
router.patch("/:id/title", authenticateToken, requireRole("admin"), updateTitleFiche);
router.patch("/:id/description", authenticateToken, requireRole("admin"), updateDescriptionFiche);
router.patch("/:id/content", authenticateToken, requireRole("admin"), updateContentFiche);
router.delete("/:id", authenticateToken, requireRole("admin"), deleteFiche);

module.exports = router;