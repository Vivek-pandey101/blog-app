const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String, // DraftJS or Markdown
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    image: {
      type: String, // Single Google Drive image URL
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", postSchema);
