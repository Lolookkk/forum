const db = require('../config/db'); // Ton fichier de connexion PostgreSQL/Supabase

const getAllCategories = async () => {
  const query = 'SELECT * FROM categories ORDER BY display_order ASC;';
  const { rows } = await db.query(query);
  return rows; //tableau d'objets javascript
};

module.exports = {
  getAllCategories,
};