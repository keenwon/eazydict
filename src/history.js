'use strict'

const lookup = require('./lookup')
const config = require('./lib/config')
const historyService = require('./service/history')
const historyCli = require('./cli/history')
const { loadStart, loadSuccess, loadFail } = require('./cli/loader')

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

async function history (count) {
  loadStart()

  try {
    const historyCount = getHistoryCount(+count)
    const data = await historyService.getHistory(historyCount)

    if (!data || !data.length) {
      loadSuccess('暂无历史记录')
      return
    }

    const list = data.map((item, i) => {
      const words = item.dataValues.words
      const index = i + 1

      return `${index < 10 ? ' ' + index : index}. ${words}`
    })

    loadSuccess('历史记录查询成功 \n')

    const answer = await historyCli(list)

    lookup(answer.history)
  } catch (err) {
    loadFail()
    console.error(err)
  }
}

module.exports = history
