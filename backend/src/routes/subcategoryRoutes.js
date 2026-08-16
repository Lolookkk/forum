const express = require("express");
const router = express.Router();

const { getSubcategoriesByCategory, getSubcategories, createSubCategory, reorderSubCategories, updateSubCategory,deleteSubCategory} = require("../controllers/subcategoryController");
const authenticateToken = require("../middlewares/authMiddleware");
const requireRole = require("../middlewares/roleMiddleware");

router.get("/", getSubcategories);
router.get("/category/:category_id", getSubcategoriesByCategory);

router.post(
  "/",
  authenticateToken,
  requireRole("admin"),
  createSubCategory
);

// ⚠️ Placé impérativement avant /:id
router.put(
  "/reorder",
  authenticateToken,
  requireRole("admin"),
  reorderSubCategories
);

router.put(
  "/:id",
  authenticateToken,
  requireRole("admin"),
  updateSubCategory
);

router.delete(
  "/:id",
  authenticateToken,
  requireRole("admin"),
  deleteSubCategory
);


module.exports = router;
