const connection = require("../config/db");

async function addRecipe(collectionId, recipeId) {
  const query = `
    INSERT INTO collection_recipe (collection_id, recipe_id)
    VALUES (?,?)
    `;

  await connection.query(query, [collectionId, recipeId]);
}

async function removeRecipe(collectionId, recipeId) {
  const query = `
    DELETE FROM collection_recipe 
    WHERE collection_id = ?
    AND recipe_id = ?
    `;

  const [result] = await connection.query(query, [collectionId, recipeId]);
  return result.affectedRows;
}

async function getRecipesByCollection(collectionId) {
  const query = `
    SELECT r.*
    FROM collection_recipe cr 
    INNER JOIN recipe r ON r.id = cr.recipe_id 
    WHERE cr.collection_id = ? 
    AND r.deleted_at IS NULL 
    ORDER BY cr.position ASC, cr.added_at DESC
    `;

  const [rows] = await connection.query(query, [collectionId]);
  return rows;
}

module.exports = {
  addRecipe,
  removeRecipe,
  getRecipesByCollection,
};
