'use strict';

const debug = require('./lib/debug');
const co = require('co');
const filter = require('./lib/filter');
const notifier = require('./lib/updateNotifier');
const lookupService = require('./service/lookup');
const lookupCli = require('./cli/lookup');
const {
  loadStart,
  loadSuccess,
  loadFail
} = require('./cli/loader');

/**
 * 单词查询
 */
function lookup(words, options = {}) {
  let raw = options.raw || false;
  let save = options.save || false;

  words = Array.isArray(words) ? words : [words];
  words = words
    .map(word => word.trim())
    .join(' ')
    .slice(0, 240); // 限制长度

  // 大小写转换
  if (!raw) {
    words = words.toLowerCase();
  }

  debug('raw: %s', raw);
  debug('save: %s', save);
  debug('words: %s', words);

  return co(function* () {
    loadStart();

    let data = yield lookupService(words, save);

    // 保存到生词本的信息
    let saveInfo = data.saveInfo || false;

    let outputData = filter(data.output);
    let output = lookupCli(outputData, 0, saveInfo);

    loadSuccess(`Look up "${words}":`);
    console.log(output);

    notifier();
  }).catch(err => {
    loadFail();
    console.error(err);
  });
}

module.exports = lookup;
