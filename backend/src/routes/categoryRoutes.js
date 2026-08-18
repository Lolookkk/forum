const express = require("express");
const router = express.Router();
const { getCategories, reorderCategories, createCategory,updateCategory, deleteCategory } = require("../controllers/categoryController");
const { getSubcategoriesByCategory } = require("../controllers/subcategoryController");
const authenticateToken = require("../middlewares/authMiddleware");
const requireRole = require("../middlewares/roleMiddleware");

router.get("/", getCategories);
router.get("/:category_id/subcategories", getSubcategoriesByCategory);

router.post("/",authenticateToken, requireRole("admin"),createCategory);
router.put(
  "/reorder",
  authenticateToken,
  requireRole("admin"),
  reorderCategories
);
router.put("/:id",authenticateToken, requireRole("admin"),updateCategory);
router.delete("/:id",authenticateToken, requireRole("admin"),deleteCategory);


module.exports = router;
