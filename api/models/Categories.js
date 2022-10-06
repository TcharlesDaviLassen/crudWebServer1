const { DataTypes, Model } = require('sequelize');
const db = require('../db/indexDB');

class Categories extends Model { };

Categories.init(
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
            allowNull: false,
        }
    },
    {
        sequelize: db,
        modelName: "Categories",
        tableName: "categories",

    }
);
module.exports = Categories;