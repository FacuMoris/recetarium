const connection = require("../config/db");

async function create({ recipeId, url, storageKey, position }) {
  let finalPosition = position;

  if (!finalPosition) {
    finalPosition = await getNextPosition(recipeId);
  }

  if (finalPosition == 1) {
    const existsCover = await positionExists(recipeId, 1);

    if (existsCover) {
      finalPosition = await getNextPosition(recipeId);
    }
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
    SELECT id, recipe_id, url, position 
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

module.exports = {
  create,
  getByRecipeId,
  deleteById,
};
