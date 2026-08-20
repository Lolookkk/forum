const subCategoryModel = require("../models/subcategoryModel");

const getSubcategories = async (req, res, next) => {
  try {
    const subcategories = await subCategoryModel.getAllSubcategories();
    res.status(200).json({
      success: true,
      data: subcategories,
    });
  } catch (error) {
    next(error);
  }
};

const getSubcategoryBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const subcategory = await subCategoryModel.getSubcategoryBySlug(slug);

    if (!subcategory) {
      return res.status(404).json({ message: "Sous-catégorie non trouvée" });
    }

    res.status(200).json({
      success: true,
      data: subcategory,
    });
  } catch (error) {
    next(error);
  }
};


const getSubcategoriesByCategory = async (req, res, next) => {
  const { category_id } = req.params;
  try {
    const subcategories =
      await subCategoryModel.getAllSubcategoriesByCategory(category_id);
    res.status(200).json({
      success: true,
      data: subcategories,
    });
  } catch (error) {
    next(error);
  }
};

const createSubCategory = async (req, res, next) => {
  try {
    const { category_id, title, description } = req.body;

    if (!category_id || !title || !description) {
      return res.status(400).json({
        message: "Les champs category_id, title et description sont requis",
      });
    }

    const newSubCategory = await subCategoryModel.createSubCategory(
      category_id,
      title,
      description
    );
    res.status(201).json({
      message: "Sous-catégorie créée avec succès",
      subCategory: newSubCategory,
    });
  } catch (error) {
    next(error);
  }
};

const updateSubCategory = async (req, res, next) => {
  const { id } = req.params;
  const { category_id, title, description } = req.body;

  if (!category_id && !title && !description) {
    return res.status(400).json({
      message:
        "Au moins un champ (category_id, title ou description) doit être fourni.",
    });
  }

  try {
    const updatedSubCategory = await subCategoryModel.updateSubCategory(id, {
      category_id,
      title,
      description,
    });

    if (!updatedSubCategory) {
      return res.status(404).json({ message: "Sous-catégorie non trouvée" });
    }

    res.status(200).json({
      message: "Sous-catégorie mise à jour avec succès",
      subCategory: updatedSubCategory,
    });
  } catch (error) {
    next(error);
  }
};

const deleteSubCategory = async (req, res, next) => {
  try {
    const { id } = req.params;

    const deletedSubCategory = await subCategoryModel.deleteSubCategory(id);
    if (!deletedSubCategory) {
      return res.status(404).json({ message: "Aucune sous-catégorie à retirer" });
    }

    res.status(200).json({ message: "Sous-catégorie retirée avec succès" });
  } catch (error) {
    console.error("❌ deleteSubCategory error:", error);
    next(error);
  }
};

const reorderSubCategories = async (req, res, next) => {
  try {
    const { subcategories } = req.body;

    if (!Array.isArray(subcategories) || subcategories.length === 0) {
      return res
        .status(400)
        .json({ message: "Un tableau 'subcategories' valide est requis." });
    }

    const updatedSubCategories = await subCategoryModel.reorderSubCategories(
      subcategories
    );

    res.status(200).json({
      message: "Ordre des sous-catégories mis à jour avec succès",
      subCategories: updatedSubCategories,
    });
  } catch (error) {
    console.error("❌ reorderSubCategories error:", error);
    next(error);
  }
};

module.exports = {
  getSubcategories,
  getSubcategoriesByCategory,
  createSubCategory,
  updateSubCategory,
  deleteSubCategory,
  reorderSubCategories,
  getSubcategoryBySlug,
};
