const { DataTypes, Model } = require('sequelize');

module.exports = (sequelize) => {
    class AllLinks extends Model {}

    AllLinks.init(
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
            modelName: 'AllLinks',
        }
    );

    return AllLinks;
};
