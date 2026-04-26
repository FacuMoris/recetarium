const connection = require("../config/db");

async function findByProviderUserId(provider, providerUserId) {
  const query = `
    SELECT id, user_id, provider, provider_user_id
    FROM auth_identity
    WHERE provider = ?
    AND provider_user_id = ?
    LIMIT 1
    `;
  const [rows] = await connection.query(query, [provider, providerUserId]);
  return rows[0] || null;
}

async function create(conn, { userId, provider, providerUserId }) {
  const query = `
    INSERT INTO auth_identity (user_id, provider, provider_user_id)
    VALUES (?, ?, ?)
    `;
  const [result] = await conn.query(query, [userId, provider, providerUserId]);
  return result.insertId;
}

module.exports = { findByProviderUserId, create };
