'use strict';

const co = require('co');
const debug = require('../../lib/debug');
const local = require('./local');
const online = require('./online');
const config = require('../../lib/config');
const utils = require('../../utils');
const historyDao = require('../../dao/HistoryDao');
const wordbookService = require('../wordbook');

/**
 * 查询单词
 */
function lookup(words, save) {
  return co(function* () {
    let localData = yield local(words);
    let saveInfo; // 保存到生词本的结果信息

    debug('local data: %O', localData);

    /**
     * 本地缓存存在，且没有过期，且缓存的插件种类支持已启用的
     * 直接返回缓存数据，true
     */
    if (localData && localData.id && localData.output && localData.plugins
      && utils.arrayContains(localData.plugins, config.enable)) {
      debug('hit local cache');

      // 保存生词本
      if (save) {
        saveInfo = yield wordbookService.save(localData.id);
      }

      return {
        saveInfo,
        output: localData.output
      };
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
      yield historyDao.update(localData.id, data);
    } else {
      debug('No local cache hits');
      let historyData = yield historyDao.create(data);
      historyId = historyData.id;
    }

    // 保存生词本
    if (save) {
      saveInfo = yield wordbookService.save(historyId);
    }

    return {
      saveInfo,
      output: onlineData
    };
  });
}

module.exports = lookup;
