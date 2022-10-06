const Sequelize = require('sequelize');

const db = new Sequelize(process.env.DB_DATABASE, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: process.env.DB_DIALECT,
});

async function testandoDatabase() {
    try {
        await Sequelize.authenticate();
        console.log('tudo certo')
    } catch (ERRO) {
        console.log(' Erro ' + ERRO)
    }
}
testandoDatabase();
db.sync();
module.exports = db;



