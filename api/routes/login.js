const app = require('express').Router();
const cors = require('cors'); //Ajuda na segurança 

const loginController = require('../controllers/LoginController');

app.use(cors());

app.get("/auth", async function(req, res) {

    console.log("Usando o auth")
    res.json(await loginController.validate(req))
})

app.get("/verify", async function(req, res) {

    console.log("Usando o verify")
    let usuario = await  loginController.validate(req)
    res.json(usuario)
})

// router.post('/', loginController);
// // router.post('/create', loginController.create);


module.exports = app;
