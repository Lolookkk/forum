const usefulnumberModel = require("../models/usefulnumberModel");

// ==========================================
// NUMÉROS UTILES
// ==========================================

const getAllNumbers = async (req, res, next) => {
  try {
    const numbers = await usefulnumberModel.getAllNumbers();
    res.status(200).json({
      success: true,
      data: numbers,
    });
  } catch (error) {
    next(error);
  }
};

const getNumberById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const number = await usefulnumberModel.getNumberById(id);

    if (!number) {
      return res.status(404).json({ message: "Numéro utile non trouvé" });
    }

    res.status(200).json({
      success: true,
      data: number,
    });
  } catch (error) {
    next(error);
  }
};

const createNumber = async (req, res, next) => {
  try {
    const { category_id, name, number } = req.body;

    if (!category_id || !name || !number) {
      return res.status(400).json({
        message: "La catégorie, le nom et le numéro sont requis",
      });
    }

    const newNumber = await usefulnumberModel.createNumber(req.body);

    res.status(201).json({
      success: true,
      message: "Numéro utile créé avec succès",
      data: newNumber,
    });
  } catch (error) {
    next(error);
  }
};

const updateNumber = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { category_id, name, number } = req.body;

    if (!category_id || !name || !number) {
      return res.status(400).json({
        message: "La catégorie, le nom et le numéro sont requis",
      });
    }

    const updatedNumber = await usefulnumberModel.updateNumber(id, req.body);

    if (!updatedNumber) {
      return res.status(404).json({ message: "Numéro utile non trouvé" });
    }

    res.status(200).json({
      success: true,
      message: "Numéro utile mis à jour avec succès",
      data: updatedNumber,
    });
  } catch (error) {
    next(error);
  }
};

const deleteNumber = async (req, res, next) => {
  try {
    const { id } = req.params;

    const deletedNumber = await usefulnumberModel.deleteNumber(id);

    if (!deletedNumber) {
      return res.status(404).json({ message: "Numéro utile non trouvé" });
    }

    res.status(200).json({
      success: true,
      message: "Numéro utile supprimé avec succès",
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// CATÉGORIES DE NUMÉROS
// ==========================================

const getAllNumberCategories = async (req, res, next) => {
  try {
    const categories = await usefulnumberModel.findAllNumberCategories();
    res.status(200).json({
      success: true,
      data: categories,
    });
  } catch (error) {
    next(error);
  }
};

const createNumberCategory = async (req, res, next) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({
        message: "Le nom de la catégorie est requis",
      });
    }

    const newCategory = await usefulnumberModel.createNumberCategory(name);

    res.status(201).json({
      success: true,
      message: "Catégorie créée avec succès",
      data: newCategory,
    });
  } catch (error) {
    next(error);
  }
};

const updateNumberCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({
        message: "Le nom de la catégorie est requis",
      });
    }

    const updatedCategory = await usefulnumberModel.updateNumberCategory(id, name);

    if (!updatedCategory) {
      return res.status(404).json({ message: "Catégorie non trouvée" });
    }

    res.status(200).json({
      success: true,
      message: "Catégorie mise à jour avec succès",
      data: updatedCategory,
    });
  } catch (error) {
    next(error);
  }
};

const deleteNumberCategory = async (req, res, next) => {
  try {
    const { id } = req.params;

    const deletedCategory = await usefulnumberModel.deleteNumberCategory(id);

    if (!deletedCategory) {
      return res.status(404).json({ message: "Catégorie non trouvée" });
    }

    res.status(200).json({
      success: true,
      message: "Catégorie supprimée avec succès",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllNumbers,
  createNumber,
  updateNumber,
  deleteNumber,
  getAllNumberCategories,
  createNumberCategory,
  updateNumberCategory,
  deleteNumberCategory,
  getNumberById,
};