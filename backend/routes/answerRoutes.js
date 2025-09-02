const express = require("express");
const router = express.Router();

const {
  createAnswer,
  getAnswersByQuestion,
} = require("../controllers/answerController");

const auth = require("../middleware/auth"); // correct import

// Protected: only logged-in users can answer
router.post("/answers", auth, createAnswer);

// Public: fetch answers for a question
router.get("/answers/:questionId", getAnswersByQuestion);

module.exports = router;
