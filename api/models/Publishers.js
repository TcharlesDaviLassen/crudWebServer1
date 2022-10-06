const { DataTypes, Model } = require('sequelize');

const db = require('../db/indexDB');
const Cities = require('./Cities')

class Publishers extends Model { };

Publishers.init(
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
        tableName: 'publishers',
        modelName: 'Publishers',
    }
);

Cities.hasMany(Publishers);
Publishers.belongsTo(Cities);

module.exports = Publishers;