'use strict';

const historyDao = require('../dao/HistoryDao');

function local(words, options) {
  return historyDao.search(words);
}

module.exports = local;
