const { getGlobalStats, getRecentTopics } = require("../models/statsModel");

const getDashboardStats = async (req, res, next) => {
  try {
    const stats = await getGlobalStats();

    res.json({
      success: true,
      data: stats,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Erreur lors du chargement des statistiques." });
    next(err);
  }
};

module.exports = { getDashboardStats };