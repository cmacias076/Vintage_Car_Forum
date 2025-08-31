const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { createAnswer, getAnswersForQuestion } = require('../controllers/answerController');

// POST /api/answers - create answer (protected)
router.post('/answers', auth, createAnswer);

// GET /api/questions/:questionId/answers - get answers for question
router.get('/questions/:questionId/answers', getAnswersForQuestion);

module.exports = router;
