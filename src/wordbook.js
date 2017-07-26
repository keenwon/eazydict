'use strict';

const co = require('co');
const chalk = require('chalk');
const unicons = require('unicons');
const { getRecentList, getByIds } = require('./dao/HistoryDao');
const wordBookDao = require('./dao/WordBookDao');

/**
 * 保存查询过的单词到生词本
 */
function save(offset = 0) {
  return co(function* () {
    let recentList = yield getRecentList(offset, 1);
    let message;

    if (!recentList || !recentList.length) {
      message = `${unicons.cli('cross')} 还没有查询过任何单词、短语。无法保存到生词本！`;
      console.log(`\n  ${chalk.red(message)}\n`);
      return;
    }

    let data = recentList[0];

    // 保存生词
    yield wordBookDao.save(data.id);

    message = `${unicons.cli('check')} 已将 "${data.words}" 保存至生词本！`;
    console.log(`\n  ${chalk.green(message)}\n`);
  }).catch(err => {
    console.error(err);
  });
}

/**
 * 获取全部生词
 */
function getAll() {
  return co(function* () {
    let wordArray = yield wordBookDao.getAll(0, 1000);
    let historyIds = wordArray.map(item => {
      return item.dataValues.historyId;
    });

    let historyArray = yield getByIds(historyIds);
  });
}

module.exports = {
  save,
  getAll
};

getAll();
