'use strict'

const co = require('co')
const lookup = require('./lookup')
const config = require('./lib/config')
const historyService = require('./service/history')
const historyCli = require('./cli/history')
const {
  loadStart,
  loadSuccess,
  loadFail
} = require('./cli/loader')

// 缺省情况下的历史记录条数
const defaultHistoryCount = 10

/**
 * 计算历史记录条数
 * 优先级: 命令行输入 > 配置文件 > 默认值
 */

function getHistoryCount (count) {
  if (Number.isInteger(count) && count >= 0) {
    return count
  } else if (Number.isInteger(config.historyCount) && config.historyCount >= 0) {
    return config.historyCount
  }

  return defaultHistoryCount
}

/**
 * 历史记录
 */

function history (count) {
  loadStart()

  return co(function * () {
    let historyCount = getHistoryCount(+count)
    let data = yield historyService.getHistory(historyCount)

    if (!data || !data.length) {
      loadSuccess('暂无历史记录')
      return
    }

    let list = data.map((item, i) => {
      let words = item.dataValues.words
      let index = i + 1

      return `${index < 10 ? ' ' + index : index}. ${words}`
    })

    loadSuccess('历史记录查询成功 \n')

    let answer = yield historyCli(list)
    return lookup(answer.history)
  }).catch(err => {
    loadFail()
    console.error(err)
  })
}

module.exports = history
