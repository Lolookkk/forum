const express = require('express');
const router = express.Router();

const { getSubcategories } = require('../controllers/subcategoryController');
const { getSubcategoriesByCategory } = require('../controllers/subcategoryController');

router.get('/', getSubcategories);
router.get('/category/:category_id', getSubcategoriesByCategory);

module.exports = router;