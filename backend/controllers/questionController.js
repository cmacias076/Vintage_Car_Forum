// controllers/questionController.js
const Question = require("../models/Question");
const Category = require("../models/Category");

// Create a new question
const createQuestion = async (req, res) => {
  try {
    const { title, content, category } = req.body;

    if (!title || !content || !category) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Make sure category exists
    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return res.status(404).json({ message: "Category not found" });
    }

    const question = new Question({
      title,
      content,
      category,
      user: req.user.id, // from auth middleware
    });

    await question.save();

    res.status(201).json(question);
  } catch (err) {
    console.error("Error creating question:", err.message);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all questions
const getQuestions = async (req, res) => {
  try {
    const questions = await Question.find()
      .populate("category", "name")
      .populate("user", "username");
    res.json(questions);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get single question by ID
const getQuestionById = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id)
      .populate("category", "name")
      .populate("user", "username");

    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    res.json(question);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createQuestion,
  getQuestions,
  getQuestionById,
};
