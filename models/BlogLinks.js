const { DataTypes, Model } = require('sequelize');

module.exports = (sequelize) => {
    class BlogLinks extends Model {}

    BlogLinks.init(
        {
            id: {
                type: DataTypes.INTEGER,
                autoIncrement: true,
                primaryKey: true,
            },
            link: {
                type: DataTypes.STRING,
                allowNull: false,
            },
        },
        {
            freezeTableName: true,
            sequelize,
            modelName: 'BlogLinks',
        }
    );

    return BlogLinks;
};
