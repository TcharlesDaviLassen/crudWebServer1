const { DataTypes, Model } = require('sequelize');
const db = require('../db/indexDB');

class Logs extends Model { };

Logs.init(
    {
        id:
        {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true
        },
        action:
        {
            type: DataTypes.STRING,
            allowNull: false,
        },
        method:
        {
            type: DataTypes.STRING,
            allowNull: false
        },
    },
    {
        sequelize: db,
        modelName: "Logs",
        tableName: "logs",

    },

);

module.exports = Logs;

console.log(db === db.models.Login)