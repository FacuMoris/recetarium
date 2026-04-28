const connection = require("../config/db");

async function findById(id) {
  const query = `
    SELECT u.id, u.first_name, u.last_name, u.username, u.email, 
    u.avatar_url, u.birth_date, u.role_id, r.name AS role, u.status, 
    u.last_login_at, u.created_at, u.updated_at
    FROM user u 
    INNER JOIN role r ON r.id = u.role_id
    WHERE u.id = ?
    AND u.deleted_at IS NULL
    LIMIT 1
    `;

  const [rows] = await connection.query(query, [id]);
  return rows[0] || null;
}

async function findByEmail(email) {
  const query = `
  SELECT id, first_name, last_name, username, email, avatar_url, birth_date, role_id, status, 
  last_login_at, created_at, updated_at
    FROM user
    WHERE email = ?
    AND deleted_at IS NULL
    LIMIT 1
  `;

  const [rows] = await connection.query(query, [email]);
  return rows[0] || null;
}

async function updateProfileFromAuth(
  conn,
  userId,
  { firstName, lastName, avatarUrl },
) {
  const query = `
  UPDATE user
  SET 
  first_name = COALESCE(?, first_name),
  last_name = COALESCE(?, last_name),
  avatar_url = COALESCE(?, avatar_url),
  last_login_at = NOW(),
  updated_at = NOW()
  WHERE id = ?
  `;

  await conn.query(query, [
    firstName || null,
    lastName || null,
    avatarUrl || null,
    userId,
  ]);
}

async function updateLastLogin(conn, userId) {
  const query = `
    UPDATE user 
    SET last_login_at = NOW()
    WHERE id = ?
    `;

  await conn.query(query, [userId]);
}

async function create(
  conn,
  { firstName, lastName, username, email, avatarUrl, roleId },
) {
  const query = `
    INSERT INTO user (first_name, last_name, username, email, avatar_url, role_id)
    VALUES (?, ?, ?, ?, ?, ?)
    `;

  const [result] = await conn.query(query, [
    firstName,
    lastName || null,
    username,
    email,
    avatarUrl || null,
    roleId,
  ]);

  return result.insertId;
}

module.exports = {
  findById,
  findByEmail,
  create,
  updateLastLogin,
  updateProfileFromAuth,
};
