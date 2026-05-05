const connection = require("../config/db");

async function getAll() {
  const query = `
    SELECT id, name, abbreviation
    FROM unit 
    ORDER BY name ASC
    `;

  const [rows] = await connection.query(query);
  return rows;
}

async function getById(id) {
  const query = `
    SELECT id, name, abbreviation 
    FROM unit 
    WHERE id = ? 
    LIMIT 1 
    `;

  const [rows] = await connection.query(query, [id]);
  return rows[0] || null;
}

module.exports = {
  getAll,
  getById,
};
