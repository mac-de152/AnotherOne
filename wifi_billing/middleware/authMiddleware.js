const jwt = require("jsonwebtoken");
require("dotenv").config();

const authMiddleware = (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  try {
    const tokenValue = token.replace("Bearer ", "");
    const decoded = jwt.verify(tokenValue, process.env.JWT_SECRET);

    // Optional: token expiration check (jwt.verify throws if expired, so usually redundant)
    if (decoded.exp && Date.now() >= decoded.exp * 1000) {
      return res.status(401).json({ error: "Token has expired." });
    }

    // Role-based access control for admin only
    if (decoded.role !== "admin") {
      return res.status(403).json({ error: "Access denied. Admins only." });
    }

    req.admin = decoded; // attach decoded token data to request
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Token has expired." });
    } else if (err.name === "JsonWebTokenError") {
      return res.status(401).json({ error: "Invalid token." });
    } else {
      console.error("JWT verification error:", err);
      return res.status(401).json({ error: "Invalid token." });
    }
  }
};

module.exports = authMiddleware;
