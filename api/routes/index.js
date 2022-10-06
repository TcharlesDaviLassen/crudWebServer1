const cors = require('cors');
const router = require('express').Router();

const users = require('./users');
const login = require('./login');
const cities = require('./cities');
const states = require('./states');
const publishers = require('./publishers');
const books = require('./books');
const categories = require('./categories');
const format = require('./format');
const cadastro = require('./cadastro');

router.use(cors());

router.use(users);
router.use(login);
router.use(cities);
router.use(states);
router.use(publishers);
router.use(books);
router.use(categories);
router.use(format);
router.use(cadastro);


module.exports = router;
