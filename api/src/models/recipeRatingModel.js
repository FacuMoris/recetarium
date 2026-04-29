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

module.exports = {
  getStatsByRecipeId,
};
