'use strict';

const debug = require('./lib/debug');
const co = require('co');
const local = require('./dict/local');
const online = require('./dict/online');
const config = require('./lib/config');
const filter = require('./lib/filter');
const historyDao = require('./dao/historyDao');
const uxCli = require('./ux/cli');
const { start, success, fail } = require('./ux/loader');

function getFromLocal(words) {
  return local(words);
}

function getFromOnline(words, options) {
  return online(words, options);
}

function create(data) {
  return historyDao.create(data);
}

function update(id, data) {
  return historyDao.update(id, data);
}

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
    let localData = yield getFromLocal(words);

    // 本地缓存存在，且没有过期
    if (localData && !localData.id) {
      debug('hit local cache');
      outputData = filter(localData);
    } else {
      let onlineData = yield getFromOnline(words, options);
      let data = {
        words,
        output: onlineData,
        plugins: JSON.stringify(config.enable)
      };

      // 如果本地缓存存在，但是过期，则更新，否则创建
      if(localData && localData.id) {
        debug('hit local cache, but expired');
        yield update(localData.id, localData);
      } else {
        debug('No local cache hits');
        yield create(data);
      }

      outputData = filter(onlineData);
    }

    output = uxCli(outputData);

    success(words);
    console.log(output);
  }).catch(err => {
    fail();
    throw err;
  });
}

module.exports = eazydict;
