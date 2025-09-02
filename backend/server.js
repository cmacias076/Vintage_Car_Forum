const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const questionRoutes = require("./routes/questionRoutes");
const answerRoutes = require("./routes/answerRoutes");

const app = express();

app.use(cors());
app.use(express.json());

// API routes
app.use("/api/auth", authRoutes); 
app.use("/api/categories", categoryRoutes); 
app.use("/api/questions", questionRoutes); 
app.use("/api/answer", answerRoutes);  

app.get("/", (req, res) => {
  res.send("Vintage Car Forum API running...");
});

// MongoDB connection + server start
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(5000, () => console.log("Server running on port 5000"));
  })
  .catch((err) => console.error(err));
