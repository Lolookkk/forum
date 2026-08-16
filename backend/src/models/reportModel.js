const db = require("../config/db");

const createTopicReport = async (reporterId, topicId, reason) => {
  const query =
    "INSERT INTO reports (reporter_id, topic_id, reason) VALUES ($1, $2, $3) RETURNING *;";
  const { rows } = await db.query(query, [reporterId, topicId, reason]);
  return rows[0];
};

const createPostReport = async (reporterId, postId, reason) => {
  const query =
    "INSERT INTO reports (reporter_id, post_id, reason) VALUES ($1, $2, $3) RETURNING *;";
  const { rows } = await db.query(query, [reporterId, postId, reason]);
  return rows[0];
};

const getPendingReports = async () => {
  const query = `
    SELECT 
      r.id AS report_id,
      r.reason,
      r.created_at,
      r.topic_id,
      r.post_id,
      u.username AS reporter_username,
      COALESCE(t.content, p.content) AS reported_content,
      -- Compte le nombre total de signalements non résolus pour cet élément
      COUNT(*) OVER(PARTITION BY COALESCE(r.topic_id, r.post_id))::INT AS report_count
    FROM reports r
    JOIN users u ON r.reporter_id = u.id
    LEFT JOIN topics t ON r.topic_id = t.id
    LEFT JOIN posts p ON r.post_id = p.id
    WHERE r.is_resolved = false
    ORDER BY report_count DESC, r.created_at ASC;
  `;

  const { rows } = await db.query(query);
  return rows;
};

// Récupérer un signalement par son ID
const getReportById = async (reportId) => {
  const query = 'SELECT * FROM reports WHERE id = $1;';
  const { rows } = await db.query(query, [reportId]);
  return rows[0];
};

// Marquer un signalement comme traité
const resolveReport = async (reportId, moderatorId) => {
  const query = `
    UPDATE reports
    SET is_resolved = true, moderator_id = $1
    WHERE id = $2
    RETURNING *;
  `;
  const { rows } = await db.query(query, [moderatorId, reportId]);
  return rows[0];
};

// Censurer un post
const censorPost = async (postId, newContent) => {
  const query = 'UPDATE posts SET content = $1 WHERE id = $2 RETURNING *;';
  const { rows } = await db.query(query, [newContent, postId]);
  return rows[0];
};

// Censurer un topic (titre et/ou contenu)
const censorTopic = async (topicId, newTitle, newContent) => {
  const query = `
    UPDATE topics
    SET title = COALESCE($1, title), content = COALESCE($2, content)
    WHERE id = $3
    RETURNING *;
  `;
  const { rows } = await db.query(query, [newTitle, newContent, topicId]);
  return rows[0];
};

// Supprimer un post
const deletePost = async (postId) => {
  const query = 'DELETE FROM posts WHERE id = $1 RETURNING *;';
  const { rows } = await db.query(query, [postId]);
  return rows[0];
};

// Supprimer un topic
const deleteTopic = async (topicId) => {
  const query = 'DELETE FROM topics WHERE id = $1 RETURNING *;';
  const { rows } = await db.query(query, [topicId]);
  return rows[0];
};

module.exports = {
  createTopicReport,
  createPostReport,
  getPendingReports,
  getReportById,
  resolveReport,
  censorPost,
  censorTopic,
  deletePost,
  deleteTopic
};
