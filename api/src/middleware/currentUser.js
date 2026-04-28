const authIdentityModel = require("../models/authIdentityModel");
const userModel = require("../models/userModel");

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

    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = {
      id: user.id,
      role: user.role,
      provider,
      sub,
    };

    next();
  } catch (err) {
    next(err);
  }
}

module.exports = currentUser;
