const db = require("../config/db");

//Numbers

const getNumberById = async (id) => {
  const query = `
    SELECT n.*, c.name AS category_name
    FROM useful_numbers n
    JOIN useful_number_categories c ON n.category_id = c.id
    WHERE n.id = $1
  `;
  const { rows } = await db.query(query, [id]);
  return rows[0] || null;
};


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

const createNumber = async (data) => {
  const { category_id, name, number, description, badge, urgent, chat, url } = data;
  const query = `
    INSERT INTO useful_numbers (
      category_id, 
      name, 
      number, 
      description, 
      badge, 
      urgent, 
      chat, 
      url
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING *;
  `;

  const values = [
    category_id,
    name,
    number,
    description || null,
    badge || "24/7 • Gratuit",
    urgent || false,
    chat || null,
    url || null,
  ];

  const { rows } = await db.query(query, values);
  return rows[0];
};


const updateNumber = async (id, data) => {
  const { category_id, name, number, description, badge, urgent, chat, url } = data;

  const query = `
    UPDATE useful_numbers
    SET 
      category_id = $1,
      name = $2,
      number = $3,
      description = $4,
      badge = $5,
      urgent = $6,
      chat = $7,
      url = $8
    WHERE id = $9
    RETURNING *;
  `;

  const values = [
    category_id,
    name,
    number,
    description || null,
    badge || null,
    urgent || false,
    chat || null,
    url || null,
    id,
  ];

  const { rows } = await db.query(query, values);
  return rows[0] || null;
};

const deleteNumber = async (id) => {
  const query = `
    DELETE FROM useful_numbers
    WHERE id = $1
    RETURNING id;
  `;
  const { rows } = await db.query(query, [id]);
  return rows[0] || null;
};

// NumberCategories

const findAllNumberCategories = async () => {
  const query = `
    SELECT id, name
    FROM useful_number_categories
    ORDER BY id ASC;
  `;
  const { rows } = await db.query(query);
  return rows;
};

const createNumberCategory = async (name) => {
  const query =
    "INSERT INTO useful_number_categories (name) VALUES ($1) RETURNING *;";
  const { rows } = await db.query(query, [name]);
  return rows[0];
};

const updateNumberCategory = async (numberCatId, newName) => {
  const query =
    "UPDATE useful_number_categories SET name = $1 WHERE id = $2 RETURNING *;";
  const { rows } = await db.query(query, [newName, numberCatId]);
  return rows[0];
};

const deleteNumberCategory = async (id) => {
  const query = 'DELETE FROM useful_number_categories WHERE id = $1 RETURNING *;';
  const { rows } = await db.query(query, [id]);
  return rows[0];
};


module.exports = {
    getAllNumbers,
    createNumber,
    updateNumber,
    deleteNumber,
    findAllNumberCategories,
    createNumberCategory,
    updateNumberCategory,
    deleteNumberCategory,
    getNumberById,
};