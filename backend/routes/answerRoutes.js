const express = require("express");
const router = express.Router();

// test route
router.get("/answers", (req, res) => {
  res.json([{ id: 1, content: "Try sandblasting then primer coat", authorId: "user123" }]);
});

module.exports = router;
