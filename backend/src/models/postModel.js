const db = require("../config/db");

//On récupère toutes les posts d'un topic spécifique
const getAllPostsByTopic = async (topic_id) => {
  const query =
    "SELECT * FROM posts WHERE topic_id = $1 ORDER BY created_at ASC;";
  const { rows } = await db.query(query, [topic_id]);
  return rows;
};

const getPostById = async (id) => {
  //const query = "SELECT * FROM posts WHERE id = $1;";
  const query = `
    SELECT 
      p.*,
      u.username AS author
    FROM posts p
    LEFT JOIN users u ON p.user_id = u.id
    WHERE p.id = $1;
  `;
  const { rows } = await db.query(query, [id]);
  return rows[0];
}

const getAllPostsWithAuthorByTopic = async (id) => {
  const query = `
    SELECT p.*, u.username AS author 
    FROM posts p 
    LEFT JOIN users u ON p.user_id = u.id 
    WHERE p.topic_id = $1 
    ORDER BY p.created_at ASC;
  `;
  const { rows } = await db.query(query, [id]); 
  return rows;
};

const createPost = async (topic_id, user_id, content) => {
  const query =
    "INSERT INTO posts (topic_id, user_id, content) VALUES ($1, $2, $3) RETURNING *;";
  const { rows } = await db.query(query, [topic_id, user_id, content]);
  return rows[0];
};

const updateUserPost = async (postId, userId, newContent) => {
  const query = `
    UPDATE posts
    SET content = $1, updated_at = CURRENT_TIMESTAMP
    WHERE id = $2 AND user_id = $3
      AND created_at >= CURRENT_TIMESTAMP - INTERVAL '15 minutes'
    RETURNING *;
  `;
  const { rows } = await db.query(query, [newContent, postId, userId]);
  return rows[0];
};

const getPostWithEditWindow = async (postId) => {
  const query = `
    SELECT
      p.*,
      (p.created_at >= CURRENT_TIMESTAMP - INTERVAL '15 minutes') AS is_within_edit_window
    FROM posts p
    WHERE p.id = $1;
  `;
  const { rows } = await db.query(query, [postId]);
  return rows[0];
};

const addLike = async (postId, userId) => {
  const query = `
    INSERT INTO post_likes (post_id, user_id) 
    VALUES ($1, $2) 
    ON CONFLICT (user_id, post_id) DO NOTHING 
    RETURNING *;
  `;
  const { rows } = await db.query(query, [postId, userId]);
  return rows[0];
};

const removeLike = async (postId, userId) => {
  const query = `
    DELETE FROM post_likes 
    WHERE post_id = $1 AND user_id = $2 
    RETURNING *;
  `;
  const { rows } = await db.query(query, [postId, userId]);
  return rows[0];
};

module.exports = {
  getAllPostsByTopic,
  createPost,
  updateUserPost,
  addLike,
  removeLike,
  getAllPostsWithAuthorByTopic,
  getPostById,
  getPostWithEditWindow
};
