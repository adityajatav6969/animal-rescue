// ============================================
// Forum Post Model — Community discussion
// ============================================

const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  author: { type: String, required: true, trim: true, maxlength: 100 },
  content: { type: String, required: true, trim: true, maxlength: 2000 },
  createdAt: { type: Date, default: Date.now },
});

const forumPostSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 200 },
    content: { type: String, required: true, trim: true, maxlength: 5000 },
    author: { type: String, required: true, trim: true, maxlength: 100 },
    comments: [commentSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model('ForumPost', forumPostSchema);
