const express = require("express");
const router = express.Router();

const {
  getAllNumbers
} = require("../controllers/usefulnumberController");

const authenticateToken = require("../middlewares/authMiddleware");
const requireRole = require("../middlewares/roleMiddleware");

router.get("/", getAllNumbers);

module.exports = router;