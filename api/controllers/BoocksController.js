const { Op, where } = require('sequelize');

// const db = require('../db/indexDB');
const BooksModel = require('../models/Books.js');

const CategoryModel = require('../models/Categories.js');

const PublishersModel = require('../models/Publishers.js');
const FormatModel = require('../models/Format.js');

const LogsController = require('../controllers/LogsController')

class booksController {

  index = async (req, res, next) => {

    const params = req.query;
    const limit = params.limit || 10;
    const page = params.page || 1;
    const offset = (page - 1) * limit;
    let sort = params.sort || 'id';
    let order = params.order || 'ASC';
    const where = {};

    if (params.title) {
      where.title = {
        [Op.iLike]: `%${params.title}%`
      }
    }

    if (params.author) {
      where.author = {
        [Op.iLike]: `%${params.author}%`
      }
    }

    if (params.min_price) {
      where.ticket_value = {
        [Op.gte]: params.min_price
      }
    }

    if (params.max_price) {
      if (!where.ticket_value) {
        where.ticket_value = {}
      }
      where.ticket_value[Op.lte] = params.max_price;
    }
    
    if (sort == 'Categories') {
      sort = { model: CategoryModel };
      order = 'description';
    }

    // const citie = await db.query('SELECT cities.id, cities.name, states.name AS "States" FROM cities, states WHERE states.id = cities.state_id', { type: QueryTypes.SELECT });

    try {
      const books = await BooksModel.findAll({

        include: [
          {
            model: FormatModel,
            required: false,
            attributes: ['description'],
          },
          {
            model: CategoryModel,
            attributes: ['description'],
            required: false,
          },
          {
            model: PublishersModel,
            required: false,
            attributes: ['name'],
          }],
        where: where,
        limit: limit,
        offset: offset,
        order: [[sort, order]]
      });
      res.json(books);

    } catch (error) {
      console.log(`Erro de ${error}`)
    }

  }

  create = async (req, res, next) => {
    try {
      const data = await this._validateData(req.body);
      const book = await BooksModel.create(data);
      res.json(book);
      await LogsController.create({ action: "BOOK ADD", method: req.method });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  show = async (req, res, next) => {
    const book = await BooksModel.findByPk(req.params.booksId);
    res.json(book);
    // console.log(book)
  }

  update = async (req, res, next) => {
    try {
      console.log(req.params)
      const id = req.params.booksId;
      const data = await this._validateData(req.body, id);
      console.log(data)
      await LogsController.create({ action: "BOOK UPDATE", method: req.method })
      await BooksModel.update(data, {
        where: {
          id: id
        }
      });
      res.json(await BooksModel.findByPk(id));
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  delete = async (req, res, next) => {
    await BooksModel.destroy({
      where: {
        id: req.params.booksId
      }
    });
    res.json({});
    await LogsController.create({ action: "BOOK DELETE", method: req.method })
  }

  _validateData = async (data, id) => {
    // 'PublisherId', 'CategoryId', 'Publisher'
    const attributes = ['title', 'author', 'publication_year', 'page', 'coin', 'value', 'PublisherId', 'CategoryId', 'FormatId'];
    const book = {};

    for (const attribute of attributes) {
      if (!data[attribute]) {
        throw new Error(`The attribute "${attribute}" is required.`);
      }
      book[attribute] = data[attribute];
    }

    if (await this._checkIfEmailExists(book.title, id)) {
      throw new Error(`The book title "${book.title}" already exists.`);
    }

    return book;
  }

  _checkIfEmailExists = async (title, id) => {
    const where = {
      title: title
    };

    if (id) {
      where.id = { [Op.ne]: id }; // WHERE id != id
    }

    const count = await BooksModel.count({
      where: where
    });

    return count > 0;
  }

}

module.exports = new booksController();