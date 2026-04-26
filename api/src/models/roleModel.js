const connection = require("../config/db");

async function findByName(name) {
  const query = `
    SELECT id, name
    FROM role
    WHERE name = ?
    LIMIT 1
    `;

  const [rows] = await connection.query(query, [name]);
  return rows[0] || null;
}

module.exports = { findByName };
