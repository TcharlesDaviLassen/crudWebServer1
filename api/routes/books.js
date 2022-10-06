const router = require('express').Router();

const bookshersModel = require('../models/Books.js');
const booksController = require('../controllers/BoocksController');

const validateBooksId = async (req, res, next) => {
  const books = await bookshersModel.findByPk(req.params.booksId);
  if (!books) {
    return res.status(404).json({ error: 'Boocks not found' });
  }
  next();
}

router.get('/books', booksController.index);

router.post('/books', booksController.create);

router.get('/books/:booksId', validateBooksId, booksController.show);

router.put('/books/:booksId', validateBooksId, booksController.update);

router.delete('/books/:booksId', validateBooksId, booksController.delete);

module.exports = router;