const connection = require("../config/db");

async function create({
  author_user_id,
  title,
  description,
  difficulty,
  prep_time_min,
  cook_time_min,
  servings,
  visibility,
  status,
}) {
  const query = `
    INSERT INTO recipe (
    author_user_id,
    title,
    description,
    difficulty,
    prep_time_min,
    cook_time_min,
    servings,
    visibility,
   status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

  const [result] = await connection.query(query, [
    author_user_id,
    title,
    description || null,
    difficulty || "easy",
    prep_time_min || null,
    cook_time_min || null,
    servings || null,
    visibility || "public",
    status,
  ]);

  return result.insertId;
}

async function publishById(id) {
  const query = `
    UPDATE recipe
    SET status = 'published',
    updated_at = NOW()
    WHERE id = ?
    AND status = 'draft'
    AND deleted_at IS NULL
  `;

  const [result] = await connection.query(query, [id]);
  return result.affectedRows;
}

async function getPublicRecipes() {
  const query = `
  SELECT *
  FROM recipe 
  WHERE status = 'published'
  AND visibility = 'public'
  AND deleted_at IS NULL 
  ORDER BY created_at DESC
  `;

  const [rows] = await connection.query(query);
  return rows;
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
    SELECT id, author_user_id, title, description, difficulty, prep_time_min, cook_time_min, servings
    FROM recipe
    WHERE id = ? 
    AND deleted_at IS NULL`;

  const [rows] = await connection.query(query, [id]);
  return rows[0] || null;
}

async function getByUserId(userId) {
  const query = `
  SELECT *
  FROM recipe
  WHERE author_user_id = ? 
  AND deleted_at IS NULL 
  ORDER BY created_at DESC
  `;

  const [rows] = await connection.query(query, [userId]);
  return rows;
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
  getPublicRecipes,
  getAll,
  getById,
  create,
  findByIdAndUser,
  getByUserId,
  publishById,
  updateById,
  softDeleteById,
};
