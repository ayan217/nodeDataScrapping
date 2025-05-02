const { DataTypes, Model } = require('sequelize');

module.exports = (sequelize) => {
    class Blogs extends Model { }

    Blogs.init(
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            link: {
                type: DataTypes.TEXT,
                allowNull: false,
            },
            category: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            title: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            date: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            image: {
                type: DataTypes.TEXT(),
                allowNull: true,
            },
            body: {
                type: DataTypes.TEXT('long'),
                allowNull: true,
            },
        },
        {
            freezeTableName: true,
            sequelize,
            modelName: 'Blogs',
            indexes: [
                {
                    unique: true,
                    fields: ['link', 'category']
                }
            ]
        }
    );

    return Blogs;
};
