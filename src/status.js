'use strict';

const Table = require('cli-table2');
const { getStatus } = require('./service/status');

/**
 * 获取 EazyDict 状态
 */
function status() {
  return getStatus().then(state => {
    let table = new Table({
      colWidths: [30, 30]
    });

    table.push(
      ['查询单词数', state.historyCount],
      ['查询数', state.lookupCount],
      ['生词数', state.workbookCount],
      ['数据库大小', state.databaseSize]
    );

    console.log(table.toString());
    console.log('');
  }).catch(err => {
    console.error(err);
  });
}

module.exports = status;
