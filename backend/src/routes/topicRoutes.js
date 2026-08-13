const express = require('express');
const router = express.Router();

const { getTopicsBySubcategory } = require('../controllers/topicController');

router.get('/subcategory/:subcategory_id', getTopicsBySubcategory);

module.exports = router;