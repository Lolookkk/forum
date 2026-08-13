const db = require('../config/db');

//On récupère toutes les posts d'un topic spécifique 
const getAllPostsByTopic = async (topic_id) => {
  const query = 'SELECT * FROM posts WHERE topic_id = $1 ORDER BY created_at ASC;';
  const { rows } = await db.query(query, [topic_id]);
  return rows;
};

module.exports = {
  getAllPostsByTopic,
};