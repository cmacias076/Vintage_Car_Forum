const Answer = require("../models/Answer");
const Question = require("../models/Question");

// Create a new answer
const createAnswer = async (req, res) => {
  try {
    const { content } = req.body;
    const { questionId } = req.params;

    if (!content) {
      return res.status(400).json({ message: "Content is required" });
    }

    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).json({ message: "Question not found" });
    }

    const answer = new Answer({
      content,
      question: questionId,
      user: req.user._id,
    });

    await answer.save();

    res.status(201).json(answer);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all answers for a question
const getAnswersByQuestion = async (req, res) => {
  try {
    const answers = await Answer.find({ question: req.params.questionId })
      .populate("user", "username");
    res.json(answers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createAnswer,
  getAnswersByQuestion,
};
