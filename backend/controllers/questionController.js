const mongoose = require("mongoose");
const Question = require("../models/Question");
const Category = require("../models/Category");

// Create a new question (requires auth)
const createQuestion = async (req, res) => {
  try {
    const { title, content, category } = req.body;
    const userId = req.user && req.user._id;

    if (!userId) {
      return res.status(401).json({ message: "Authentication required" });
    }

    // Validation
    if (!title || !title.trim()) {
      return res.status(400).json({ message: "Title is required" });
    }
    if (!content || !content.trim()) {
      return res.status(400).json({ message: "Content is required" });
    }
    if (!content.trim().endsWith("?")) {
      return res
        .status(400)
        .json({ message: 'Question must end with a question mark (?)' });
    }
    if (!category || !mongoose.Types.ObjectId.isValid(category)) {
      return res.status(400).json({ message: "Valid category id is required" });
    }

    const cat = await Category.findById(category);
    if (!cat) return res.status(404).json({ message: "Category not found" });

    const q = await Question.create({
      title: title.trim(),
      content: content.trim(),
      category,
      user: userId,
    });

    // Return populated doc
    const populated = await Question.findById(q._id)
      .populate("category", "name")
      .populate("user", "username");

    return res.status(201).json(populated);
  } catch (err) {
    console.error("createQuestion error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// Get all questions (public) — newest first
const getQuestions = async (_req, res) => {
  try {
    const qs = await Question.find()
      .populate("user", "username")
      .populate("category", "name")
      .sort({ createdAt: -1 });

    return res.json(qs);
  } catch (err) {
    console.error("getQuestions error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// Get single question by ID (public)
const getQuestionById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid question id" });
    }

    const question = await Question.findById(id)
      .populate("category", "name")
      .populate("user", "username");

    if (!question) return res.status(404).json({ message: "Question not found" });

    return res.json(question);
  } catch (err) {
    console.error("getQuestionById error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// Get questions by category (public) — newest first
const getQuestionsByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      return res.status(400).json({ message: "Invalid category id" });
    }

    const qs = await Question.find({ category: categoryId })
      .populate("user", "username")
      .populate("category", "name")
      .sort({ createdAt: -1 });

    return res.json(qs);
  } catch (err) {
    console.error("getQuestionsByCategory error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  createQuestion,
  getQuestions,
  getQuestionById,
  getQuestionsByCategory,
};
