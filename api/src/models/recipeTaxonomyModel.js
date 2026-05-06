const connection = require("../config/db");

async function addTaxonomy(recipeId, taxonomyId) {
  const query = `
    INSERT INTO recipe_taxonomy (recipe_id, taxonomy_id)
    VALUES (?, ?)
    `;

  await connection.query(query, [recipeId, taxonomyId]);
}

async function getByRecipeId(recipeId) {
  const query = `
    SELECT 
    rt.recipe_id, 
    t.id, 
    t.type,
    t.name, 
    t.slug, 
    t.description 
    FROM recipe_taxonomy rt 
    INNER JOIN taxonomy t 
    ON t.id = rt.taxonomy_id 
    WHERE rt.recipe_id = ? 
    AND t.deleted_at IS NULL 
    ORDER BY t.type ASC, t.name ASC
    `;

  const [rows] = await connection.query(query, [recipeId]);
  return rows;
}

async function removeTaxonomy(recipeId, taxonomyId) {
  const query = `
    DELETE FROM recipe_taxonomy 
    WHERE recipe_id = ? 
    AND taxonomy_id = ?
    `;

  const [result] = await connection.query(query, [recipeId, taxonomyId]);

  return result.affectedRows;
}

module.exports = {
  addTaxonomy,
  getByRecipeId,
  removeTaxonomy,
};
