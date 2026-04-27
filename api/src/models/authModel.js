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

  const { firstName, lastName } = splitName(name || email || "Usuario");

  if (identity) {
    const conn = await connection.getConnection();

    try {
      await userModel.updateProfileFromAuth(conn, identity.user_id, {
        firstName,
        lastName,
        avatarUrl: picture,
      });

      return await userModel.findById(identity.user_id);
    } finally {
      conn.release();
    }
  }

  const conn = await connection.getConnection();

  try {
    await conn.beginTransaction();

    let user = email ? await userModel.findByEmail(email) : null;

    if (user) {
      await authIdentityModel.create(conn, {
        userId: user.id,
        provider,
        providerUserId,
      });

      await userModel.updateProfileFromAuth(conn, user.id, {
        firstName,
        lastName,
        avatarUrl: picture,
      });

      await conn.commit();
      return await userModel.findById(user.id);
    }

    const role = await roleModel.findByName("user");

    if (!role) {
      throw new Error("Default role 'user' not found");
    }

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
    await conn.roollback();
    throw err;
  } finally {
    conn.release();
  }
}

module.exports = {
  findOrCreateUserByIdentity,
};
