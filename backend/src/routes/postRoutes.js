const express = require("express");
const router = express.Router();

const { getPostsByTopic, postPost, updatePost } = require("../controllers/postController");
const authenticateToken = require("../middlewares/authMiddleware");

router.get("/topic/:topic_id", getPostsByTopic);
router.post("/post", authenticateToken, postPost);
router.put("/:id",authenticateToken, updatePost)

module.exports = router;
