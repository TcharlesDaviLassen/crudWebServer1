const { DataTypes, Model } = require('sequelize');
const db = require('../db/indexDB');

class Format extends Model { };

Format.init(
    {
        id:
        {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true
        },
        description:
        {
            type: DataTypes.STRING,
            allowNull: false
        }
    },
    {
        sequelize: db,
        modelName: "Format",
        tableName: "format",

    }
);



// console.log(db === db.models.Format)

module.exports = Format;