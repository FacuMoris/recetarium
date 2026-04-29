const connection = require("../config/db");

async function getAll() {
  const query = `
    SELECT id, name, description
    FROM ingredient
    WHERE deleted_at IS NULL
    ORDER BY name ASC
  `;

  const [rows] = await connection.query(query);
  return rows;
}

async function create({ name, description }) {
  const query = `
    INSERT INTO ingredient (name, description)
    VALUES (?, ?)
  `;

  const [result] = await connection.query(query, [name, description || null]);

  return result.insertId;
}

async function softDeleteById(id) {
  const query = `
    UPDATE ingredient
    SET deleted_at = NOW(),
        updated_at = NOW()
    WHERE id = ?
    AND deleted_at IS NULL
  `;

  const [result] = await connection.query(query, [id]);
  return result.affectedRows;
}

module.exports = {
  getAll,
  create,
  softDeleteById,
};
