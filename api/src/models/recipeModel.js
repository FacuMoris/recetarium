const connection = require("../config/db");

async function create(recipe) {
  const query = `
    INSERT INTO recipe (
    author_user_id,
    title,
    description,
    created_at,
    updated_at)
    VALUES (?, ?, ?, NOW(), NOW())
    `;

  const [result] = await connection.query(query, [
    recipe.author_user_id,
    recipe.title,
    recipe.description,
  ]);

  return result.insertId;
}

async function getAll() {
  {
    const query = `
        SELECT id, author_user_id, title, description
        FROM recipe
        WHERE deleted_at IS NULL`;

    const [rows] = await connection.query(query);
    return rows;
  }
}

async function getById(id) {
  const query = `
    SELECT id, author_user_id, title, description
    FROM recipe
    WHERE id = ? 
    AND deleted_at IS NULL`;

  const [rows] = await connection.query(query, [id]);
  return rows[0] || null;
}

async function findByIdAndUser(id, userId) {
  const query = `
  SELECT *
  FROM recipe 
  WHERE id = ?
  AND author_user_id = ?
  AND deleted_at IS NULL 
  LIMIT 1 
  `;
  const [rows] = await connection.query(query, [id, userId]);
  return rows[0] || null;
}

async function updateById(id, data) {
  const query = `
    UPDATE recipe
    SET title = ?,
    description = ?,
    updated_at = NOW()
    WHERE id = ?
    AND deleted_at IS NULL
    `;

  const [result] = await connection.query(query, [
    data.title,
    data.description,
    id,
  ]);

  return result.affectedRows;
}

async function softDeleteById(id) {
  const query = `
    UPDATE recipe
    SET updated_at = NOW(),
    deleted_at = NOW()
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
  findByIdAndUser,
  updateById,
  softDeleteById,
};
