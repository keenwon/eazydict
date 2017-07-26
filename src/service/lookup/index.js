'use strict';

const co = require('co');
const debug = require('../../lib/debug');
const local = require('./local');
const online = require('./online');
const config = require('../../lib/config');
const historyDao = require('../../dao/HistoryDao');

function lookup(words, options) {
  return co(function* () {
    let localData = yield local(words);

    // 本地缓存存在，且没有过期
    if (localData && !localData.id) {
      debug('hit local cache');
      return localData;
    }

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

    return onlineData;
  });
}

module.exports = lookup;
