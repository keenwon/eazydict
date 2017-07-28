'use strict';

const co = require('co');
const chalk = require('chalk');
const unicons = require('unicons');
const wordbookService = require('./service/wordbook');
const wordbookCli = require('./cli/wordbook');
const {
  loadStart,
  loadSuccess,
  loadFail
} = require('./cli/loader');

/**
 * 保存查询过的单词到生词本
 */
function saveLast(offset = 0) {
  return co(function* () {
    let result = yield wordbookService.saveLast(offset);

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
 * 打开生词本
 */
function open() {
  loadStart();

  return getAll()
    .then(data => {
      if (!data.words.length || !data.histories.length) {
        loadSuccess('暂时没有生词');
        return;
      }

      loadSuccess('Open Wordbook');
      wordbookCli(data);
    }).catch(err => {
      loadFail();
      console.error(err);
    });
}

/**
 * 获取全部生词
 */
function getAll() {
  return wordbookService.getAll(300);
}

module.exports = {
  saveLast,
  open
};
