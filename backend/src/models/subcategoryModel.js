const db = require("../config/db");

//On récupère TOUTES les sous catégories
const getAllSubcategories = async () => {
  const query = "SELECT * FROM subcategories ORDER BY display_order ASC;";
  const { rows } = await db.query(query);
  return rows;
};

//On récupère toutes les sous catégories d'une catégorie spécifique
const getAllSubcategoriesByCategory = async (category_id) => {
  const query =
    "SELECT * FROM subcategories WHERE category_id = $1 ORDER BY display_order ASC;";
  const { rows } = await db.query(query, [category_id]);
  return rows;
};

const createSubCategory = async (category_id, title, description) => {
  const query = `
    INSERT INTO subcategories (category_id, title, description) 
    VALUES ($1, $2, $3) 
    RETURNING *;
  `;
  const { rows } = await db.query(query, [category_id, title, description]);
  return rows[0];
};

const updateSubCategory = async (id, { category_id, title, description }) => {
  const query = `
    UPDATE subcategories 
    SET 
      category_id = COALESCE($1, category_id),
      title = COALESCE($2, title),
      description = COALESCE($3, description)
    WHERE id = $4
    RETURNING *;
  `;
  const { rows } = await db.query(query, [
    category_id || null,
    title || null,
    description || null,
    id,
  ]);
  return rows[0];
};

const deleteSubCategory = async (id) => {
  const query = "DELETE FROM subcategories WHERE id = $1 RETURNING *;";
  const { rows } = await db.query(query, [id]);
  return rows[0];
};

const reorderSubCategories = async (subcategories) => {
  const ids = subcategories.map((sc) => sc.id);
  const orders = subcategories.map((sc) => sc.display_order);

  const query = `
    UPDATE subcategories AS sc
    SET display_order = u.display_order
    FROM UNNEST($1::int[], $2::int[]) AS u(id, display_order)
    WHERE sc.id = u.id
    RETURNING sc.*;
  `;

  const { rows } = await db.query(query, [ids, orders]);
  return rows;
};

module.exports = {
  getAllSubcategories,
  getAllSubcategoriesByCategory,
  createSubCategory,
  updateSubCategory,
  deleteSubCategory,
  reorderSubCategories,
};
