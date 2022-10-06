const router = require('express').Router();

const categoriesModel = require('../models/Categories');
const categoriesController = require('../controllers/CategoriesController');

const validateCategoriesId = async (req, res, next) => {
  const cities = await categoriesModel.findByPk(req.params.categoriesId);
  if (!cities) {
    return res.status(404).json({ error: 'Categories not found' });
  }
  next();
}

router.get('/categories', categoriesController.index);

router.post('/categories', categoriesController.create);

router.get('/categories/:categoriesId', validateCategoriesId, categoriesController.show);

router.put('/categories/:categoriesId', validateCategoriesId, categoriesController.update);

router.delete('/categories/:categoriesId', validateCategoriesId, categoriesController.delete);

module.exports = router;