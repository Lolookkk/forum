const db = require('../config/db');

//On récupère toutes les sous topic d'une sous-catégorie spécifique 
const getAllTopicsBySubcategory = async (subcategory_id) => {
  const query = 'SELECT * FROM topics WHERE subcategory_id = $1 ORDER BY created_at DESC;';
  const { rows } = await db.query(query, [subcategory_id]);
  return rows;
};

module.exports = {
  getAllTopicsBySubcategory,
};