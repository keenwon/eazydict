'use strict';

/**
 * 生词本
 */

const Sequelize = require('sequelize');
const connection = require('../db/connection');

let fields = {
  // 对应的History ID
  historyId: {
    type: Sequelize.INTEGER
  }
};

let options = {
  tableName: 'wordbook',
  indexes: [
    {
      unique: true,
      fields: ['historyId']
    }
  ]
};

const WordBook = connection.define('wordbook', fields, options);

module.exports = function () {
  return WordBook
    .sync({
      logging: false
    })
    .then(() => WordBook);
};
