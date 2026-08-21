
const announcementModel = require("../models/announcementModel");

const getAllAnnouncements = async (req, res, next) => {
  try {
    const announcements = await announcementModel.getAllAnnouncements();
    res.status(200).json({
      success: true,
      data: announcements,
    });
  } catch (error) {
    next(error); 
  }
};

const createAnnouncement = async (req, res, next) => {
  try {
    const { title, content } = req.body;

    const user_id = req.user.id;

    if (!title || !content) {
      return res.status(400).json({ message: "Tous les champs sont requis" });
    }
    const newAnnouncement = await announcementModel.createAnnouncement(title, content, user_id);
    res.status(201).json({ message: "Annonce créée avec succès", announcement: newAnnouncement });
  } catch (error) {
    next(error);
  }
};

const deleteAnnouncement = async (req,res,next) => {
  try {
    const {id} = req.params;

    const deleteAnnouncement = await announcementModel.deleteAnnouncement(id);
    if (!deleteAnnouncement) {
      return res.status(404).json({ message: "Aucune annonce à retirer" });
    }
    res.status(200).json({ message: "Annonce retirée avec succès"});
  } catch (error) {
    console.error("❌ deleteAnnouncement error:", error);
    next(error);
    }
}

module.exports = {
  getAllAnnouncements,
  createAnnouncement,
  deleteAnnouncement
};
