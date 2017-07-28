'use strict';

const co = require('co');
const { getRecentList, getByIds } = require('../../dao/HistoryDao');
const wordBookDao = require('../../dao/WordBookDao');

/**
 * 保存查询过的单词到生词本
 */
function saveLast(offset) {
  return co(function* () {
    let recentList = yield getRecentList(offset, 1);
    let message;

    if (!recentList || !recentList.length) {
      message = '还没有查询过任何单词、短语。无法保存到生词本！';

      return {
        success: false,
        message
      }
    }

    let data = recentList[0];

    // 保存生词
    yield wordBookDao.save(data.id);

    message = `已将 "${data.words}" 保存至生词本！`;

    return {
      success: true,
      message
    };
  });
}

/**
 * 保存生词
 */
function save(historyId) {
  return wordBookDao
    .save(historyId);
}

/**
 * 获取全部生词
 */
function getAll(limit) {
  return co(function* () {
    let words = yield wordBookDao.getAll(0, limit);
    let historyIds = words.map(word => {
      return word.dataValues.historyId;
    });

    let histories = yield getByIds(historyIds);

    return {
      words,
      histories
    }
  });
}

module.exports = {
  save,
  saveLast,
  getAll
};
