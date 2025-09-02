const Category = require("../models/Category");

// Create a new category
const createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Name is required" });
    }

    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      return res.status(400).json({ message: "Category already exists" });
    }

    const category = new Category({ name, description });
    await category.save();

    res.status(201).json(category);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get all categories
const getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get a category by ID
const getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ message: "Category not found" });
    res.json(category);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createQuestion = async (req, res) => {
  try {
    const { title, content, category } = req.body;

    if (!title || !content || !category) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Ensure category exists
    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return res.status(404).json({ message: "Category not found" });
    }

    const question = new Question({
      title,
      content,
      categoryId: category, 
      userId: req.user.id,   
    });

    const savedQuestion = await question.save();

    res.status(201).json(savedQuestion);
  } catch (err) {
    console.error("Error creating question:", err.message);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = {
  createCategory,
  getCategories,
  getCategoryById,
};
