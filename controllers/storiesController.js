// ============================================
// Stories Controller
// ============================================

const RescueStory = require('../models/RescueStory');

exports.getStories = async (req, res) => {
  try {
    const stories = await RescueStory.find().sort({ rescueDate: -1 });
    res.render('pages/rescue-stories', { title: 'Rescue Stories', stories });
  } catch (error) {
    res.status(500).render('pages/error', { title: 'Error', message: 'Failed to load stories.' });
  }
};

exports.getStoryDetail = async (req, res) => {
  try {
    const story = await RescueStory.findById(req.params.id);
    if (!story) return res.status(404).render('pages/404', { title: 'Not Found' });
    res.render('pages/story-detail', { title: story.title, story });
  } catch (error) {
    res.status(500).render('pages/error', { title: 'Error', message: error.message });
  }
};
