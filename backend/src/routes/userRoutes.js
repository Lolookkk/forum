const express = require("express");
const router = express.Router();

const {
  updateUserEmail,
  updateUserUsername,
  updateUserPassword,
  updateUserRole,
  toggleUserBan
} = require("../controllers/userController");
const authenticateToken = require("../middlewares/authMiddleware");
const requireRole = require("../middlewares/roleMiddleware");

router.put("/email", authenticateToken, updateUserEmail);
router.put("/username", authenticateToken, updateUserUsername);
router.put("/password", authenticateToken, updateUserPassword);

//admin
router.put("/:id/role",authenticateToken,requireRole('admin'), updateUserRole);
router.put("/:id/ban",authenticateToken,requireRole('admin'), toggleUserBan)

module.exports = router;
