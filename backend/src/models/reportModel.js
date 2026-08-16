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

module.exports = {
  createTopicReport,
  createPostReport,
  getPendingReports
};
