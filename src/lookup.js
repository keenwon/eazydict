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
function lookup(...argus) {
  let options = argus.slice(-1);
  let words = argus
    .slice(0, -1)
    .map(word => word.trim())
    .join(' ')
    .slice(0, 240); // 限制长度

  debug('words: %s', words);
  debug('options: %O', options);

  return co(function* () {
    loadStart();

    let lookupData = yield lookupService(words);
    let outputData = filter(lookupData);
    let output = lookupCli(outputData);

    loadSuccess(`Look up "${words}":`);
    console.log(output);

    notifier();
  }).catch(err => {
    loadFail();
    console.error(err);
  });
}

module.exports = lookup;
