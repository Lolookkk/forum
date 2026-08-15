const db = require("../config/db");

//On récupère toutes les posts d'un topic spécifique
const getAllPostsByTopic = async (topic_id) => {
  const query =
    "SELECT * FROM posts WHERE topic_id = $1 ORDER BY created_at ASC;";
  const { rows } = await db.query(query, [topic_id]);
  return rows;
};

const createPost = async (topic_id, user_id, content) => {
  const query =
    "INSERT INTO posts (topic_id, user_id, content) VALUES ($1, $2, $3) RETURNING *;";
  const { rows } = await db.query(query, [topic_id, user_id, content]);
  return rows[0];
};

module.exports = {
  getAllPostsByTopic,
  createPost,
};
