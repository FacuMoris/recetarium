const connection = require("../../db");

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

async function getById(id) {
  const query = `
    SELECT id, author_user_id, title, description
    FROM recipe
    WHERE id = ? 
    AND deleted_at IS NULL`;

  const [rows] = await connection.query(query, [id]);
  return rows[0] || null;
}

module.exports = {
  getAll,
  getById,
  create,
};
