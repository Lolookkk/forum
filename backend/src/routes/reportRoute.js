const express = require("express");
const router = express.Router();

const { reportTopic, reportPost } = require("../controllers/reportController");
const authenticateToken = require("../middlewares/authMiddleware");

router.post("/topics/:id",authenticateToken, reportTopic);
router.post("/posts/:id",authenticateToken, reportPost);

module.exports = router;
