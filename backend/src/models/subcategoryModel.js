const db = require('../config/db');

//On récupère TOUTES les sous catégories
const getAllSubcategories = async () => {
  const query = 'SELECT * FROM subcategories ORDER BY display_order ASC;';
  const { rows } = await db.query(query);
  return rows;
};

//On récupère toutes les sous catégories d'une catégorie spécifique 
const getAllSubcategoriesByCategory = async (category_id) => {
  const query = 'SELECT * FROM subcategories WHERE category_id = $1 ORDER BY display_order ASC;';
  const { rows } = await db.query(query, [category_id]);
  return rows;
};

module.exports = {
  getAllSubcategories,
  getAllSubcategoriesByCategory,
};