'use strict';

const co = require('co');
const { isExpired } = require('../lib/utils');
const config = require('../lib/config');
const HistoryModel = require('./model/HistoryModel');
const historyModel = new HistoryModel();

/**
 * 创建记录
 */
function create(data) {
  return historyModel.then(history => {
    return history.create(data);
  });
}

/**
 * 更新
 */
function update(id, data) {
  return co(function* () {
    let originData = yield _find({
      id
    });

    let updateData = Object.assign({}, originData.dataValues, data, {
      count: ++originData.dataValues.count,
      cacheAt: Date.now()
    })

    return yield _update(updateData, { id });
  });
}

/**
 * 搜索
 */
function search(words) {
  return co(function* () {
    let history = yield historyModel;
    let hitCache = false;
    let result;

    let data = yield _find({ words });

    if (data && !isExpired(data.dataValues.cacheAt, config.expires)) {
      hitCache = true;
      let id = data.dataValues.id;
      yield _incrementCount(id);
    }

    if (data && !hitCache) {
      // 缓存存在，但是已过期
      result = {
        id: data.id
      };
    } else if (data && hitCache) {
      // 缓存存在，未过期
      result = data.dataValues.output;
    } else {
      // 缓存不存在
      result = null;
    }

    return Promise.resolve(result);
  });
}

/**
 * 查询
 */
function _find(where) {
  return historyModel.then(history => {
    return history.findOne({
      where
    });
  });
}

/**
 * 更新
 */
function _update(data, where) {
  return historyModel.then(history => {
    return history.update(data, {
      where
    });
  });
}

/**
 * count + 1
 */
function _incrementCount(id) {
  return historyModel.then(history => {
    return history.increment('count', {
      where: {
        id
      }
    });
  });
}

module.exports = {
  create,
  update,
  search
};
