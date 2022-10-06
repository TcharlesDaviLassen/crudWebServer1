const { Op } = require('sequelize');
const UserModel = require('../models/User.js');
const LogsController = require('../controllers/LogsController');
const nodemailer = require('nodemailer');
const md5 = require('md5');
const console = require('console');

class UsersController {

  index = async (req, res, next) => {
    const params = req.query;
    const limit = params.limit || 10;
    const page = params.page || 1;
    const offset = (page - 1) * limit;

    const sort = params.sort || 'id';
    const order = params.order || 'ASC';
    const where = {};

    if (params.name) {
      where.name = {
        [Op.iLike]: `%${params.name}%`
      }
    }

    const users = await UserModel.findAll({
      where: where,
      limit: limit,
      offset: offset,
      order: [[sort, order]]
    });
    res.json(users);



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
    //   if (! where.age) {
    //     where.age = {};
    //   }
    //   where.age[Op.lte] = params.max_age;
    // }

    // if (params.sex) {
    //   where.sex = params.sex;
    // }

  }

  create = async (req, res, next) => {
    try {

      req.body.password = (md5(req.body.password))
      this._main(req.body.email);
      const data = await this._validateData(req.body);
      const user = await UserModel.create(data);
      res.json(user);
      await LogsController.create({ action: "USER ADD", method: req.method });

    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  show = async (req, res, next) => {
    const user = await UserModel.findByPk(req.params.userId);
    res.json(user);
  }

  update = async (req, res, next) => {
    try {
      req.body.password = (md5(req.body.password))
      const id = req.params.userId;
      const data = await this._validateData(req.body, id);
      await UserModel.update(data, {
        where: {
          id: id
        }
      });
      res.json(await UserModel.findByPk(id));
      await LogsController.create({ action: "USER UPDATE", date: req.method });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  delete = async (req, res, next) => {
    await UserModel.destroy({
      where: {
        id: req.params.userId
      }
    });
    res.json({});
    await LogsController.create({ action: "USER DELETE", method: req.method });
  }

  _validateData = async (data, id) => {
    // 
    const attributes = ['name', 'age', 'sex', 'email', 'password'];
    const user = {};
    for (const attribute of attributes) {
      if (!data[attribute]) {
        throw new Error(`The attribute "${attribute}" is required.`);
      }
      user[attribute] = data[attribute];
    }

    if (await this._checkIfEmailExists(user.email, id)) {
      throw new Error(`The user with mail address "${user.email}" already exists.`);
    
    } 

    if (await this._checkIfNameExists(user.name, id)) {
      throw new Error(`The user with mail address "${user.name}" already exists.`);
    
    } 




    // if (await this._checkIfEmailExists(user.name, id)) {
    //   throw new Error(`The user with mail address "${user.name}" already exists.`);
    // }

    return user;
  }

  _main = async (email) => {

    let email_user = 'tcharles.lassen@universo.univates.br';
    let email_pass = "TcharlesDavi1896";
    let email_to = await email;
    console.log(email_to);
    let email_subject = "Bem vindo a Biblio";
    let email_content = "Teste email content a biblioteca";
    let email_html ='<h1>Faalaaa Dev</h1><p>Muito bom ter voçê por aqui </P>';
     // <img src="cid:igne_lab_rockedseat"/>
      // attachments: [{
      //   filename: 'igne_lab_rockedseat.png',
      //   path: __dirname+'/igne_lab_rockedseat.png',
      //   cid: 'igne_lab_rockedseat.png' //same cid value as in the html img src
      // }],

    var transponder = nodemailer.createTransport(
      {
        service: "gmail",
        auth: {
          user: email_user,
          pass: email_pass
        }
      }
    )

    var mailOptions = {
      from: email_user,
      to: await email,
      subject: email_subject,
      text: email_content,
      html: email_html,
    };

    transponder.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log("Erro ao enviar o email " + error)
      }
      else {
        console.log("Email enviado " + info.response)
      }
    })
  }

  _checkIfEmailExists = async (email, id) => {
    const where = {
      email: email
    };

    if (id) {
      where.id = { [Op.ne]: id }; // WHERE id != id
    }

    const count = await UserModel.count({
      where: where
    });

    return count > 0;
  }
  
  _checkIfNameExists = async (name, id) => {
    const where = {
      name: name
    };
    console.log(where.id)

    if (id) {
      where.id = { [Op.ne]: id }; // WHERE id != id
    }

    const count = await UserModel.count({
      where: where
      
    });
    return count > 0;
  }


}


module.exports = new UsersController();
