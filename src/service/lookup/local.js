'use strict';

const historyDao = require('../../dao/HistoryDao');

/**
 * 从本地缓存中查询
 */
function local(words, options) {
  return historyDao.search(words);
}

module.exports = local;
