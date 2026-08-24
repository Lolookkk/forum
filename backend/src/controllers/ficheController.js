const slugify = require("slugify");
const ficheModel = require("../models/ficheModel");

const getAllFiches = async (req, res, next) => {
  try {
    const fiches = await ficheModel.getAllFiches();
    res.status(200).json({
      success: true,
      data: fiches,
    });
  } catch (error) {
    next(error); 
  }
};

const getFicheBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const fiche = await ficheModel.getFicheBySlug(slug);

    if (!fiche) {
      return res.status(404).json({ message: "Fiche non trouvée" });
    }

    res.status(200).json({
      success: true,
      data: fiche,
    });
  } catch (error) {
    next(error);
  }
};


module.exports = {
  getAllFiches,
  getFicheBySlug
};