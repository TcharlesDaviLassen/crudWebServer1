const router = require('express').Router();

const FormatModel = require('../models/Format.js');
const FormatController = require('../controllers/FormatController.js');

const validateFormatId = async (req, res, next) => {
  const format = await FormatModel.findByPk(req.params.formatId);
  if (!format) {
    return res.status(404).json({ error: 'format not found' });
  }
  next();
}

router.get('/format', FormatController.index);

router.post('/format', FormatController.create);

router.get('/format/:formatId', validateFormatId, FormatController.show);

router.put('/format/:formatId', validateFormatId, FormatController.update);

router.delete('/format/:formatId', validateFormatId, FormatController.delete);

module.exports = router;
