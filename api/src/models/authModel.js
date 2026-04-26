const connection = require("../config/db");
const roleModel = require("./roleModel");
const userModel = require("./userModel");
const authIdentityModel = require("./authIdentityModel");
const { splitName, usernameFromEmail } = require("../helpers/authHelper");

async function findOrCreateUserByIdentity(
  provider,
  providerUserId,
  email,
  name,
  picture,
) {
  const identity = await authIdentityModel.findByProviderUserId(
    provider,
    providerUserId,
  );

  if (identity) {
    const user = await userModel.findById(identity.user_id);

    if (!user) {
      throw new Error("Auth identity exists but user was not found");
    }

    const conn = await connection.getConnection();
    try {
      await userModel.updateLastLogin(conn, user.id);
    } finally {
      conn.release();
    }

    return user;
  }

  const conn = await connection.getConnection();

  try {
    await conn.beginTransaction();
    const role = await roleModel.findByName("user");
    if (!role) {
      throw new Error("Default role 'user' not found");
    }

    const { firstName, lastName } = splitName(name || email || "Usuario");

    const newUserId = await userModel.create(conn, {
      firstName,
      lastName,
      username: usernameFromEmail(email),
      email,
      avatarUrl: picture,
      roleId: role.id,
    });

    await authIdentityModel.create(conn, {
      userId: newUserId,
      provider,
      providerUserId,
    });

    await conn.commit();
    return await userModel.findById(newUserId);
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
}

module.exports = {
  findOrCreateUserByIdentity,
};
