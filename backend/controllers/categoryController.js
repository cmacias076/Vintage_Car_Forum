const mongoose = require("mongoose");
const Category = require("../models/Category");

// Create a new category
const createCategory = async (req, res) => {
  try {
    const { name, description = "" } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ message: "Name is required" });
    }

    // Case-insensitive uniqueness check
    const existing = await Category.findOne({
      name: { $regex: `^${name.trim()}$`, $options: "i" },
    });
    if (existing) {
      return res.status(400).json({ message: "Category already exists" });
    }

    const category = await Category.create({
      name: name.trim(),
      description: description.trim(),
    });

    return res.status(201).json(category);
  } catch (err) {
    console.error("createCategory error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get all categories
const getCategories = async (_req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    return res.json(categories);
  } catch (err) {
    console.error("getCategories error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get a category by ID
const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid category id" });
    }

    const category = await Category.findById(id);
    if (!category) return res.status(404).json({ message: "Category not found" });

    return res.json(category);
  } catch (err) {
    console.error("getCategoryById error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = {
  createCategory,
  getCategories,
  getCategoryById,
};
