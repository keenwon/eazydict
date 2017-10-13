'use strict';

const co = require('co');
const chalk = require('chalk');
const unicons = require('unicons');
const lookup = require('./lookup');
const config = require('./lib/config');
const historyService = require('./service/history');
const historyCli = require('./cli/history');
const {
  loadStart,
  loadSuccess,
  loadFail
} = require('./cli/loader');

// 缺省情况下的历史记录条数
const defaultHistoryCount = 10;

/**
 * 历史记录
 */
function history() {
  loadStart();

  return co(function* () {
    // 计算历史记录的展示条数
    let historyCount = Number.isInteger(config.historyCount) && config.historyCount >= 0
      ? config.historyCount
      : defaultHistoryCount;

    let data = yield historyService.getHistory(historyCount);

    if (!data || !data.length) {
      loadSuccess('暂无历史记录');
      return;
    }

    let list = data.map((item, i) => {
      let words = item.dataValues.words;
      let updatedTime = item.dataValues.updatedAt;
      let index = i + 1;

      return `${index < 10 ? ' ' + index : index}. ${words}`;
    });

    loadSuccess('历史记录查询成功 \n');

    let answer = yield historyCli(list);
    return lookup(answer.history);
  }).catch(err => {
    loadFail();
    console.error(err);
  });
}

module.exports = history;
