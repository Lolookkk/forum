const subcategoryModel = require('../models/subcategoryModel');

const getSubcategories = async (req, res, next) => {
  try {
    const subcategories = await subcategoryModel.getAllSubcategories();
    res.status(200).json({
      success: true,
      data: subcategories,
    });
  } catch (error) {
    next(error);
  }
};

const getSubcategoriesByCategory = async (req, res, next) => {
  const { category_id } = req.params;
  try {
    const subcategories = await subcategoryModel.getAllSubcategoriesByCategory(category_id);
    res.status(200).json({
      success: true,
      data: subcategories,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getSubcategories,
  getSubcategoriesByCategory,
};