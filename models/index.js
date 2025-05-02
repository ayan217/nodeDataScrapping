const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('ccbusinessreview_blog', 'root', '', {
    host: 'localhost',
    dialect: 'mysql',
    logging: false,
});

const BlogLinks = require('./BlogLinks')(sequelize);
const Blogs = require('./Blogs')(sequelize);

const syncModels = async () => {
    try {
        await sequelize.sync();
        console.log('Database synced successfully.');
    } catch (error) {
        console.error('Error syncing database:', error);
    }
};

module.exports = { sequelize, BlogLinks, Blogs, syncModels };
