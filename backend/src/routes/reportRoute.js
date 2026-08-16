const express = require("express");
const router = express.Router();

const { reportTopic, reportPost, getReportsDashboard  } = require("../controllers/reportController");
const authenticateToken = require("../middlewares/authMiddleware");
const requireRole = require("../middlewares/roleMiddleware");

router.post("/topics/:id",authenticateToken, reportTopic);
router.post("/posts/:id",authenticateToken, reportPost);

//routes modérateur
router.get('/dashboard',authenticateToken, requireRole('moderateur', 'admin'), getReportsDashboard);

module.exports = router;
