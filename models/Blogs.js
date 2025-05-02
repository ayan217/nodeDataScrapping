const { DataTypes, Model } = require('sequelize');

module.exports = (sequelize) => {
    class Blogs extends Model {}

    Blogs.init(
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            link: {
                type: DataTypes.STRING(512), 
                allowNull: false,
            },
            category: {
                type: DataTypes.STRING(255),
                allowNull: false,
            },
            title: {
                type: DataTypes.TEXT, 
                allowNull: true,
            },
            date: {
                type: DataTypes.STRING(100),
                allowNull: true,
            },
            image: {
                type: DataTypes.TEXT, 
                allowNull: true,
            },
            body: {
                type: DataTypes.TEXT('long'), 
                allowNull: true,
            },
        },
        {
            sequelize,
            modelName: 'Blogs',
            freezeTableName: true,
            indexes: [
                {
                    unique: true,
                    fields: ['link', 'category'], 
                },
            ],
        }
    );

    return Blogs;
};
