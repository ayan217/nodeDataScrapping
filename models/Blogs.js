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
                type: DataTypes.STRING(512), // Use STRING instead of TEXT for indexing
                allowNull: false,
            },
            category: {
                type: DataTypes.STRING(255),
                allowNull: false,
            },
            title: {
                type: DataTypes.TEXT, // TEXT is okay if not indexed
                allowNull: true,
            },
            date: {
                type: DataTypes.STRING(100),
                allowNull: true,
            },
            image: {
                type: DataTypes.TEXT, // Not indexed, so TEXT is fine
                allowNull: true,
            },
            body: {
                type: DataTypes.TEXT('long'), // Long HTML content, not indexed
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
                    fields: ['link', 'category'], // Now both are indexable
                },
            ],
        }
    );

    return Blogs;
};
