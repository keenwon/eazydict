'use strict';

const co = require('co');
const debug = require('../../lib/debug');
const local = require('./local');
const online = require('./online');
const config = require('../../lib/config');
const historyDao = require('../../dao/HistoryDao');
const wordbookDao = require('../../dao/WordBookDao');

/**
 * 查询单词
 */
function lookup(words, save) {
  return co(function* () {
    let localData = yield local(words);

    /**
     * 本地缓存存在，且没有过期
     * 直接返回缓存数据，true
     */
    if (localData && localData.id && localData.output) {
      debug('hit local cache');

      // 保存生词本
      if (save) {
        yield wordbookDao.save(localData.id);
      }

      return localData.output;
    }

    /**
     * 查询在线数据
     */
    let onlineData = yield online(words);
    let historyId;

    let data = {
      words,
      output: onlineData,
      plugins: JSON.stringify(config.enable)
    };

    // 如果本地缓存存在，但是过期，则更新，否则创建
    if (localData && localData.id) {
      debug('hit local cache, but expired');
      historyId = localData.id;
      yield historyDao.update(localData.id, localData);
    } else {
      debug('No local cache hits');
      let historyData = yield historyDao.create(data);
      historyId = historyData.id;
    }

    // 保存生词本
    if (save) {
      yield wordbookDao.save(historyId);
    }

    return onlineData;
  });
}

module.exports = lookup;
