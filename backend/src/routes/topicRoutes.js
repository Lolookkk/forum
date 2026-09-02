const express = require("express");
const router = express.Router();

const {
  postTopic,
  updateTopic,
  moveTopic,
  getTwentyFirstTopics,
  getTopicInformationById,
  getTopicBySlug,
} = require("../controllers/topicController");

const { getPostsByTopic } = require("../controllers/postController");
const { reportTopic } = require("../controllers/reportController");
const authenticateToken = require("../middlewares/authMiddleware");
const requireRole = require("../middlewares/roleMiddleware");

router.get("/", getTwentyFirstTopics);
router.post("/", authenticateToken, postTopic);
router.get("/infos/:id", getTopicInformationById);
router.put("/:id", authenticateToken, updateTopic);
router.get("/:topic_id/posts", getPostsByTopic);
router.post("/:topic_id/reports", authenticateToken, reportTopic);
router.put("/:id/move", authenticateToken, requireRole("moderateur", "admin"), moveTopic);
router.get("/:slug", getTopicBySlug);


module.exports = router;
