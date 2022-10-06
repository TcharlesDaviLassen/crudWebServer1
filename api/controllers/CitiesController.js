const { Op } = require('sequelize');

const axios = require("axios")

const CityModel = require('../models/Cities.js');
// const db = require('../db/indexDB');
const StateModel = require('../models/State.js');

const LogsController = require('../models/Logs');

class CitiesController {

  index = async (req, res, next) => {

    const params = req.query;
    const limit = params.limit || 10;
    const page = params.page || 1;
    const offset = (page - 1) * limit;
    let sort = params.sort || 'id';
    let order = params.order || 'ASC';
    const where = {};


    if (params.name) {
      where.name = {
        [Op.iLike]: `%${params.name}%`
      }
    }

    if (sort == 'Cities') {
      sort = { model: CityModel };
      order = 'name';
    }

    try {
      const cities = await CityModel.findAll({

        include: [{
          model: StateModel,
          required: false,
          attributes: ['name', 'province']
        }],
        where: where,
        limit: limit,
        offset: offset,
        order: [[sort, order]]
      });

      res.json(cities);


    } catch (error) {
      console.log(`Erro de ${error}`)
    }
  }

  create = async (req, res, next) => {
    try {
      // console.log(req.body)
      const data = await this._validateData(req.body);
      const cities = await CityModel.create(data);
      // const loggs = await LogsModel.create()
      // res.json(loggs);
      await LogsController.create({ action: "CITIES ADD", method: req.method });
      res.json(cities);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  show = async (req, res, next) => {
    // console.log(req.body)
    const cities = await CityModel.findByPk(req.params.CitiesId);
    res.json(cities);
  }

  update = async (req, res, next) => {
    try {
      console.log(req.body)
      const id = req.params.CitiesId;
      // console.log(id)
      const data = await this._validateData(req.body, id);
      // console.log(data)
      await CityModel.update(data, {
        where: {
          id: id
        }
      });
      await LogsController.create({ action: "CITIES UPDATE", method: req.method });
      res.json(await CityModel.findByPk(id));
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  delete = async (req, res, next) => {
    await CityModel.destroy({
      where: {
        id: req.params.CitiesId
      }
    });
    await LogsController.create({ action: "CITIES DELETE", method: req.method });
    res.json({});
  }

  _validateData = async (data, id) => {
    const attributes = ['name', 'cep', 'StateId'];
    const cities = {};
    for (const attribute of attributes) {
      if (!data[attribute]) {
        throw new Error(`The attribute "${attribute}" is required.`);
      }
      cities[attribute] = data[attribute];
    }

    if (await this._checkIfEmailExists(cities.cep, id)) {
      throw new Error(`The citie "${cities.cep}" already exists.`);
    }

    // if (await this._checkIfCEPValid(cities.cep)) {
    //   throw new Error(`CEP: "${cities.cep}" does not exist.`);
    // }

    // if (await this._checkIfCEPExist(cities.cep, id)) {
    //   throw new Error(`CEP: "${cities.cep}" is already in use.`);
    // }

    return cities;
  }


  _checkIfEmailExists = async (cep, id) => {
    const where = {
      cep: cep
    };

    if (id) {
      where.id = { [Op.ne]: id }; // WHERE id != id
    }

    const count = await CityModel.count({
      where: where
    });

    return count > 0;
  }


  // _checkIfCEPValid = async (cep) => {
  //   cep = cep.replace(/\D/g, "");
  //   const consultaCep = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);
  //   if (consultaCep.data.erro === 'true') {
  //     return true;
  //   } else {
  //     return false;
  //   }
  // }

  // _checkIfCEPExist = async (cep, id) => {
  //   const where = {
  //     cep: cep,
  //   };

  //   if (id) {
  //     where.id = { [Op.ne]: id }; // WHERE id != id
  //   }

  //   const count = await CityModel.count({
  //     where: where
  //   });

  //   return count > 0;
  // }



}

module.exports = new CitiesController();