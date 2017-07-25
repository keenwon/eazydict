'use strict';

const co = require('co');
const { getRecentlyList } = require('./dao/HistoryDao');
const wordBookDao = require('./dao/WordBookDao');

/**
 * 保存查询过的单词到生词本
 */
function save(offset = 0) {
  return co(function* () {
    let recentlyList = yield getRecentlyList(offset, 1);

    if (!recentlyList || !recentlyList.length) {
      return true;
    }

    let data = recentlyList[0];

    // 保存生词
    return yield wordBookDao.save(data.id);
  });
}

module.exports = {
  save
};
