const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const questionRoutes = require('./routes/questionRoutes');
const answerRoutes = require('./routes/answerRoutes');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json()); 

// API Routes
app.use('/api/auth', authRoutes); 
app.use('/api/categories', categoryRoutes);
app.use('/api/questions', questionRoutes); 
app.use('/api/answers', answerRoutes); 

// Test route
app.get('/', (req, res) => {
  res.send('Vintage Car Forum API is running...');
});

// MongoDB connection + server start
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(5000, () => console.log('Server running on port 5000'));
  })
  .catch((err) => {
    console.error('MongoDB connection error: ', err);
    process.exit(1); 
  });
