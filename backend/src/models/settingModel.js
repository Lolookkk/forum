const db = require("../config/db");

const getSettings = async () => {
  const result = await db.query("SELECT * FROM settings WHERE id = 1");
  return result.rows[0];
};

const getPresentation = async () => {
  const result = await db.query("SELECT presentation FROM settings WHERE id = 1");
  return result.rows[0]?.presentation ?? "";
}

const updatePresentation = async (presentation) => {
  const result = await db.query(
    "UPDATE settings SET presentation = $1 WHERE id = 1 RETURNING presentation",
    [presentation ?? ""]
  );
  return result.rows[0]?.presentation ?? "";
}

const getCharter = async () => {
  const result = await db.query("SELECT charter FROM settings WHERE id = 1");
  return result.rows[0]?.charter ?? "";
}

const updateCharter = async (charter) => {
  const result = await db.query(
    "UPDATE settings SET charter = $1 WHERE id = 1 RETURNING charter",
    [charter ?? ""]
  );
  return result.rows[0]?.charter ?? "";
}

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
    getPresentation,
    updatePresentation,
    getCharter,
    updateCharter,
    updateSettings 
};