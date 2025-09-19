const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: String,
  content: String,
  authorId: String,
  likes: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model("Blog", blogSchema);
