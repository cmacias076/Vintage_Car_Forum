const express = require("express");
const router = express.Router();

// test route
router.get("/questions", (req, res) => {
  res.json([{ id: 1, content: "What is the best way to restore a Mustang?", authorId: "user123" }]);
});

module.exports = router;
