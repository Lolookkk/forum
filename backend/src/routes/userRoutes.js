const express = require("express");
const router = express.Router();

const {
  updateUserEmail,
  updateUserUsername,
  updateUserPassword,
  updateUserRole,
  toggleUserBan,
  getAllUsers,
  getAllActivityOfUser
} = require("../controllers/userController");
const authenticateToken = require("../middlewares/authMiddleware");
const requireRole = require("../middlewares/roleMiddleware");

router.get("/", getAllUsers);
router.get("/:username", getAllActivityOfUser);

router.put("/me/email", authenticateToken, updateUserEmail);
router.put("/me/username", authenticateToken, updateUserUsername);
router.put("/me/password", authenticateToken, updateUserPassword);

//admin
router.put("/:id/role",authenticateToken,requireRole('admin'), updateUserRole);
router.put("/:id/ban",authenticateToken,requireRole('admin'), toggleUserBan)

module.exports = router;
