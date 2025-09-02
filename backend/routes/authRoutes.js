const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getUserProfile } = require('../controllers/authController');
const authMiddleware = require('../middleware/auth'); // Import auth middleware to protect routes

// Register route: Handles user registration
router.post('/register', registerUser);

// Login route: Handles user login and token generation
router.post('/login', loginUser); 

// Profile route: A protected route to fetch user profile (authentication required)
router.get('/me', authMiddleware, getUserProfile); // Add authMiddleware to protect this route

module.exports = router;
