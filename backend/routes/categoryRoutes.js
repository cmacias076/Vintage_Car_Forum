const express = require("express");
const authMiddleware = require("../middlewares/auth"); 
const Category = require("../models/Category"); 
const router = express.Router();

// Get all categories (protected route)
router.get("/", authMiddleware, async (req, res) => {
  try {
    const categories = await Category.find(); 
    res.json(categories); 
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Failed to fetch categories" });
  }
});

// Create a new category (protected route)
router.post("/", authMiddleware, async (req, res) => {
  const { name } = req.body;

  try {
    const newCategory = new Category({ name });
    await newCategory.save();
    res.status(201).json(newCategory); 
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: "Failed to create category" });
  }
});

module.exports = router;
