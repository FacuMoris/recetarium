const connection = require("../config/db");

async function create({ recipeId, userId, content, parentCommentId }) {
  const query = `
    INSERT INTO recipe_comment (recipe_id, user_id, content, parent_comment_id)
    VALUES (?,?,?,?)
    `;

  const [result] = await connection.query(query, [
    recipeId,
    userId,
    content,
    parentCommentId || null,
  ]);

  return result.insertId;
}

async function getRecipeById(recipeId) {
  const query = `
    SELECT 
    rc.id,
    rc.recipe_id,
    rc.user_id,
    rc.parent_comment_id,
    rc.content,
    rc.status, 
    rc.created_at,
    rc.updated_at, 
    u.username, 
    u.avatar_url 
    FROM recipe_comment rc 
    INNER JOIN user u ON u.id = rc.user_id 
    WHERE rc.recipe_id = ?
    AND rc.status = 'visible' 
    AND rc.deleted_at IS NULL 
    ORDER BY rc.created_at ASC
    `;

  const [rows] = await connection.query(query, [recipeId]);
  return rows;
}

async function findByIdAndRecipeId(id, recipeId) {
  const query = `
    SELECT id, recipe_id 
    FROM recipe_comment 
    WHERE id = ? 
    AND recipe_id = ? 
    AND deleted_at IS NULL 
    LIMIT 1 
    `;

  const [rows] = await connection.query(query, [id, recipeId]);
  return rows[0] || null;
}

async function findByIdAndUser(id, userId) {
  const query = `
    SELECT * 
    FROM recipe_comment
    WHERE id = ? 
    AND user_id = ? 
    AND deleted_at IS NULL 
    LIMIT 1
    `;

  const [rows] = await connection.query(query, [id, userId]);
  return rows[0] || null;
}

async function softDeleteById(id) {
  const query = `
    UPDATE recipe_comment 
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
  getRecipeById,
  findByIdAndUser,
  findByIdAndRecipeId,
  softDeleteById,
};
