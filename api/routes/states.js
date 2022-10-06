const router = require('express').Router();

const StateModel = require('../models/State');
const StatesController = require('../controllers/StatesController.js');

const validateStatesId = async (req, res, next) => {
  const state = await StateModel.findByPk(req.params.StatesId);
  if (!state) {
    return res.status(404).json({ error: 'States not found' });
  }
  next();
}

router.get('/states', StatesController.index);

router.post('/states', StatesController.create);

router.get('/states/:StatesId', validateStatesId, StatesController.show);

router.put('/states/:StatesId', validateStatesId, StatesController.update);

router.delete('/states/:StatesId', validateStatesId, StatesController.delete);

module.exports = router;