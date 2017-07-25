'use strict';

const co = require('co');
const inquirer = require('inquirer');
const eazydict = require('./eazydict');
const { getRecentlyList } = require('./dao/HistoryDao');

let pageSize = 10;

function historyList(list) {
  return inquirer.prompt({
    type: 'list',
    name: 'history',
    message: '最近查询的十条历史记录，按 Enter 建查看：',
    choices: list,
    pageSize,
    filter: function (answer) {
      return answer.replace(/^[^.]+\.\s/, '');
    }
  });
}

function history() {
  return co(function* () {
    let data = yield getRecentlyList(0, pageSize);

    if (!data || !data.length) {
      console.log('\n暂无历史记录!\n');
    }

    let list = data.map((item, i) => {
      let words = item.dataValues.words;
      let updatedTime = item.dataValues.updatedAt;
      let index = i + 1;

      return `${index < 10 ? ' ' + index : index}. ${words}`;
    });

    let answer = yield historyList(list);

    return eazydict(answer.history, null);
  });
}

module.exports = history;
