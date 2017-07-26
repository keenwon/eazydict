'use strict';

const historyDao = require('../../dao/HistoryDao');

/**
 * 获取历史记录
 */
exports.getHistory = function (pageSize) {
  return historyDao.getRecentList(0, pageSize);
}
