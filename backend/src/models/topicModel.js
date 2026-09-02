const db = require("../config/db");
const slugify = require("slugify");

const buildTopicSlug = (title, suffix) =>
  `${slugify(title, { lower: true, strict: true, locale: "fr" })}-${suffix}`;

const getTwentyMostRecentTopics = async () => {
  const query = `
    SELECT 
      t.*,
      u.username AS author, 
      s.title AS subcategory,
      s.slug AS subcategory_slug,
      c.slug AS category_slug
    FROM topics t
    LEFT JOIN users u ON t.user_id = u.id
    JOIN subcategories s ON t.subcategory_id = s.id
    JOIN categories c ON s.category_id = c.id
    ORDER BY t.created_at DESC 
    LIMIT 20;
  `;
  const { rows } = await db.query(query);
  return rows;
};


const getTopicInformationById = async (id) => {
  const query = `
    SELECT 
      t.*,
      u.username AS author,
      s.slug AS subcategory_slug,
      c.slug AS category_slug,
      (
        t.created_at >= CURRENT_TIMESTAMP - INTERVAL '15 minutes'
      ) AS is_within_edit_window,
      EXISTS (
        SELECT 1
        FROM posts p
        WHERE p.topic_id = t.id
      ) AS has_replies
    FROM topics t
    LEFT JOIN users u ON t.user_id = u.id
    JOIN subcategories s ON t.subcategory_id = s.id
    JOIN categories c ON s.category_id = c.id
    WHERE t.id = $1;
  `;
  const { rows } = await db.query(query, [id]); // On passe [id] ici
  return rows[0];
};

const getTopicBySlug = async (slug) => {
  const query = "SELECT * FROM topics WHERE slug = $1;";
  const { rows } = await db.query(query, [slug]);
  return rows[0];
};

//On récupère toutes les sous topic d'une sous-catégorie spécifique
const getAllTopicsBySubcategory = async (subcategory_id) => {
  const query =
    "SELECT * FROM topics WHERE subcategory_id = $1 ORDER BY created_at DESC;";
  const { rows } = await db.query(query, [subcategory_id]);
  return rows;
};

const createTopic = async (subcategory_id, user_id, title, content) => {
  const slug = buildTopicSlug(title, Date.now().toString(36));
  const query =
    "INSERT INTO topics (subcategory_id, user_id, title, slug, content, is_pinned) VALUES ($1, $2, $3, $4, $5, FALSE) RETURNING *;";
  const { rows } = await db.query(query, [
    subcategory_id,
    user_id,
    title,
    slug,
    content,
  ]);
  return rows[0];
};

const updateOwnTopic = async (topicId, userId, title, content) => {
  const slug = buildTopicSlug(title, topicId);
  const query = `
    UPDATE topics
    SET
      title = $1,
      slug = $2,
      content = $3,
      updated_at = CURRENT_TIMESTAMP
    WHERE id = $4 AND user_id = $5
    RETURNING *;
  `;
  const { rows } = await db.query(query, [title, slug, content, topicId, userId]);
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
  updateOwnTopic,
  moveTopic,
  getTwentyMostRecentTopics,
  getTopicInformationById,
  getTopicBySlug,
};
