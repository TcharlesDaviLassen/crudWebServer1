const { DataTypes, Model } = require('sequelize');

const db = require('../db/indexDB');

const State = require('./State')

class Cities extends Model { };

Cities.init(
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
        cep: {
            type: DataTypes.CHAR(9),
            allowNull: true, //false
            // defaultValue: '0000-0000'
        }
        // state_id: {
        //     type: DataTypes.INTEGER,
        //     references: {
        //         model: State,
        //         key: 'id'
        //     }
        // }

    },
    {
        sequelize: db,
        tableName: 'cities',
        modelName: 'Cities',
    }
);

State.hasMany(Cities);
Cities.belongsTo(State);


module.exports = Cities;