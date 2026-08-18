const express = require("express");
const router = express.Router();

const {
  postTopic,
  moveTopic
} = require("../controllers/topicController");
const { getPostsByTopic } = require("../controllers/postController");
const { reportTopic } = require("../controllers/reportController");
const authenticateToken = require("../middlewares/authMiddleware");
const requireRole = require("../middlewares/roleMiddleware");

router.post("/", authenticateToken, postTopic);
router.get("/:topic_id/posts", getPostsByTopic);
router.post("/:topic_id/reports", authenticateToken, reportTopic);

router.put('/:id/move',authenticateToken,requireRole('moderateur', 'admin'),moveTopic);

module.exports = router;
