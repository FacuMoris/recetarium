const connection = require("../config/db");

async function create({ recipeId, instruction, imageUrl, storageKey }) {
  const stepNumber = await getNextStepNumber(recipeId);

  const query = `
    INSERT INTO recipe_step (recipe_id, step_number, instruction, image_url, image_storage_key)
    VALUES (?,?,?, ?, ?)
    `;

  const [result] = await connection.query(query, [
    recipeId,
    stepNumber,
    instruction,
    imageUrl ?? null,
    storageKey ?? null,
  ]);

  return result.insertId;
}

async function getByRecipeId(recipeId) {
  const query = `
    SELECT id, recipe_id, step_number, instruction, 
    image_url, image_storage_key, created_at, updated_at 
    FROM recipe_step 
    WHERE recipe_id = ? 
    ORDER BY step_number ASC
    `;

  const [rows] = await connection.query(query, [recipeId]);
  return rows;
}

async function getById(id) {
  const query = `
  SELECT id, recipe_id, step_number, instruction, image_url, image_storage_key 
  FROM recipe_step 
  WHERE id = ?
  LIMIT 1
  `;

  const [rows] = await connection.query(query, [id]);
  return rows[0] || null;
}

async function updateById(id, { instruction, imageUrl, storageKey }) {
  const query = `
    UPDATE recipe_step 
    SET instruction = COALESCE(?, instruction),
    image_url = COALESCE(?, image_url),
    image_storage_key = COALESCE(?, image_storage_key),
    updated_at = NOW() 
    WHERE id = ? 
    `;

  const [result] = await connection.query(query, [
    instruction ?? null,
    imageUrl ?? null,
    storageKey ?? null,
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

async function updateStepNumber(id, stepNumber) {
  const query = `
  UPDATE recipe_step 
  SET step_number = ? 
  WHERE id = ? 
  `;

  await connection.query(query, [stepNumber, id]);
}

async function getNextStepNumber(recipeId) {
  const query = `
  SELECT COALESCE(MAX(step_number), 0) + 1 AS next_step_number 
  FROM recipe_step 
  WHERE recipe_id = ? 
  `;

  const [rows] = await connection.query(query, [recipeId]);
  return rows[0].next_step_number;
}

async function normalizeStepNumbers(recipeId) {
  const steps = await getByRecipeId(recipeId);

  for (let i = 0; i < steps.length; i++) {
    await updateStepNumber(steps[i].id, i + 1);
  }
}

async function updateStepNumbersTemporarily(recipeId) {
  const query = `
  UPDATE recipe_step 
  SET step_number = step_number + 100
  WHERE recipe_id = ?
  `;

  await connection.query(query, [recipeId]);
}

async function updateStepNumberByRecipe(id, recipeId, stepNumber) {
  const query = `
  UPDATE recipe_step 
  SET step_number = ? 
  WHERE id = ? 
  AND recipe_id = ? 
  `;

  const [result] = await connection.query(query, [stepNumber, id, recipeId]);

  return result.affectedRows;
}

module.exports = {
  create,
  getByRecipeId,
  getById,
  updateById,
  deleteById,
  getNextStepNumber,
  updateStepNumber,
  normalizeStepNumbers,
  updateStepNumbersTemporarily,
  updateStepNumberByRecipe,
};
