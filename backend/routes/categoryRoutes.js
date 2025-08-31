const express = require("express");
const router = express.Router();

// test route
router.get("/categories", (req, res) => {
  res.json([{ id: 1, name: "Classic American Cars", description: "Discussions about Ford, Chevy, etc." }]);
});

module.exports = router;
