'use strict';

const os = require('os');
const path = require('path');
const fs = require('fs-extra');
const Sequelize = require('sequelize');

const home = os.homedir();
const storagePath = path.join(home, '.eazydict/database.sqlite');

fs.ensureFileSync(storagePath);

const sequelize = new Sequelize({
  logging: false,
  host: 'localhost',
  dialect: 'sqlite',
  pool: {
    max: 5,
    min: 0,
    idle: 10000
  },
  storage: storagePath
});

module.exports = sequelize;
