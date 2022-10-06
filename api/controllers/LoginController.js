const express = require('express');
const User = require('../models/User');

const cors = require('cors'); //Ajuda na segurança 
const path = require('path');// Lê os pacotes do projeto
const md5 = require('md5');

const app = express();
// app.use(express.static(path.join(__dirname)));//Sem filtro lê todos os pacotes
app.use(express.json());
app.use(cors());


class LoginsController {

    validate = async function authentication(req) {

        let authorization = req.headers.authorization + "";
        console.log("req.headers.authorization")
        console.log(authorization)

        authorization = authorization.replace("Basic", "");
        console.log("authorization")
        console.log(authorization)


        let ascii = Buffer.from(authorization, "base64").toString("ascii");
        let dados = ascii.split(":")

        console.log("Usando o authentication")
        console.log(authorization)

        console.log("DADOS")
        console.log(dados)

        console.log("ascii")
        console.log(ascii)

        let name = dados[0];
        let password = dados[1];
        password = md5(password)

        console.log("username, password");
        console.log(name, password);

        let logado = await User.localizaUsuarios(name, password);
        // console.log(logado.toJSON());
        return logado;

    }

}



// const console = require('console');
// const md5 = require('md5');
// const LogsController = require('../controllers/LogsController');

// const createUser = require('../models/User.js')

// class LoginsController {

//   validate = async (req, res, next) => {
//     req.body.password = md5(req.body.password);

//     let flag = false;

//     for (const user of req.body.data) {

//       if (user.password === req.body.password && user.name === req.body.name) {
//         flag = true;
//         res.send();
//         await LogsController.create({ action: `${user.name} LOGGED`, method: req.method });
//       } else {
//         next()
//       }
//     }
//     if (flag) {
//       res.status(404);
//     }
//   }

//   // create = async (req, res, next) => {
//   //   try {
//   //     req.body.password = md5(req.body.password);

//   //     const datas = await (req);
//   //     const dado = datas.body
//   //     console.log(dado)

//   //     res.json(await createUser.create(dado));
//   //     await LogsController.create({ action: "USER CADASTRADO", method: req.method });
//   //   } catch (error) {
//   //     res.status(400).json({ error });
//   //   }

//   // }


// }

module.exports = new LoginsController();
// module.exports = app;