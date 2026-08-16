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

module.exports = {
  createTopicReport,
  createPostReport
};
