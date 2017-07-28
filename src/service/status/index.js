'use strict';

const debug = require('../../lib/debug');
const co = require('co');
const os = require('os');
const path = require('path');
const fs = require('fs');
const filesize = require('filesize');
const {
  getHistoryCount,
  getLookupCount,
  getWordbookCount
} = require('../../dao/StatusDao');

const home = os.homedir();
const databasePath = path.join(home, '/.eazydict/database.sqlite');

/**
 * 获取数据库大小
 */
function getDatabaseSize() {
  return new Promise((resolve, reject) => {
    fs.stat(databasePath, function (err, data) {
      if (err) {
        debug(err);
        return resolve('未知');
      }

      resolve(filesize(data.size));
    });
  });
}

/**
 * 获取 EazyDict 状态
 */
function getStatus() {
  return co(function* () {
    let [
      historyCount,
      lookupCount,
      workbookCount,
      databaseSize
    ] = yield [
      getHistoryCount(),
      getLookupCount(),
      getWordbookCount(),
      getDatabaseSize()
    ];

    return {
      historyCount,
      lookupCount,
      workbookCount,
      databaseSize
    };
  });
}

module.exports = {
  getStatus
};
