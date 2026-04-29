const connection = require("../config/db");

async function getByRecipeId(recipeId) {
  const query = `
    SELECT id, recipe_id, url, position 
    FROM recipe_image 
    WHERE recipe_id = ? 
    ORDER BY id ASC
    `;

  const [rows] = await connection.query(query, [recipeId]);
  return rows;
}

module.exports = {
  getByRecipeId,
};
