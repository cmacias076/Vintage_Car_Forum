const mongoose = require('mongoose');
const Question = require('../models/Question');
const Category = require('../models/Category');

const createQuestion = async (req, res) => {
  try {
    const { title, content, category } = req.body;
    const userId = req.user && req.user.id;
    if (!userId) return res.status(401).json({ message: 'Authentication required' });

    if (!title || !title.trim()) return res.status(400).json({ message: 'Title is required' });
    if (!content || !content.trim()) return res.status(400).json({ message: 'Content is required' });
    if (!content.trim().endsWith('?')) return res.status(400).json({ message: 'Question must end with a question mark' });

    if (!category || !mongoose.Types.ObjectId.isValid(category)) {
      return res.status(400).json({ message: 'Valid category id is required' });
    }

    const cat = await Category.findById(category);
    if (!cat) return res.status(404).json({ message: 'Category not found' });

    const q = new Question({
      title: title.trim(),
      content: content.trim(),
      category,
      user: userId
    });

    await q.save();
    await q.populate('category', 'name');
    await q.populate('user', 'username');

    return res.status(201).json(q);
  } catch (err) {
    console.error('createQuestion error', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

const getQuestionsByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(categoryId)) return res.status(400).json({ message: 'Invalid category id' });

    const qs = await Question.find({ category: categoryId })
      .populate('user', 'username')
      .populate('category', 'name')
      .sort({ createdAt: -1 });

    res.json(qs);
  } catch (err) {
    console.error('getQuestionsByCategory error', err);
    res.status(500).json({ message: 'Server error' });
  }
};

const getAllQuestions = async (req, res) => {
  try {
    const qs = await Question.find()
      .populate('user', 'username')
      .populate('category', 'name')
      .sort({ createdAt: -1 });
    res.json(qs);
  } catch (err) {
    console.error('getAllQuestions error', err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { createQuestion, getQuestionsByCategory, getAllQuestions };