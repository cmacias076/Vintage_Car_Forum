const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Middleware to protect routes
const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Check if the Authorization header exists and starts with 'Bearer '
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1]; // Extract token after 'Bearer'

  try {
    // Verify the JWT token using the secret stored in the environment variables
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find the user by the ID stored in the token and exclude the password field
    req.user = await User.findById(decoded.id).select("-passwordHash");

    if (!req.user) {
      return res.status(404).json({ message: "User not found" });
    }

    next(); // Proceed to the next middleware or route handler
  } catch (err) {
    console.error("JWT verification failed:", err.message); // Log error for debugging
    res.status(401).json({ message: "Invalid or expired token" });
  }
};

module.exports = authMiddleware; // Export the middleware to be used in routes
