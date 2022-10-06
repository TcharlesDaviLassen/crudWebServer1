const { DataTypes, Model } = require('sequelize');

const db = require('../db/indexDB');

class States extends Model { };

States.init(
    {
        id:
        {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true
        },
        name:
        {
            type: DataTypes.STRING,
            allowNull: false,
        },
        province:
        {
            type: DataTypes.CHAR,
            allowNull: false,
        }

    },
    {
        sequelize: db,
        tableName: 'states',
        modelName: 'States',
    }
);


module.exports = States;