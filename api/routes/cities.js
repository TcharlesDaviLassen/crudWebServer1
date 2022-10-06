const router = require('express').Router();

const CitiesModel = require('../models/Cities.js');
const CitiesController = require('../controllers/CitiesController.js');

const validateCitiesId = async (req, res, next) => {
  const cities = await CitiesModel.findByPk(req.params.CitiesId);
  if (!cities) {
    return res.status(404).json({ error: 'Cities not found' });
  }
  next();
}

router.get('/cities', CitiesController.index);

router.post('/cities', CitiesController.create);

router.get('/cities/:CitiesId', validateCitiesId, CitiesController.show);

router.put('/cities/:CitiesId', validateCitiesId, CitiesController.update);

router.delete('/cities/:CitiesId', validateCitiesId, CitiesController.delete);

module.exports = router;