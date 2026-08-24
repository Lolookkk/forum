const db = require("../config/db");

const getAllFiches = async () => {
  const query = "SELECT * FROM fiches;";
  const { rows } = await db.query(query);
  return rows; 
};

const getFicheBySlug = async (slug) => {
  const query = "SELECT * FROM fiches WHERE slug = $1;";
  const { rows } = await db.query(query, [slug]);
  return rows[0];
};

module.exports = {
  getAllFiches,
  getFicheBySlug
};
