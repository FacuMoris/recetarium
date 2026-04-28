const connection = require("../config/db");

async function create({ ownerUserId, name, description, visibility }) {
  const query = `
    INSERT INTO collection (owner_user_id, name, description, visibility)
    VALUES (?,?,?,?)
    `;

  const [result] = await connection.query(query, [
    ownerUserId,
    name,
    description || null,
    visibility || "private",
  ]);

  return result.insertId;
}

async function getByUserId(userId) {
  const query = `
    SELECT * 
    FROM collection 
    WHERE owner_user_id = ? 
    AND deleted_at IS NULL 
    ORDER BY created_at DESC
    `;

  const [rows] = await connection.query(query, [userId]);
  return rows;
}

async function findByIdAndUser(id, userId) {
  const query = `
    SELECT * 
    FROM collection
    WHERE id = ? 
    AND owner_user_id = ? 
    AND deleted_at IS NULL 
    LIMIT 1 
    `;

  const [rows] = await connection.query(query, [id, userId]);
  return rows[0] || null;
}

async function updateById(id, { name, description, visibility }) {
  const query = `
    UPDATE collection 
    SET 
    name = COALESCE(?, name),
    description = COALESCE(?, description),
    visibility = COALESCE(?, visibility),
    updated_at = NOW()
    WHERE id = ? 
    AND deleted_at IS NULL
    `;

  const [result] = await connection.query(query, [
    name || null,
    description || null,
    visibility || null,
    id,
  ]);

  return result.affectedRows;
}

async function softDeleteById(id) {
  const query = `
    UPDATE collection 
    SET deleted_at = NOW(), 
    updated_at = NOW()
    WHERE id = ? 
    AND deleted_at IS NULL
    `;

  const [result] = await connection.query(query, [id]);
  return result.affectedRows;
}
module.exports = {
  create,
  getByUserId,
  findByIdAndUser,
  updateById,
  softDeleteById,
};
