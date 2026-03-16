// ============================================
// Community Controller
// ============================================

const ForumPost = require('../models/ForumPost');

exports.getCommunityPage = async (req, res) => {
  try {
    const posts = await ForumPost.find().sort({ createdAt: -1 });
    res.render('pages/community', { title: 'Community Forum', posts, success: req.query.success || null, error: null });
  } catch (error) {
    res.status(500).render('pages/error', { title: 'Error', message: 'Failed to load forum.' });
  }
};

exports.createPost = async (req, res) => {
  try {
    const { title, content, author } = req.body;
    await ForumPost.create({ title: title?.trim(), content: content?.trim(), author: author?.trim() });
    res.redirect('/community?success=Post created successfully!');
  } catch (error) {
    const posts = await ForumPost.find().sort({ createdAt: -1 });
    res.render('pages/community', { title: 'Community Forum', posts, success: null, error: error.message });
  }
};

exports.addComment = async (req, res) => {
  try {
    const { author, content } = req.body;
    await ForumPost.findByIdAndUpdate(req.params.id, {
      $push: { comments: { author: author?.trim(), content: content?.trim() } },
    });
    res.redirect('/community');
  } catch (error) {
    res.redirect('/community');
  }
};

exports.deletePost = async (req, res) => {
  try {
    await ForumPost.findByIdAndDelete(req.params.id);
    res.redirect('/community');
  } catch (error) {
    res.redirect('/community');
  }
};
