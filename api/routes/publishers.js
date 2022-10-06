const router = require('express').Router();

const publishersModel = require('../models/Publishers.js');
const publishersController = require('../controllers/PublishersControllers');

const validatePublishersId = async (req, res, next) => {
  const publishers = await publishersModel.findByPk(req.params.publishersId);
  if (!publishers) {
    return res.status(404).json({ error: 'Publishers not found' });
  }
  next();
}

router.get('/publishers', publishersController.index);

router.post('/publishers', publishersController.create);

router.get('/publishers/:publishersId', validatePublishersId, publishersController.show);

router.put('/publishers/:publishersId', validatePublishersId, publishersController.update);

router.delete('/publishers/:publishersId', validatePublishersId, publishersController.delete);

module.exports = router;