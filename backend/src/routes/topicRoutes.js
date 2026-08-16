const express = require("express");
const router = express.Router();

const {
  getTopicsBySubcategory,
  postTopic,
  moveTopic
} = require("../controllers/topicController");
const authenticateToken = require("../middlewares/authMiddleware");
const requireRole = require("../middlewares/roleMiddleware");

router.get("/subcategory/:subcategory_id", getTopicsBySubcategory);
router.post("/post", authenticateToken, postTopic);

router.put('/:id/move',authenticateToken,requireRole('moderateur', 'admin'),moveTopic);

module.exports = router;
