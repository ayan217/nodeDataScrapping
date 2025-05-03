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
                type: DataTypes.STRING(255), 
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: 'BlogLinks',
            freezeTableName: true,
            indexes: [
                {
                    unique: true,
                    fields: ['link'], 
                },
            ],
        }
    );

    return BlogLinks;
};
