const { Op } = require('sequelize');
const CadastroModel = require('../models/Cadastro');

const LogsController = require('../models/Logs');

class CadastroController {

  index = async (req, res, next) => {
    const params = req.query;
    const limit = params.limit || 100;
    const page = params.page || 1;
    const offset = (page - 1) * limit;
    const sort = params.sort || 'id';
    const order = params.order || 'ASC';
    const where = {};

    if (params.nome) {
      where.name = {
        [Op.iLike]: `%${params.nome}%`
      };
    }

    if (params.senha) {
      where.senha = {
        [Op.iLike]: `%${params.senha}%`
      };
    }

    // if (params.min_age) {
    //   where.age = {
    //     [Op.gte]: params.min_age
    //   };
    // }

    // if (params.max_age) {
    //   if (! where.age) {
    //     where.age = {};
    //   }
    //   where.age[Op.lte] = params.max_age;
    // }

    // if (params.sex) {
    //   where.sex = params.sex;
    // }

    const login = await CadastroModel.findAll({
      where: where,
      limit: limit,
      offset: offset,
      order: [ [sort, order] ]
    });
    res.json(login);
  }

  create = async (req, res, next) => {
    try {
      const data = await this._validateData(req.body);
      const login = await CadastroModel.create(data);
      res.json(login);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  show = async (req, res, next) => {
    const login = await CadastroModel.findByPk(req.params.cadastroId);
    res.json(login);
  }

  update = async (req, res, next) => {
    try {
      const id = req.params.cadastroId;
      const data = await this._validateData(req.body, id);
      await CadastroModel.update(data, {
        where: {
          id: id
        }
      });
      res.json(await CadastroModel.findByPk(id));
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  delete = async (req, res, next) => {
    await CadastroModel.destroy({
      where: {
        id: req.params.cadastroId
      }
    });
    res.json({});
  }

  _validateData = async (data, id) => {
    const attributes = ['nome', 'senha'];
    const login = {};
    for (const attribute of attributes) {
      if (! data[attribute]){
        throw new Error(`The attribute "${attribute}" is required.`);
      }
      login[attribute] = data[attribute];
    }

    if (await this._LogincheckIfNamePasswordExists(login.nome, id)) {
      throw new Error(`The cadastro with address "${login.nome}" already exists.`);
    }

    return login;
  }


  _LogincheckIfNamePasswordExists = async (nome, id) => {
    const where = {
      nome: nome
    };

    if (id) {
      where.id = { [Op.ne]: id }; // WHERE id != id
    }

    const count = await CadastroModel.count({
      where: where
    });

    return count > 0;

  }

  // _checkIfEmailExists = async (nome, id) => {
  //   const where = {
  //     nome: nome
  //   };

  //   if (id) {
  //     where.id = { [Op.ne]: id }; // WHERE id != id
  //   }

  //   const count = await CadastroModel.count({
  //     where: where
  //   });

  //   return count > 0;
  // }

}

module.exports = new CadastroController();
