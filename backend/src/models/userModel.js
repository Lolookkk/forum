const db = require("../config/db");

const getAllUsers = async () => {
  const query = "SELECT * FROM users ORDER BY username ASC;";
  const { rows } = await db.query(query);
  return rows; 
};
//On cherche un utilisateur par son email ou son username (pour vérifier si il existe déjà)
const findUserByEmailOrUsername = async (email, username) => {
  const query = "SELECT * FROM users WHERE email = $1 OR username = $2;";
  const { rows } = await db.query(query, [email, username]);
  return rows[0]; // retourne undefined si pas d'utilisateur trouvé
};

const getAllActivityOfUser = async (username) => {
  const query = `
    SELECT * FROM (
      -- 1. Les sujets (topics) créés par l'utilisateur
      SELECT 
        'topic' AS type,
        t.id AS activity_id,
        t.title AS topic_title,
        t.slug AS topic_slug,
        t.content AS content,
        t.created_at AS created_at,
        s.id AS subcategory_id,
        s.slug AS subcategory_slug,
        s.title AS subcategory_title
      FROM topics t
      JOIN users u ON t.user_id = u.id
      JOIN subcategories s ON t.subcategory_id = s.id
      WHERE u.username = $1 AND t.status = 'publie'

      UNION ALL

      -- 2. Les messages (posts) publiés par l'utilisateur
      SELECT 
        'post' AS type,
        p.id AS activity_id,
        t.title AS topic_title,
        t.slug AS topic_slug,
        p.content AS content,
        p.created_at AS created_at,
        s.id AS subcategory_id,
        s.slug AS subcategory_slug,
        s.title AS subcategory_title
      FROM posts p
      JOIN users u ON p.user_id = u.id
      JOIN topics t ON p.topic_id = t.id
      JOIN subcategories s ON t.subcategory_id = s.id
      WHERE u.username = $1 AND p.status = 'publie'
    ) combined_activity
    ORDER BY created_at DESC;
  `;

  const { rows } = await db.query(query, [username]);
  return rows;
};


const displayPublicProfilUser = async (username) => {
  const query = `
    SELECT 
      u.username, 
      u.role, 
      u.description, 
      u.created_at,
      (SELECT COUNT(*) FROM topics WHERE user_id = u.id) AS topics_count,
      (SELECT COUNT(*) FROM posts WHERE user_id = u.id) AS posts_count
    FROM users u
    WHERE u.username = $1;
  `;

  const { rows } = await db.query(query, [username]);
  return rows[0]; // retourne undefined si l'utilisateur n'existe pas
};

//On cherche un utilisateur par son email
const findUserByEmail = async (email) => {
  const query = "SELECT * FROM users WHERE email = $1;";
  const { rows } = await db.query(query, [email]);
  return rows[0];
};

// On insère un nouvel utilisateur avec son password_hash
const createUser = async (email, username, password_hash) => {
  const query =
    "INSERT INTO users (email, username, password_hash) VALUES ($1, $2, $3) RETURNING *;";
  const { rows } = await db.query(query, [email, username, password_hash]);
  return rows[0];
};

const updateUserEmail = async (userId, newEmail) => {
  const query =
    "UPDATE users SET email = $1 WHERE id = $2 RETURNING id, username, email, role;";
  const { rows } = await db.query(query, [newEmail, userId]);
  return rows[0];
};

const updateUserUsername = async (userId, newUsername) => {
  const query =
    "UPDATE users SET username = $1 WHERE id = $2 RETURNING id, username, email, role;";
  const { rows } = await db.query(query, [newUsername, userId]);
  return rows[0];
};

const updateUserPassword = async (userId, newPasswordHash) => {
  const result = await db.query(
    "UPDATE users SET password_hash = $1 WHERE id = $2 RETURNING id, username, email, role;",
    [newPasswordHash, userId],
  );
  return result.rows[0];
};

const findUserById = async (userId) => {
  const query = "SELECT * FROM users WHERE id = $1;";
  const { rows } = await db.query(query, [userId]);
  return rows[0];
};

const updateUserRole = async (userId, newRole) => {
  const query =
    "UPDATE users SET role = $1 WHERE id = $2 RETURNING id, username, email, role;";
  const { rows } = await db.query(query, [newRole, userId]);
  return rows[0];
};

const setBanStatus = async (userId, isBanned) => {
  const query =
    "UPDATE users SET is_banned = $1 WHERE id = $2 RETURNING id, username, email, is_banned;";
  const { rows } = await db.query(query, [isBanned, userId]);
  return rows[0];
};

const deleteUser = async (id) => {
  const query = 'DELETE FROM users WHERE id = $1 RETURNING *;';
  const { rows } = await db.query(query, [id]);
  return rows[0];
};


module.exports = {
  findUserByEmailOrUsername,
  createUser,
  findUserByEmail,
  updateUserEmail,
  updateUserUsername,
  updateUserPassword,
  findUserById,
  updateUserRole,
  setBanStatus,
  getAllUsers,
  displayPublicProfilUser,
  getAllActivityOfUser,
  deleteUser
};
