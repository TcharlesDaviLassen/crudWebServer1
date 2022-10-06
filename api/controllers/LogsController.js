const { Op } = require('sequelize');
const LogModel = require('../models/Logs');

class LogsController {

  index = async (req, res, next) => {
    const logs = await LogModel.findAll({});
    res.json(logs);
  }

  create = async (req, res, next) => {
    try {
      await LogModel.create(req);
    } catch (error) {
      res.status(400).json({ error: error.message });
      // res.json({error : error.message})
    }
  }

  _validateData = async (data, id) => {
    const attributes = ['action', 'method'];
    const log = {};
    for (const attribute of attributes) {
      log[attribute] = data[attribute];
    }
    return log;
  }

}

module.exports = new LogsController();