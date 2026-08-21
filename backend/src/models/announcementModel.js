const db = require("../config/db"); 

const getAllAnnouncements = async () => {
  const query = `
  SELECT 
      a.id, 
      a.title, 
      a.content, 
      a.created_at, 
      COALESCE(u.username, 'Ancien membre') AS author_name 
    FROM announcements a
    LEFT JOIN users u ON a.author_id = u.id 
    ORDER BY a.created_at DESC
    `;
  const { rows } = await db.query(query);
  return rows; 
};

const createAnnouncement = async (title, content, authorId) => {
  const query =
    "INSERT INTO announcements (title, content, author_id) VALUES ($1, $2, $3) RETURNING *;";
  const { rows } = await db.query(query, [title, content, authorId]);
  return rows[0];
};


const deleteAnnouncement = async (id) => {
  const query = 'DELETE FROM announcements WHERE id = $1 RETURNING *;';
  const { rows } = await db.query(query, [id]);
  return rows[0];
};



module.exports = {
  getAllAnnouncements,
  createAnnouncement,
  deleteAnnouncement
};
