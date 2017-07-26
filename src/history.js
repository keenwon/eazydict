'use strict';

const co = require('co');
const chalk = require('chalk');
const unicons = require('unicons');
const lookup = require('./lookup');
const historyService = require('./service/history');
const historyCli = require('./cli/history');

/**
 * 历史记录
 */
function history() {
  return co(function* () {
    let data = yield historyService.getHistory(10);

    if (!data || !data.length) {
      console.log(`\n  ${chalk.green(unicons.cli('check') + ' 暂无历史记录!')}\n`);
      return;
    }

    let list = data.map((item, i) => {
      let words = item.dataValues.words;
      let updatedTime = item.dataValues.updatedAt;
      let index = i + 1;

      return `${index < 10 ? ' ' + index : index}. ${words}`;
    });

    let answer = yield historyCli(list);

    return lookup(answer.history, null);
  }).catch(err => {
    console.error(err);
  });
}

module.exports = history;
