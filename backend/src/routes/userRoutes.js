const express = require("express");
const router = express.Router();

const {
  updateUserEmail,
  updateUserUsername,
  updateUserPassword,
} = require("../controllers/userController");
const authenticateToken = require("../middlewares/authMiddleware");

router.put("/email", authenticateToken, updateUserEmail);
router.put("/username", authenticateToken, updateUserUsername);
router.put("/password", authenticateToken, updateUserPassword);

module.exports = router;
