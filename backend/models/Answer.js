const mongoose = require("mongoose");

const answerSchema = new mongoose.Schema(
  {
    content: { type: String, required: true, trim: true },
    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Question",
      required: true,
      index: true,
    },
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);

answerSchema.index({ createdAt: 1 });

module.exports = mongoose.model("Answer", answerSchema);
