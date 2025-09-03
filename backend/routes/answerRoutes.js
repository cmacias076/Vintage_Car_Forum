const express = require('express');
const router = express.Router();
const answerController = require('../controllers/answerController');
const authMiddleware = require('../middlewares/auth');

// POST - Create an answer
router.post('/', authMiddleware, answerController.createAnswer);

// GET - Get all answers for a specific question
router.get('/:questionId/answers', answerController.getAnswersForQuestion);

module.exports = router;
