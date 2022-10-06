const { DataTypes, Model } = require('sequelize');
// const db = require('../db/indexDB');

class Login extends Model { };

Login.init(
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
            type: DataTypes.STRING,
            allowNull: false
        },
    },
    {
        sequelize: db,
        modelName: "Login",
        tableName: "login",

    },

);

module.exports = Login;

// console.log(db === db.models.Login)
