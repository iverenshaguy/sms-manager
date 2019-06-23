import fs from 'fs';
import { Sequelize } from 'sequelize';
import config from '../config/sequelize';
import logger from '../utils/logger';

const sequelize = new Sequelize(config.url, config);
const database = {};

fs
  .readdirSync(__dirname)
  .filter(file => (file.indexOf('.') !== 0) && (file !== 'index.js'))
  .forEach((file) => {
    /* eslint-disable import/no-dynamic-require */
    /* eslint-disable global-require */
    const model = require(`./${file}`).default.init(sequelize);
    database[model.name] = model;
  });

Object.keys(database).forEach((model) => {
  if (database[model].associate) {
    database[model].associate(database);
  }
});

sequelize
  .authenticate()
  .then(() => {
    logger.info('Connection has been established successfully.');
  })
  .catch((err) => {
    logger.info('Unable to connect to the database:', err);
  });

database.sequelize = sequelize;
database.Sequelize = Sequelize;

export default database;
