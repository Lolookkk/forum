const reportModel = require("../models/reportModel");

const reportTopic = async (req, res, next) => {
  try {
    const { id } = req.params; //id du topic
    const { reason } = req.body;
    const reporterId = req.user?.id || req.user?.userId;

    if (!reason || reason.trim() === '') {
      return res.status(400).json({ message: "Le motif du signalement est obligatoire" });
    }
    const report = await reportModel.createTopicReport(reporterId, id, reason);
    res.status(201).json({
      message: "Sujet signalé avec succès à l'équipe de modération",
      report,
    });
  } catch (error) {
    next(error);
    console.error("❌ reportTopic error:", error);
  }
};

const reportPost = async (req, res, next) => {
  try {
    const { id } = req.params; // ID du post
    const { reason } = req.body;
    const reporterId = req.user?.id || req.user?.userId;

    if (!reason || reason.trim() === '') {
      return res.status(400).json({ message: "Le motif du signalement est obligatoire" });
    }

    const report = await reportModel.createPostReport(reporterId, id, reason);

    res.status(201).json({
      message: "Message signalé avec succès à l'équipe de modération",
      report,
    });
  } catch (error) {
    next(error);
    console.error("❌ reportPost error:", error);
  }
};

module.exports = {
  reportTopic,
  reportPost,
};