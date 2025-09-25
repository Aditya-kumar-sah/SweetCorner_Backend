const jwt = require("jsonwebtoken");

const UserAuth = (req, res, next) => {
  try {
    // Get token from cookies or headers
    const token =
      req.cookies?.uid || req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(400).json({ message: "Access denied. No token provided." });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user info to req
    req.user = decoded;

    next(); // pass control to the next handler
  } catch (error) {
    return res.status(500).json({ message: "Invalid or expired token." });
  }
};

const AdminAuth = (req, res, next) => {
  try {
    // Get token from cookies or headers
    const token =
      req.cookies?.uid || req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(400).json({ message: "Access denied. No token provided." });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if(!decoded.isAdmin) return res.status(400).json({ message: "Admin not authorised!" });

    // Attach user info to req
    req.user = decoded;

    next(); // pass control to the next handler
  } catch (error) {
    return res.status(500).json({ message: "Invalid or expired token." });
  }
};

module.exports = {AdminAuth,UserAuth};
