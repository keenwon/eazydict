'use strict'

const debug = require('debug')('eazydict:core:service:status')
const os = require('os')
const path = require('path')
const fs = require('fs')
const filesize = require('filesize')
const { getHistoryCount, getLookupCount } = require('../../dao/HistoryDao')
const { getWordbookCount } = require('../../dao/WordbookDao')

const home = os.homedir()
const databasePath = path.join(home, '/.eazydict/database.sqlite')

/**
 * 获取数据库大小
 */

function getDatabaseSize () {
  return new Promise(resolve => {
    fs.stat(databasePath, function (err, data) {
      if (err) {
        debug(err)
        return resolve('未知')
      }

      resolve(filesize(data.size))
    })
  })
}

/**
 * 获取 EazyDict 状态
 */

async function getStatus () {
  let [historyCount, lookupCount, workbookCount, databaseSize] = await Promise.all([
    getHistoryCount(),
    getLookupCount(),
    getWordbookCount(),
    getDatabaseSize()
  ])

  return {
    historyCount,
    lookupCount,
    workbookCount,
    databaseSize
  }
}

module.exports = {
  getStatus
}
