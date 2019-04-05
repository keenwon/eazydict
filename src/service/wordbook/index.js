'use strict'

const { getRecentList, getByIds } = require('../../dao/HistoryDao')
const wordbookDao = require('../../dao/WordbookDao')

const max = 300

/**
 * 保存查询过的单词到生词本
 */

async function saveLast (offset) {
  const recentList = await getRecentList(offset, 1)
  if (!recentList || !recentList.length) {
    return {
      success: false,
      message: '还没有查询过任何单词、短语。无法保存到生词本！'
    }
  }

  const data = recentList[0]

  const canInsert = await _canInsert(data.id)
  if (!canInsert) {
    return {
      success: false,
      message: `生词最多 ${max} 个，请先将已经掌握的生词删除。`
    }
  }

  // 保存生词
  await wordbookDao.save(data.id)

  return {
    success: true,
    message: `已将 "${data.words}" 保存至生词本！`
  }
}

/**
 * 保存生词
 */

async function save (historyId) {
  const canInsert = await _canInsert(historyId)

  if (!canInsert) {
    return {
      success: false,
      message: `生词最多 ${max} 个，请先将已经掌握的生词删除。`
    }
  }

  return wordbookDao.save(historyId)
}

/**
 * 获取全部生词
 */

async function getAll (limit) {
  const words = await wordbookDao.getAll(0, limit)
  const historyIds = words.map(word => {
    return word.dataValues.historyId
  })

  let histories = await getByIds(historyIds)

  histories.sort((a, b) => {
    return historyIds.indexOf(a.id) - historyIds.indexOf(b.id)
  })

  return {
    words,
    histories
  }
}

/**
 * 删除生词
 */

function remove (id) {
  return wordbookDao.remove(id)
}

/**
 * 判断是否还可以添加生词
 */

async function _canInsert (historyId) {
  const count = await wordbookDao.getWordbookCount(historyId)
  return count < max
}

module.exports = {
  save,
  saveLast,
  getAll,
  remove
}
