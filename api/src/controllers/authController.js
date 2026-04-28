const authModel = require("../models/authModel");
const axios = require("axios");

async function me(req, res, next) {
  try {
    // payload de express-oauth2-jwt-bearer
    const claims = req.auth;
    // sub: id unico del usuario en auth0
    const sub = claims?.payload?.sub;

    if (!sub) {
      return res.status(401).json({ success: false, message: "Token sin sub" });
    }

    const token = req.headers.authorization.split(" ")[1];

    const response = await axios.get(
      "https://dev-lhvixnsa65hm0huw.us.auth0.com/userinfo",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    const { email, name, picture } = response.data;

    const [provider] = sub.split("|");

    const user = await authModel.findOrCreateUserByIdentity(
      provider,
      sub,
      email,
      name,
      picture,
    );
    return res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
}

module.exports = { me };
