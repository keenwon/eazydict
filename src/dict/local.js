'use strict';

const historyDao = require('../dao/historyDao');

function local(words, options) {
  return historyDao.search(words);
}

module.exports = local;
