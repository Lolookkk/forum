const express = require("express");
const router = express.Router();

const {
  updateUserEmail,
  updateUserUsername,
  updateOwnProfile,
  updateUserPassword,
  updateUserRole,
  toggleUserBan,
  getAllUsers,
  getAllActivityOfUser,
  deleteUser
} = require("../controllers/userController");
const authenticateToken = require("../middlewares/authMiddleware");
const requireRole = require("../middlewares/roleMiddleware");

router.get("/", getAllUsers);
router.get("/:username", getAllActivityOfUser);

router.put("/me/email", authenticateToken, updateUserEmail);
router.put("/me/username", authenticateToken, updateUserUsername);
router.patch("/me/profile", authenticateToken, updateOwnProfile);
router.put("/me/password", authenticateToken, updateUserPassword);

//admin
router.patch("/:id/role",authenticateToken,requireRole('admin'), updateUserRole);
router.patch("/:id/ban",authenticateToken,requireRole('admin'), toggleUserBan);
router.delete("/:id",authenticateToken,requireRole('admin'), deleteUser);

module.exports = router;
