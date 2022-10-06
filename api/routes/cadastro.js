const router = require('express').Router();

const CadastroModel = require('../models/Cadastro.js');
const cadastroController = require('../controllers/CadastroController');

const validateCadastroId = async (req, res, next) => {
  const cadastro = await CadastroModel.findByPk(req.params.cadastroId);
  if (!cadastro) {
    return res.status(404).json({ error: 'Cadastro not found' });
  }
  
  next();
}

router.get('/cadastro', cadastroController.index);

router.post('/cadastro', cadastroController.create);

router.get('/cadastro/:cadastroId', validateCadastroId, cadastroController.show);

router.put('/cadastro/:cadastroId', validateCadastroId, cadastroController.update);

router.delete('/cadastro/:cadastroId', validateCadastroId, cadastroController.delete);

module.exports = router;
