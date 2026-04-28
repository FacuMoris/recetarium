function requireRole(roleName) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    if (req.user.role !== roleName) {
      return res.status(403).json({
        success: false,
        message: "Forbidden",
      });
    }
    next();
  };
}

module.exports = requireRole;
