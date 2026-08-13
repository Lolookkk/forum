const express = require('express');
const router = express.Router();

const { getPostsByTopic } = require('../controllers/postController');

router.get('/topic/:topic_id', getPostsByTopic);

module.exports = router;