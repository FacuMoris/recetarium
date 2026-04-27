const authIdentityModel = require("../models/authIdentityModel");

async function currentUser(req, res, next) {
  try {
    const sub = req.auth?.payload?.sub;

    if (!sub) {
      return res.status(401).json({ message: "Invalid token" });
    }

    const [provider] = sub.split("|");

    const userId = await authIdentityModel.findUserByIdentity(provider, sub);

    if (!userId) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = {
      id: userId,
      provider,
      sub,
    };

    next();
  } catch (err) {
    next(err);
  }
}

module.exports = currentUser;
