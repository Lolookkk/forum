const db = require("../config/db");

const getTwentyMostRecentTopics = async () => {
  const query = `
    SELECT 
      t.*,
      u.username AS author, 
      s.title AS subcategory 
    FROM topics t
    LEFT JOIN users u ON t.user_id = u.id
    LEFT JOIN subcategories s ON t.subcategory_id = s.id
    ORDER BY t.created_at DESC 
    LIMIT 20;
  `;
  const { rows } = await db.query(query);
  return rows;
};

//On récupère toutes les sous topic d'une sous-catégorie spécifique
const getAllTopicsBySubcategory = async (subcategory_id) => {
  const query =
    "SELECT * FROM topics WHERE subcategory_id = $1 ORDER BY created_at DESC;";
  const { rows } = await db.query(query, [subcategory_id]);
  return rows;
};

const createTopic = async (subcategory_id, user_id, title, content) => {
  const query =
    "INSERT INTO topics (subcategory_id, user_id, title, content, is_pinned) VALUES ($1, $2, $3, $4, FALSE) RETURNING *;";
  const { rows } = await db.query(query, [
    subcategory_id,
    user_id,
    title,
    content,
  ]);
  return rows[0];
};

const moveTopic = async (topicId, newSubcategory_id) => {
  const query = "UPDATE topics SET subcategory_id = $1 WHERE id = $2 RETURNING *;";
  const { rows } = await db.query(query, [newSubcategory_id, topicId]);
  return rows[0];
};

module.exports = {
  getAllTopicsBySubcategory,
  createTopic,
  moveTopic,
  getTwentyMostRecentTopics,
};
