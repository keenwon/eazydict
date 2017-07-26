'use strict';

const co = require('co');
const chalk = require('chalk');
const unicons = require('unicons');
const wordbookService = require('./service/wordbook');

/**
 * 保存查询过的单词到生词本
 */
function save(offset = 0) {
  return co(function* () {
    let result = yield wordbookService.save(offset);

    let icon, message;
    if (result.success) {
      icon = unicons.cli('check');
      message = chalk.green(`  ${icon} ${result.message}`);
    } else {
      icon = unicons.cli('cross');
      message = chalk.red(`  ${icon} ${result.message}`);
    }

    console.log(`\n${message}\n`);
  }).catch(err => {
    console.error(err);
  });
}

/**
 * 获取全部生词
 */
function getAll() {
  wordbookService.getAll(1000)
    .then(data => {
      console.log(data);
    });
}

module.exports = {
  save,
  getAll
};
