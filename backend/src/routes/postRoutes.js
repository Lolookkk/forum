const express = require("express");
const router = express.Router();

const { postPost, updatePost, likePost, unlikePost, getAllPostsWithAuthorByTopic, getPostById
 } = require("../controllers/postController");
const { reportPost } = require("../controllers/reportController");
const authenticateToken = require("../middlewares/authMiddleware");

router.get("/:id", getPostById);
router.get("/infos/:topic_id", getAllPostsWithAuthorByTopic);
router.post("/", authenticateToken, postPost);
router.put("/:id",authenticateToken, updatePost);
router.post("/:post_id/reports", authenticateToken, reportPost);

router.post("/:id/likes",authenticateToken,likePost);
router.delete("/:id/likes",authenticateToken,unlikePost);

module.exports = router;
