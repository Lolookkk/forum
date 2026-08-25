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

const updateTitleFiche = async (ficheId, newTitle) => {
  const query =
    "UPDATE fiches SET title = $1 WHERE id = $2 RETURNING *;";
  const { rows } = await db.query(query, [newTitle, ficheId]);
  return rows[0];
};

const updateDescriptionFiche = async (ficheId, newDescription) => {
  const query =
    "UPDATE fiches SET description = $1 WHERE id = $2 RETURNING *;";
  const { rows } = await db.query(query, [newDescription, ficheId]);
  return rows[0];
};

const updateContentFiche = async (ficheId, newContent) => {
  const query =
    "UPDATE fiches SET content = $1 WHERE id = $2 RETURNING *;";
  const { rows } = await db.query(query, [newContent, ficheId]);
  return rows[0];
};

const deleteFiche = async (id) => {
  const query = 'DELETE FROM fiches WHERE id = $1 RETURNING *;';
  const { rows } = await db.query(query, [id]);
  return rows[0];
};

const createFiche = async (title, slug, description, icon, icon_color, content) => {
  const query =
    "INSERT INTO fiches (title, slug, description, icon, icon_color, content) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;";
  const { rows } = await db.query(query, [title, slug, description, icon, icon_color, content]);
  return rows[0];
};

module.exports = {
  getAllFiches,
  getFicheBySlug,
  updateTitleFiche,
  updateDescriptionFiche,
  updateContentFiche,
  deleteFiche,
  createFiche
};
