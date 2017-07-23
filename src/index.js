'use strict';

const co = require('co');
const debug = require('./lib/debug');
const local = require('./dict/local');
const online = require('./dict/online');
const config = require('./lib/config');
const filter = require('./lib/filter');
const historyDao = require('./dao/HistoryDao');
const uxCli = require('./ux/cli');
const {
  start,
  success,
  fail
} = require('./ux/loader');

function eazydict(...argus) {
  let options = argus.slice(-1);
  let words = argus
    .slice(0, -1)
    .map(word => word.trim())
    .join(' ')
    .slice(0, 240); // 限制长度

  debug('words: %s', words);
  debug('options: %O', options);

  co(function* () {
    start();

    let output;
    let outputData;
    let localData = yield local(words);

    // 本地缓存存在，且没有过期
    if (localData && !localData.id) {
      debug('hit local cache');
      outputData = filter(localData);
    } else {
      let onlineData = yield online(words, options);
      let data = {
        words,
        output: onlineData,
        plugins: JSON.stringify(config.enable)
      };

      // 如果本地缓存存在，但是过期，则更新，否则创建
      if (localData && localData.id) {
        debug('hit local cache, but expired');
        yield historyDao.update(localData.id, localData);
      } else {
        debug('No local cache hits');
        yield historyDao.create(data);
      }

      outputData = filter(onlineData);
    }

    output = uxCli(outputData);

    success(words);
    console.log(output);
  }).catch(err => {
    fail();
    console.error(err);
  });
}

module.exports = eazydict;
