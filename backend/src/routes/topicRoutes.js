const express = require("express");
const router = express.Router();

const {
  getTopicsBySubcategory,
  postTopic,
} = require("../controllers/topicController");
const authenticateToken = require("../middlewares/authMiddleware");

router.get("/subcategory/:subcategory_id", getTopicsBySubcategory);
router.post("/post", authenticateToken, postTopic);

module.exports = router;
