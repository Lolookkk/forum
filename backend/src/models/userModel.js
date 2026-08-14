const db = require('../config/db');

//On cherche un utilisateur par son email ou son username (pour vérifier si il existe déjà)
const findUserByEmailOrUsername = async (email, username) => {
    const query = 'SELECT * FROM users WHERE email = $1 OR username = $2;';
    const { rows } = await db.query(query, [email, username]);
    return rows[0]; // retourne undefined si pas d'utilisateur trouvé
};

//On cherche un utilisateur par son email 
const findUserByEmail = async (email) => {
    const query = 'SELECT * FROM users WHERE email = $1;';
    const { rows } = await db.query(query, [email]);
    return rows[0];
};

// On insère un nouvel utilisateur avec son password_hash
const createUser = async (email, username, password_hash) => {
  const query = 'INSERT INTO users (email, username, password_hash) VALUES ($1, $2, $3) RETURNING *;';
  const { rows } = await db.query(query, [email, username, password_hash]);
  return rows[0];
};

module.exports = {
    findUserByEmailOrUsername,
    createUser,
    findUserByEmail
};