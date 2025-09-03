const express = require("express");
const router = express.Router();

const {
  createQuestion,
  getQuestions,
  getQuestionById,
  getQuestionsByCategory,
  getQuestionsPaginated,
} = require("../controllers/questionController");
const auth = require("../middlewares/auth");

// Protected: create a question
router.post("/questions", auth, createQuestion);

// Public: list questions (all) and single question
router.get("/questions", getQuestions);
router.get("/questions/:id", getQuestionById);

// Public: list by category (non-paginated)
router.get("/categories/:categoryId/questions", getQuestionsByCategory);

// Public: paginated endpoints
router.get("/questions-paged", getQuestionsPaginated);
router.get("/categories/:categoryId/questions-paged", getQuestionsPaginated);

module.exports = router;
