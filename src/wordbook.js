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
      console.log('\n还没有查询过任何单词、短语。无法保存到生词本！\n');
      return;
    }

    let data = recentlyList[0];

    // 保存生词
    yield wordBookDao.save(data.id);

    console.log(`\n已将 "${data.words}" 保存至生词本！\n`);
  }).catch(err => {
    console.error(err);
  });
}

module.exports = {
  save
};
