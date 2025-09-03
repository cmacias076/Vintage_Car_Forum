const mongoose = require("mongoose");
const Answer = require("../models/Answer");
const Question = require("../models/Question");

// Get answers for a question (public)
const getAnswersForQuestion = async (req, res) => {
  try {
    const { questionId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(questionId)) {
      return res.status(400).json({ message: "Invalid question id" });
    }

    const answers = await Answer.find({ questionId })
      .populate("authorId", "username")
      .sort({ createdAt: -1 });

    res.json(answers);
  } catch (err) {
    console.error("getAnswersForQuestion error", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Post an answer (requires auth)
const postAnswer = async (req, res) => {
  try {
    const { questionId } = req.params;
    const { content } = req.body;
    const userId = req.user && req.user._id;

    if (!userId) return res.status(401).json({ message: "Authentication required" });

    if (!mongoose.Types.ObjectId.isValid(questionId)) {
      return res.status(400).json({ message: "Invalid question id" });
    }
    if (!content || !content.trim()) {
      return res.status(400).json({ message: "Answer cannot be empty" });
    }

    const question = await Question.findById(questionId);
    if (!question) return res.status(404).json({ message: "Question not found" });

    const ans = await Answer.create({
      questionId,
      authorId: userId,
      content: content.trim(),
    });

    const populated = await Answer.findById(ans._id).populate("authorId", "username");

    res.status(201).json(populated);
  } catch (err) {
    console.error("postAnswer error", err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getAnswersForQuestion, postAnswer };
