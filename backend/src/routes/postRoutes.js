const express = require("express");
const router = express.Router();

const { getPostsByTopic, postPost, updatePost, likePost, unlikePost } = require("../controllers/postController");
const authenticateToken = require("../middlewares/authMiddleware");

router.get("/topic/:topic_id", getPostsByTopic);
router.post("/post", authenticateToken, postPost);
router.put("/:id",authenticateToken, updatePost);

//les likes
router.post("/:id/likes",authenticateToken,likePost);
router.delete("/:id/likes",authenticateToken,unlikePost);

module.exports = router;
