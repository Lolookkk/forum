const db = require("../config/db");

const getSettings = async () => {
  const result = await db.query("SELECT * FROM settings WHERE id = 1");
  return result.rows[0];
};

const updateSettings = async ({ forum_name, maintenance_mode, topics_per_page, registration_open }) => {
  const query = `
    UPDATE settings 
    SET forum_name = $1, maintenance_mode = $2, topics_per_page = $3, registration_open = $4
    WHERE id = 1
    RETURNING *;
  `;
  const values = [forum_name, maintenance_mode, topics_per_page, registration_open];
  const result = await db.query(query, values);
  return result.rows[0];
};

module.exports = { 
    getSettings, 
    updateSettings 
};