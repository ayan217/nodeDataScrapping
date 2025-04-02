const { Sequelize } = require('sequelize');
const path = require('path');

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: path.join(__dirname, '../database.sqlite'), 
    logging: false,
});

const AllLinks = require('./AllLinks')(sequelize);

const syncModels = async () => {
    try {
        await sequelize.sync(); 
        console.log('Database synced successfully.');
    } catch (error) {
        console.error('Error syncing database:', error);
    }
};

module.exports = { sequelize, AllLinks, syncModels };
