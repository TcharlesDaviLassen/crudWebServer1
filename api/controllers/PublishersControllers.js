const { Op } = require('sequelize');

// const db = require('../db/indexDB');

const PublishersModel = require('../models/Publishers');
const CityModel = require('../models/Cities');

const LogsController = require('../models/Logs');
class PublishersController {

  index = async (req, res, next) => {
    
    try {
      const cities = await PublishersModel.findAll({
        include: [{
          model: CityModel,
          required: false,
          attributes: ['id','name']
        }]
      });
  
      res.json(cities);

    } catch (error) {
      console.log(`Erro de ${error}`)
    }
  }

  
  create = async (req, res, next, ) => {
    try {
      console.log(req.body)
      const data = await this._validateData(req.body);
      const publishers = await PublishersModel.create(data);
      res.json(publishers);
      await LogsController.create({ action: "PUBLISHER ADD", method: req.method });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  show = async (req, res, next) => {
    const publishers = await PublishersModel.findByPk(req.params.publishersId);
    res.json(publishers);
  }

  update = async (req, res, next) => {
    try {
      console.log(req.body)
      const id = req.params.publishersId;
      console.log(id);
      const data = await this._validateData(req.body, id);
      await PublishersModel.update(data, {
        where: {
          id: id
        }
      });
      await LogsController.create({ action: "PUBLISHER UPDATE", method: req.method });
      res.json(await PublishersModel.findByPk(id));
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  delete = async (req, res, next) => {
    await PublishersModel.destroy({
      where: {
        id: req.params.publishersId
      }
    });
    await LogsController.create({ action: "PUBLISHER DELETE", method: req.method });
    res.json({});
  }

  _validateData = async (data, id) => {
    const attributes = ['name', 'CityId'];
    const publishers = {};
    for (const attribute of attributes) {
      if (!data[attribute]) {
        throw new Error(`The attribute "${attribute}" is required.`);
      }
      publishers[attribute] = data[attribute];
    }

    if (await this._checkIfEmailExists(publishers.name, id)) {
      throw new Error(`The publisher "${publishers.name}" already exists.`);
    }

    return publishers;
  }

  _checkIfEmailExists = async (name, id) => {
    const where = {
        name: name
    };

    if (id) {
      where.id = { [Op.ne]: id }; // WHERE id != id
    }

    const count = await PublishersModel.count({
      where: where
    });

    return count > 0;
  }

}

module.exports = new PublishersController();