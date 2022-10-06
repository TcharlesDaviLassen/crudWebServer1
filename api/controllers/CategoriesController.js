const { Op } = require('sequelize');
const CategoriesModel = require('../models/Categories.js');

const LogsController = require('../models/Logs');
class CategoriesController {

  index = async (req, res, next) => {
    const params = req.query;
    const limit = params.limit || 100;
    const page = params.page || 1;
    const offset = (page - 1) * limit;
    const sort = params.sort || 'id';
    const order = params.order || 'ASC';
    const where = {};

    if (params.description) {
      where.description = {
        [Op.iLike]: `%${params.description}%`
      };
    }

    // if (params.email) {
    //   where.email = {
    //     [Op.iLike]: `%${params.email}%`
    //   };
    // }

    // if (params.min_age) {
    //   where.age = {
    //     [Op.gte]: params.min_age
    //   };
    // }

    // if (params.max_age) {
    //   if (!where.age) {
    //     where.age = {};
    //   }
    //   where.age[Op.lte] = params.max_age;
    // }

    // if (params.sex) {
    //   where.sex = params.sex;
    // }

    const categories = await CategoriesModel.findAll({
      where: where,
      limit: limit,
      offset: offset,
      order: [[sort, order]]
    });
    res.json(categories);
  }

  create = async (req, res, next) => {
    try {
      const data = await this._validateData(req.body);
      const categories = await CategoriesModel.create(data);
      res.json(categories);
      await LogsController.create({ action: "CATEGORY ADD", method: req.method });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  show = async (req, res, next) => {
    const categories = await CategoriesModel.findByPk(req.params.categoriesId);
    res.json(categories);
  }

  update = async (req, res, next) => {
    try {
      const id = req.params.categoriesId;
      console.log(id)
      const data = await this._validateData(req.body, id);
      console.log(data)
      await CategoriesModel.update(data, {
        where: {
          id: id
        }
      });
      res.json(await CategoriesModel.findByPk(id));
      await LogsController.create({ action: "CATEGORY UPDATE", method: req.method });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  delete = async (req, res, next) => {
    await CategoriesModel.destroy({
      where: {
        id: req.params.categoriesId
      }
    });
    await LogsController.create({ action: "CATEGORY DELETE", method: req.method });
    res.json({});
  }

  _validateData = async (data, id) => {
    const attributes = ['description'];
    const categories = {};
    for (const attribute of attributes) {
      if (!data[attribute]) {
        throw new Error(`The attribute "${attribute}" is required.`);
      }
      categories[attribute] = data[attribute];
    }

    if (await this._checkIfEmailExists(categories.description, id)) {
      throw new Error(`The categories with mail address "${categories.description}" already exists.`);
    }

    return categories;
  }

  _checkIfEmailExists = async (description, id) => {
    const where = {
      description: description
    };

    // if (id) {
    //   where.id = { [Op.ne]: id }; // WHERE id != id
    // }

    // const count = await CategoriesModel.count({
    //   where: where
    // });

    // return count > 0;

  }

}

module.exports = new CategoriesController();
