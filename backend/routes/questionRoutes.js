const express = require("express");
const router = express.Router();

const {
  createQuestion,
  getQuestions,
  getQuestionById,
} = require("../controllers/questionController");

const auth = require("../middleware/auth"); // correct import

// Protected: only logged-in users can post
router.post("/questions", auth, createQuestion);

// Public: anyone can view
router.get("/questions", getQuestions);
router.get("/questions/:id", getQuestionById);

module.exports = router;
