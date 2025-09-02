const Answer = require('../models/Answer');
const Question = require('../models/Question');

// Create a new answer for a question
const createAnswer = async (req, res) => {
  try {
    const { content, questionId } = req.body;

    // Check if content and questionId are provided
    if (!content || !questionId) {
      return res.status(400).json({ message: 'Content and questionId are required' });
    }

    // Ensure the question exists in the database
    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }

    // Create the answer object and save it
    const newAnswer = new Answer({
      content,
      questionId, 
      userId: req.user._id, 
    });

    await newAnswer.save();

    // Respond with the newly created answer
    return res.status(201).json({
      message: 'Answer created successfully',
      answer: newAnswer,
    });
  } catch (err) {
    console.error('Error creating answer:', err.message);
    return res.status(500).json({ message: 'Server error' });
  }
};

// Get all answers for a specific question
const getAnswersForQuestion = async (req, res) => {
  try {
    const { questionId } = req.params;

    // Ensure the questionId is provided in the request URL
    if (!questionId) {
      return res.status(400).json({ message: 'Question ID is required' });
    }

    // Find all answers associated with the given questionId
    const answers = await Answer.find({ questionId })
      .populate('userId', 'username') 
      .populate('questionId', 'title'); 

    // If no answers are found for the question, return a 404
    if (!answers.length) {
      return res.status(404).json({ message: 'No answers found for this question' });
    }

    // Respond with the list of answers
    return res.status(200).json(answers);
  } catch (err) {
    console.error('Error fetching answers:', err.message);
    return res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createAnswer,
  getAnswersForQuestion,
};
