const connection = require("../config/db");

async function addFavorite(userId, recipeId) {
  const query = `
    INSERT INTO favorite (user_id, recipe_id)
    VALUES(?, ?)
    `;

  await connection.query(query, [userId, recipeId]);
}

async function removeFavorite(userId, recipeId) {
  const query = `
    DELETE FROM favorite 
    WHERE user_id = ?
    AND recipe_id = ?
    `;

  const [result] = await connection.query(query, [userId, recipeId]);
  return result.affectedRows;
}

async function getFavoritesByUser(userId) {
  const query = `
    SELECT r.*
    FROM favorite f 
    INNER JOIN recipe r ON r.id = f.recipe_id
    WHERE f.user_id = ?
    AND r.deleted_at IS NULL 
    ORDER BY f.created_at DESC
    `;

  const [rows] = await connection.query(query, [userId]);
  return rows;
}

module.exports = {
  addFavorite,
  removeFavorite,
  getFavoritesByUser,
};
