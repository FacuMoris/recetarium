const connection = require("../config/db");

async function addIngredient({
  recipeId,
  ingredientId,
  quantity,
  unitId,
  note,
}) {
  const query = `
    INSERT INTO recipe_ingredient
    (recipe_id, ingredient_id, quantity, unit_id, note)
    VALUES (?,?,?,?,?)
    `;

  await connection.query(query, [
    recipeId,
    ingredientId,
    quantity ?? null,
    unitId ?? null,
    note ?? null,
  ]);
}

async function getByRecipeId(recipeId) {
  const query = `
    SELECT 
    ri.recipe_id,
    ri.ingredient_id, 
    i.name AS ingredient_name, 
    ri.quantity, 
    ri.unit_id, 
    u.name AS unit_name, 
    ri.note
    FROM recipe_ingredient ri 
    INNER JOIN ingredient i ON i.id = ri.ingredient_id
    LEFT JOIN unit u ON u.id = ri.unit_id 
    WHERE ri.recipe_id = ? 
    `;

  const [rows] = await connection.query(query, [recipeId]);
  return rows;
}

async function updateIngredient(recipeId, ingredientId, data) {
  const query = `
    UPDATE recipe_ingredient
    SET 
    quantity = COALESCE(?, quantity),
    unit_id = COALESCE(?, unit_id),
    note = COALESCE(?, note)
    WHERE recipe_id = ? 
    AND ingredient_id = ?
    `;

  const [result] = await connection.query(query, [
    data.quantity ?? null,
    data.unitId ?? null,
    data.note ?? null,
    recipeId,
    ingredientId,
  ]);

  return result.affectedRows;
}

async function removeIngredient(recipeId, ingredientId) {
  const query = `
    DELETE from recipe_ingredient
    WHERE recipe_id = ? 
    AND ingredient_id = ? 
    `;

  const [result] = await connection.query(query, [recipeId, ingredientId]);
  return result.affectedRows;
}

module.exports = {
  addIngredient,
  getByRecipeId,
  updateIngredient,
  removeIngredient,
};
