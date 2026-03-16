// ============================================
// Adoption Controller
// ============================================

const AdoptionAnimal = require('../models/AdoptionAnimal');

exports.getAdoptionPage = async (req, res) => {
  try {
    const filter = { adopted: false };
    if (req.query.type && req.query.type !== 'all') filter.animalType = req.query.type;
    const animals = await AdoptionAnimal.find(filter).sort({ createdAt: -1 });
    res.render('pages/adopt', { title: 'Adopt an Animal', animals, currentType: req.query.type || 'all' });
  } catch (error) {
    res.status(500).render('pages/error', { title: 'Error', message: 'Failed to load animals.' });
  }
};

exports.getAnimalProfile = async (req, res) => {
  try {
    const animal = await AdoptionAnimal.findById(req.params.id);
    if (!animal) return res.status(404).render('pages/404', { title: 'Not Found' });
    res.render('pages/animal-profile', { title: animal.animalName, animal });
  } catch (error) {
    res.status(500).render('pages/error', { title: 'Error', message: error.message });
  }
};

exports.submitAdoptionRequest = async (req, res) => {
  try {
    // In a real app this would create an adoption request record
    res.redirect('/adopt?success=1');
  } catch (error) {
    res.status(500).render('pages/error', { title: 'Error', message: error.message });
  }
};
