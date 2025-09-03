const express = require("express");
const router = express.Router();

const { getAnswersForQuestion, postAnswer } = require("../controllers/answerController");
const auth = require("../middlewares/auth"); 

// Public: list answers for a question
router.get("/questions/:questionId/answers", getAnswersForQuestion);

// Protected: post an answer
router.post("/questions/:questionId/answers", auth, postAnswer);

module.exports = router;
