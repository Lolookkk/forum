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

const createFiche = async (req, res, next) => {
  try {
    const { title, description, icon, icon_color, content } = req.body;

    if (!title || !content || !description) {
      return res.status(400).json({ message: "Le titre, le contenu et la description sont requis" });
    }

    // Génère un slug à partir du titre si non fourni
    const slug = req.body.slug || slugify(title, { lower: true, strict: true });

    const newFiche = await ficheModel.createFiche(
      title,
      slug,
      description,
      icon || null,
      icon_color || null,
      content
    );

    res.status(201).json({
      message: "Fiche créée avec succès",
      data: newFiche,
    });
  } catch (error) {
    next(error);
  }
};

const updateTitleFiche = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Le champ titre est requis" });
    }

    const updatedFiche = await ficheModel.updateTitleFiche(id, title);

    if (!updatedFiche) {
      return res.status(404).json({ message: "Fiche non trouvée" });
    }

    res.status(200).json({
      message: "Titre mis à jour avec succès",
      data: updatedFiche,
    });
  } catch (error) {
    next(error);
  }
};

const updateDescriptionFiche = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { description } = req.body;

    if (!description) {
      return res.status(400).json({ message: "Le champ description est requis" });
    }

    const updatedFiche = await ficheModel.updateDescriptionFiche(id, description);

    if (!updatedFiche) {
      return res.status(404).json({ message: "Fiche non trouvée" });
    }

    res.status(200).json({
      message: "Description mise à jour avec succès",
      data: updatedFiche,
    });
  } catch (error) {
    next(error);
  }
};

const updateContentFiche = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ message: "Le champ contenu est requis" });
    }

    const updatedFiche = await ficheModel.updateContentFiche(id, content);

    if (!updatedFiche) {
      return res.status(404).json({ message: "Fiche non trouvée" });
    }

    res.status(200).json({
      message: "Contenu mis à jour avec succès",
      data: updatedFiche,
    });
  } catch (error) {
    next(error);
  }
};

const deleteFiche = async (req, res, next) => {
  try {
    const { id } = req.params;

    const deletedFiche = await ficheModel.deleteFiche(id);

    if (!deletedFiche) {
      return res.status(404).json({ message: "Fiche non trouvée" });
    }

    res.status(200).json({ message: "Fiche supprimée avec succès" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllFiches,
  getFicheBySlug,
  createFiche,
  updateTitleFiche,
  updateDescriptionFiche,
  updateContentFiche,
  deleteFiche,
};