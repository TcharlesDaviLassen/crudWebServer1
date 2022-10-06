const { DataTypes, Model } = require('sequelize');
const db = require('../db/indexDB');

class Cadastro extends Model { };

Cadastro.init(
    {
        id:
        {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true
        },
        nome:
        {
            type: DataTypes.STRING,
            allowNull: false,
        },
        senha:
        {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    },
    {
        sequelize: db,
        modelName: "Cadastro",
        tableName: "cadastro",

    }
);



// console.log(db === db.models.Cadastro)

module.exports = Cadastro;