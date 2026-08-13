const categoryModel = require('../models/categoryModel');

const getCategories = async (req, res, next) => {
  try {
    const categories = await categoryModel.getAllCategories();
    res.status(200).json({
      success: true,
      data: categories,
    });
  } catch (error) {
    next(error); // Transmet l'erreur au middleware global Express
  }
};

module.exports = {
  getCategories,
};