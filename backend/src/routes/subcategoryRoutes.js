const express = require("express");
const router = express.Router();

const { getSubcategories, createSubCategory, reorderSubCategories, updateSubCategory,deleteSubCategory} = require("../controllers/subcategoryController");
const { getTopicsBySubcategory } = require("../controllers/topicController");
const authenticateToken = require("../middlewares/authMiddleware");
const requireRole = require("../middlewares/roleMiddleware");

router.get("/", getSubcategories);
router.get("/:subcategory_id/topics", getTopicsBySubcategory);

router.post(
  "/",
  authenticateToken,
  requireRole("admin"),
  createSubCategory
);

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
