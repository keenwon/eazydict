'use strict';

const co = require('co');
const { getRecentList } = require('./dao/HistoryDao');
const wordBookDao = require('./dao/WordBookDao');

/**
 * 保存查询过的单词到生词本
 */
function save(offset = 0) {
  return co(function* () {
    let recentList = yield getRecentList(offset, 1);

    if (!recentList || !recentList.length) {
      console.log('\n还没有查询过任何单词、短语。无法保存到生词本！\n');
      return;
    }

    let data = recentList[0];

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
