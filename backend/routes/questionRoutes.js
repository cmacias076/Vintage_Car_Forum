const express = require("express");
const router = express.Router();
const {
  createQuestion,
  getQuestions,
  getQuestionById,
  getQuestionsByCategory, 
} = require("../controllers/questionController");
const auth = require("../middlewares/auth");

// Protected: create a question
router.post("/questions", auth, createQuestion);

// Public: list questions (all), one by id
router.get("/questions", getQuestions);
router.get("/questions/:id", getQuestionById);

// Public: list by category
router.get("/categories/:categoryId/questions", getQuestionsByCategory);

module.exports = router;
