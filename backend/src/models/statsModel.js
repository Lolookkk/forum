const db = require("../config/db");

// Récupérer les métriques clés (chiffres globaux)
const getGlobalStats = async () => {
  const query = `
    SELECT 
      (SELECT COUNT(*) FROM users) AS total_users,
      (SELECT COUNT(*) FROM topics) AS total_topics,
      (SELECT COUNT(*) FROM posts) AS total_posts,
      (SELECT maintenance_mode FROM settings WHERE id = 1) AS maintenance_mode;
  `;
  const { rows } = await db.query(query);
  return rows[0];
};

module.exports = {
  getGlobalStats,
};