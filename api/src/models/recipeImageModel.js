const connection = require("../config/db");

async function create({ recipeId, url, storageKey, position }) {
  let finalPosition = position;

  const coverExists = await hasCover(recipeId);

  if (!coverExists) {
    finalPosition = 1;
  }

  if (!finalPosition) {
    finalPosition = await getNextPosition(recipeId);
  }

  while (await positionExists(recipeId, finalPosition)) {
    finalPosition++;
  }

  const query = `
    INSERT INTO recipe_image (recipe_id, url, storage_key, position)
    VALUES(?,?,?,?)
  `;

  const [result] = await connection.query(query, [
    recipeId,
    url,
    storageKey || null,
    finalPosition,
  ]);

  return result.insertId;
}

async function getById(id) {
  const query = `
  SELECT id, recipe_id, url, storage_key, position 
  FROM recipe_image 
  WHERE id = ?
  LIMIT 1
  `;

  const [rows] = await connection.query(query, [id]);
  return rows[0] || null;
}

async function positionExists(recipeId, position) {
  const query = `
    SELECT id 
    FROM recipe_image 
    WHERE recipe_id = ?
    AND position = ? 
    LIMIT 1  
    `;

  const [rows] = await connection.query(query, [recipeId, position]);
  return rows.length > 0;
}

async function getNextPosition(recipeId) {
  const query = `
    SELECT COALESCE(MAX(position),0) +1 AS next_position
    FROM recipe_image 
    WHERE recipe_id = ? 
    `;

  const [rows] = await connection.query(query, [recipeId]);

  return rows[0].next_position;
}

async function getByRecipeId(recipeId) {
  const query = `
    SELECT id, recipe_id, url, storage_key, position 
    FROM recipe_image 
    WHERE recipe_id = ? 
    ORDER BY position ASC
    `;

  const [rows] = await connection.query(query, [recipeId]);
  return rows;
}

async function deleteById(id) {
  const query = `
    DELETE FROM recipe_image 
    WHERE id = ?
    `;

  const [result] = await connection.query(query, [id]);
  return result.affectedRows;
}

async function countByRecipeId(recipeId) {
  const query = `
  SELECT COUNT(*) AS total 
  FROM recipe_image 
  WHERE recipe_id = ?
  `;

  const [rows] = await connection.query(query, [recipeId]);
  return rows[0].total;
}

async function getByPosition(recipeId, position) {
  const query = `
  SELECT id, recipe_id, position 
  FROM recipe_image 
  WHERE recipe_id = ? AND position = ? 
  LIMIT 1
  `;

  const [rows] = await connection.query(query, [recipeId, position]);
  return rows[0] || null;
}

async function updatePosition(id, position) {
  const query = `
  UPDATE recipe_image 
  SET position = ? 
  WHERE id = ?
  `;

  await connection.query(query, [position, id]);
}

async function hasCover(recipeId) {
  const query = `
  SELECT id 
  FROM recipe_image 
  WHERE recipe_id = ? 
  AND position = 1 
  LIMIT 1
  `;

  const [rows] = await connection.query(query, [recipeId]);
  return rows.length > 0;
}

async function normalizePositions(recipeId) {
  const images = await getByRecipeId(recipeId);

  for (let i = 0; i < images.length; i++) {
    await updatePosition(images[i].id, i + 1);
  }
}

module.exports = {
  create,
  getByRecipeId,
  getById,
  deleteById,
  countByRecipeId,
  getByPosition,
  updatePosition,
  hasCover,
  normalizePositions,
};
