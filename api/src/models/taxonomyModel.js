const connection = require("../config/db");

async function getAll({ type } = {}) {
  let query = `
    SELECT id, type, name, slug, description, created_at, updated_at
    FROM taxonomy 
    WHERE deleted_at IS NULL
    `;

  const params = [];

  if (type) {
    query += `AND type = ?`;
    params.push(type);
  }

  query += `ORDER BY type ASC, name ASC`;

  const [rows] = await connection.query(query, params);
  return rows;
}

async function getById(id) {
  const query = `
    SELECT id, type, name, slug, description, created_at, updated_at 
    FROM taxonomy 
    WHERE id = ? 
    AND deleted_at IS NULL 
    LIMIT 1 
    `;

  const [rows] = await connection.query(query, [id]);
  return rows[0] || null;
}

async function create({ type, name, slug, description }) {
  const query = `
    INSERT INTO taxonomy (type, name, slug, description)
    VALUES (?, ?, ?, ?)
    `;

  const [result] = await connection.query(query, [
    type,
    name,
    slug,
    description ?? null,
  ]);

  return result.insertId;
}

async function softDeleteById(id) {
  const query = `
    UPDATE taxonomy 
    SET deleted_at = NOW() 
    WHERE id = ? 
    AND deleted_at IS NULL 
    `;

  const [result] = await connection.query(query, [id]);

  return result.affectedRows;
}

module.exports = {
  getAll,
  getById,
  create,
  softDeleteById,
};
