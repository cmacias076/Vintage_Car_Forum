const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/auth");
const {
  createQuestion,
  getQuestions,
  getQuestionById,
} = require("../controllers/questionController");

// POST - Create a question
router.post("/", authMiddleware, createQuestion);

// GET - List all questions
router.get("/", getQuestions);

// GET - Single question by ID
router.get("/:id", getQuestionById);

module.exports = router;
