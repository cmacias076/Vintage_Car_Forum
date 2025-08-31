const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { createQuestion, getQuestionsByCategory, getAllQuestions } = require('../controllers/questionController');

// POST /api/questions  (protected) - user pulled from JWT, do not send "user" in body
router.post('/questions', auth, createQuestion);

// GET /api/questions - all questions
router.get('/questions', getAllQuestions);

// GET /api/categories/:categoryId/questions - questions in a category
router.get('/categories/:categoryId/questions', getQuestionsByCategory);

module.exports = router;