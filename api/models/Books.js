const { DataTypes, Model } = require('sequelize');

const db = require('../db/indexDB');

const Publishers = require('./Publishers.js')
const Categories = require('./Categories.js')
const Format = require('./Format.js')

class Books extends Model { };

Books.init(
    {
        id:
        {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true
        },
        title:
        {
            type: DataTypes.STRING,
            allowNull: false,
        },
        author:
        {
            type: DataTypes.STRING,
            allowNull: false,
        },
        publication_year:
        {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        coin:{
            type: DataTypes.STRING,
            allowNull: false,
        },
        value:{
            type: DataTypes.DECIMAL(10,2),
            allowNull: false,
        },
        page:
        {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        
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
        tableName: 'books',
        modelName: 'Books',
    }
);

Publishers.hasMany(Books);
Books.belongsTo(Publishers);

Categories.hasMany(Books);
Books.belongsTo(Categories);

Format.hasMany(Books);
Books.belongsTo(Format);


module.exports = Books;