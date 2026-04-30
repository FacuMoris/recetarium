const connection = require("../config/db");

async function getStatsByRecipeId(recipeId) {
  const query = `
    SELECT 
    COALESCE(ROUND(AVG(rating), 1), 0) AS average_rating, 
    COUNT(*) AS rating_count
    FROM recipe_rating
    WHERE recipe_id = ? 
    `;

  const [rows] = await connection.query(query, [recipeId]);
  return rows[0];
}

async function upsertRating({ recipeId, userId, rating }) {
  const query = `
  INSERT INTO recipe_rating (recipe_id, user_id, rating)
  VALUES (?, ?, ?)
  ON DUPLICATE KEY UPDATE 
  rating = VALUES(rating),
  updated_at = NOW();
  `;

  await connection.query(query, [recipeId, userId, rating]);
}

async function getUserRating(recipeId, userId) {
  const query = `
  SELECT recipe_id, user_id, rating 
  FROM recipe_rating 
  WHERE recipe_id = ? 
  AND user_id = ? 
  LIMIT 1
  `;

  const [rows] = await connection.query(query, [recipeId, userId]);
  return rows[0] || null;
}

async function deleteRating(recipeId, userId) {
  const query = `
  DELETE FROM recipe_rating 
  WHERE recipe_id = ? 
  AND user_id = ? 
  `;

  const [result] = await connection.query(query, [recipeId, userId]);
  return result.affectedRows;
}

module.exports = {
  getStatsByRecipeId,
  upsertRating,
  getUserRating,
  deleteRating,
};
