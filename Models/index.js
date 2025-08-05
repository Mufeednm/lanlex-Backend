import { Sequelize } from 'sequelize';
import databaseConfig from '../config/database.js';

const env = process.env.NODE_ENV || 'development';
const config = databaseConfig[env];

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host: config.host,
    dialect: config.dialect,
    port: config.port,
    logging: false // Set to console.log to see SQL queries
  }
);

export default sequelize;