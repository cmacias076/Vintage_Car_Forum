const mongoose = require('mongoose');
const Answer = require('../models/Answer');
const Question = require('../models/Question');

const createAnswer = async (req, res) => {
  try {
    const { questionId, content } = req.body;
    const userId = req.user && req.user.id;
    if (!userId) return res.status(401).json({ message: 'Authentication required' });

    if (!content || !content.trim()) return res.status(400).json({ message: 'Answer cannot be empty' });
    if (!mongoose.Types.ObjectId.isValid(questionId)) return res.status(400).json({ message: 'Invalid question id' });

    const question = await Question.findById(questionId);
    if (!question) return res.status(404).json({ message: 'Question not found' });

    const answer = new Answer({
      content: content.trim(),
      question: questionId,
      user: userId
    });

    await answer.save();
    await answer.populate('user', 'username');
    await answer.populate('question', 'title');

    res.status(201).json(answer);
  } catch (err) {
    console.error('createAnswer error', err);
    res.status(500).json({ message: 'Server error' });
  }
};

const getAnswersForQuestion = async (req, res) => {
  try {
    const { questionId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(questionId)) return res.status(400).json({ message: 'Invalid question id' });

    const answers = await Answer.find({ question: questionId })
      .populate('user', 'username')
      .sort({ createdAt: 1 });

    res.json(answers);
  } catch (err) {
    console.error('getAnswersForQuestion error', err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { createAnswer, getAnswersForQuestion };
