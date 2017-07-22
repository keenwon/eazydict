'use strict';

const Sequelize = require('sequelize');
const connection = require('../db/connection');

let fields = {
  words: {
    type: Sequelize.STRING
  },
  count: {
    type: Sequelize.INTEGER,
    defaultValue: 1
  },
  plugins: {
    type: Sequelize.STRING
  },
  output: {
    type: Sequelize.JSON
  }
};

let options = {
  indexes: [
    {
      fields: ['words']
    },
    {
      fields: [
        {
          attribute: 'count',
          order: 'DESC'
        }
      ]
    },
    {
      fields: [
        {
          attribute: 'updatedAt',
          order: 'DESC'
        }
      ]
    }
  ]
};

const History = connection.define('history', fields, options);

module.exports = function () {
  return History
    .sync({
      logging: false
    })
    .then(() => History);
};
