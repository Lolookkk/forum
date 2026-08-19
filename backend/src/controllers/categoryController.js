const slugify = require("slugify");
const categoryModel = require("../models/categoryModel");

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

const getCategoryBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const category = await categoryModel.getCategoryBySlug(slug);

    if (!category) {
      return res.status(404).json({ message: "Catégorie non trouvée" });
    }

    res.status(200).json({
      success: true,
      data: category,
    });
  } catch (error) {
    next(error);
  }
};

const createCategory = async (req, res, next) => {
  try {
    const { name, description } = req.body;

    const user_id = req.user?.id || req.user?.userId;

    if (!name || !description) {
      return res.status(400).json({ message: "Tous les champs sont requis" });
    }
    const newCategory = await categoryModel.createCategory(name, description);
    res.status(201).json({ message: "Category créée avec succès", category: newCategory });
  } catch (error) {
    next(error);
  }
};

const updateCategory = async (req, res, next) => {
  const { id } = req.params;
  const { name, description } = req.body;

  // On vérifie qu'au moins l'un des deux champs est envoyé
  if (!name && !description) {
    return res.status(400).json({ 
      message: "Au moins un champ (name ou description) doit être fourni pour la mise à jour." 
    });
  }

  try {
    const updatedCategory = await categoryModel.updateCategory(id, { name, description });

    if (!updatedCategory) {
      return res.status(404).json({ message: "Catégorie non trouvée" });
    }

    res.status(200).json({
      message: "Catégorie mise à jour avec succès",
      category: updatedCategory,
    });
  } catch (error) {
    next(error);
  }
};

const deleteCategory = async (req,res,next) => {
  try {
    const {id} = req.params;

    const deleteCategory = await categoryModel.deleteCategory(id);
    if (!deleteCategory) {
      return res.status(404).json({ message: "Aucune catégorie à retirer" });
    }
    res.status(200).json({ message: "Catégorie retirée avec succès"});
  } catch (error) {
    console.error("❌ deleteCategory error:", error);
    next(error);
    }
}

const reorderCategories = async (req, res, next) => {
  try {
    const { categories } = req.body; // Format attendu : [{ id: 1, display_order: 2 }, { id: 2, display_order: 1 }]

    if (!Array.isArray(categories) || categories.length === 0) {
      return res
        .status(400)
        .json({ message: "Un tableau 'categories' valide est requis." });
    }

    const updatedCategories = await categoryModel.reorderCategories(categories);

    res.status(200).json({
      message: "Ordre des catégories mis à jour avec succès",
      categories: updatedCategories,
    });
  } catch (error) {
    console.error("❌ reorderCategories error:", error);
    next(error);
  }
};


module.exports = {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  reorderCategories,
  getCategoryBySlug
};
