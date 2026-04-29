const connection = require("../config/db");

async function create({ recipeId, stepNumber, instruction }) {
  const query = `
    INSERT INTO recipe_step (recipe_id, step_number, instruction)
    VALUES (?,?,?)
    `;

  const [result] = await connection.query(query, [
    recipeId,
    stepNumber,
    instruction,
  ]);

  return result.insertId;
}

async function getByRecipeId(recipeId) {
  const query = `
    SELECT id, recipe_id, step_number, instruction, created_at, updated_at 
    FROM recipe_step 
    WHERE recipe_id = ? 
    ORDER BY step_number ASC
    `;

  const [rows] = await connection.query(query, [recipeId]);
  return rows;
}

async function updateById(id, { stepNumber, instruction }) {
  const query = `
    UPDATE recipe_step 
    SET step_number = COALESCE(?, step_number),
    instruction = COALESCE(?, instruction),
    updated_at = NOW() 
    WHERE id = ? 
    `;

  const [result] = await connection.query(query, [
    stepNumber || null,
    instruction || null,
    id,
  ]);
  return result.affectedRows;
}

async function deleteById(id) {
  const query = `
    DELETE FROM recipe_step 
    WHERE id = ?
    `;

  const [result] = await connection.query(query, [id]);
  return result.affectedRows;
}

module.exports = {
  create,
  getByRecipeId,
  updateById,
  deleteById,
};
