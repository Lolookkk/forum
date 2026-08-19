const db = require("../config/db"); // Ton fichier de connexion PostgreSQL/Supabase

const getAllCategories = async () => {
  const query = "SELECT * FROM categories ORDER BY display_order ASC;";
  const { rows } = await db.query(query);
  return rows; //tableau d'objets javascript
};

const getCategoryBySlug = async (slug) => {
  const query = "SELECT * FROM categories WHERE slug = $1;";
  const { rows } = await db.query(query, [slug]);
  return rows[0];
};

const createCategory = async (name, description) => {
  const query =
    "INSERT INTO categories (name, description) VALUES ($1, $2) RETURNING *;";
  const { rows } = await db.query(query, [name, description]);
  return rows[0];
};

const updateCategory = async (id, { name, description }) => {
  const query = `
    UPDATE categories 
    SET 
      name = COALESCE($1, name),
      description = COALESCE($2, description)
    WHERE id = $3
    RETURNING *;
  `;
  
  // Si le champ n'est pas transmis, on passe `null` pour que COALESCE conserve la valeur existante
  const { rows } = await db.query(query, [name || null, description || null, id]);
  return rows[0];
};

const deleteCategory = async (id) => {
  const query = 'DELETE FROM categories WHERE id = $1 RETURNING *;';
  const { rows } = await db.query(query, [id]);
  return rows[0];
};

// Reçoit un tableau : [{ id: 1, display_order: 1 }, { id: 2, display_order: 2 }]
const reorderCategories = async (categories) => {
  const ids = categories.map((c) => c.id);
  const orders = categories.map((c) => c.display_order);

  const query = `
    UPDATE categories AS c
    SET display_order = u.display_order
    FROM UNNEST($1::int[], $2::int[]) AS u(id, display_order)
    WHERE c.id = u.id
    RETURNING c.*;
  `;

  const { rows } = await db.query(query, [ids, orders]);
  return rows;
};


module.exports = {
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  reorderCategories,
  getCategoryBySlug
};
