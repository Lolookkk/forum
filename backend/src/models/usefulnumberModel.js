const db = require("../config/db");



const getAllNumbers = async () => {
  const query = `
  SELECT n.*, 
  c.name AS category_name
  FROM useful_numbers n
  JOIN useful_number_categories c ON n.category_id = c.id
  ORDER BY c.position ASC, n.id ASC
`;
  const { rows } = await db.query(query);
  return rows; 
};

module.exports = {
    getAllNumbers
};