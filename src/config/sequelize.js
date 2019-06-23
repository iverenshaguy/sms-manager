import { config as getEnv } from 'dotenv';

getEnv();

const databaseUrls = {
  development: process.env.DATABASE_URL,
  staging: process.env.DATABASE_URL,
  test: process.env.DATABASE_TEST_URL,
  production: process.env.DATABASE_URL
};

const environment = process.env.NODE_ENV || 'development';
const dialect = 'postgres';
const url = databaseUrls[environment];
const devMode = (environment !== 'production');

const config = {
  url,
  dialect,
  logging: devMode ? log => log : false,
  dialectOptions: {
    multipleStatements: true
  },
};

if (!devMode) {
  config.ssl = true;
  config.dialectOptions.ssl = {
    require: !devMode
  };
}

// does not work with es6 export
module.exports = config;
