const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/authRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const questionRoutes = require("./routes/questionRoutes");
const answerRoutes = require("./routes/answerRoutes");

const app = express();
app.use(express.json());
app.use(cors());

// routes
app.use("/api", authRoutes);
app.use("/api", categoryRoutes);
app.use("/api", questionRoutes);
app.use("/api", answerRoutes);

app.get("/", (req, res) => {
  res.send(" Vintage Car Forum API running...");
});


console.log("MONGO_URI:", process.env.MONGO_URI);

// connect DB + start server
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(5000, () => console.log("Server running on port 5000"));
  })
  .catch((err) => console.error(err));
