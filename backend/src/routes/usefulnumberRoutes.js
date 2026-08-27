const express = require("express");
const router = express.Router();

const {
  getAllNumbers,
  getNumberById,
  createNumber,
  updateNumber,
  deleteNumber,
  getAllNumberCategories,
  createNumberCategory,
  updateNumberCategory,
  deleteNumberCategory,
} = require("../controllers/usefulnumberController");

const authenticateToken = require("../middlewares/authMiddleware");
const requireRole = require("../middlewares/roleMiddleware");

// ==========================================
// ROUTES CATÉGORIES (déclarées avant /:id)
// ==========================================
router.get("/categories", getAllNumberCategories);
router.post("/categories", authenticateToken, requireRole("admin"), createNumberCategory);
router.put("/categories/:id", authenticateToken, requireRole("admin"), updateNumberCategory);
router.delete("/categories/:id", authenticateToken, requireRole("admin"), deleteNumberCategory);

// ==========================================
// ROUTES NUMÉROS UTILES
// ==========================================
router.get("/", getAllNumbers);
router.get("/:id", getNumberById);
router.post("/", authenticateToken, requireRole("admin"), createNumber);
router.put("/:id", authenticateToken, requireRole("admin"), updateNumber);
router.delete("/:id", authenticateToken, requireRole("admin"), deleteNumber);

module.exports = router;