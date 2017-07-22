'use strict';

const co = require('co');
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
 * 搜索
 */
function search(words) {
  return co(function* () {
    let history = yield historyModel;

    let data = yield history.findOne({
      where: {
        words
      }
    });

    if (data) {
      let id = data.dataValues.id;
      yield _incrementCount(id);
    }

    let result = data
      ? data.dataValues.output
      : null;

    return Promise.resolve(result);
  });
}

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
  search
};
