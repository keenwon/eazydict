'use strict'

/**
 * 历史记录
 */

const debug = require('debug')('eazydict:core:dao:history')
const sequelize = require('sequelize')
const { isExpired } = require('../utils')
const config = require('../lib/config')
const HistoryModel = require('./model/HistoryModel')

/**
 * 创建记录
 */

async function create (data) {
  let historyModel = await new HistoryModel()
  return historyModel.create(data)
}

/**
 * 更新
 */

async function update (id, data) {
  // 查询原始数据
  let originData = await _find({
    id
  })

  // 修改数据
  let updateData = Object.assign({}, originData.dataValues, data, {
    count: ++originData.dataValues.count,
    cacheAt: Date.now()
  })

  // 执行更新
  return _update(updateData, { id })
}

/**
 * 搜索
 */

async function search (words) {
  let hitCache = false
  let result

  // 搜索数据
  let data = await _find({ words })

  // 数据存在且未过期的话，count + 1
  if (data && !isExpired(data.dataValues.cacheAt, config.expires)) {
    hitCache = true
    let id = data.dataValues.id
    await _incrementCount(id)
  }

  if (data && !hitCache) {
    // 缓存存在，但是已过期
    result = {
      id: data.id
    }
  } else if (data && hitCache) {
    // 缓存存在，未过期
    result = {
      id: data.id,
      output: data.dataValues.output,
      plugins: JSON.parse(data.dataValues.plugins)
    }
  } else {
    // 缓存不存在
    result = null
  }

  return Promise.resolve(result)
}

/**
 * 获取最近查询的单词列表
 */

async function getRecentList (offset = 0, limit = 10) {
  let historyModel = await new HistoryModel()

  return historyModel.findAll({
    offset,
    limit,
    order: [['updatedAt', 'DESC']]
  })
}

/**
 * 根据Id获取记录
 */

async function getByIds (ids) {
  let historyModel = await new HistoryModel()

  return historyModel.findAll({
    where: {
      id: ids
    }
  })
}

/**
 * 取累计查询的单词数
 */

async function getHistoryCount () {
  let count

  try {
    let historyModel = await new HistoryModel()

    let data = await historyModel.findOne({
      attributes: [[sequelize.fn('COUNT', sequelize.col('id')), 'num']]
    })

    count = data.dataValues.num
  } catch (err) {
    debug(err)
    count = '未知'
  }

  return count
}

/**
 * 取累计查询次数
 */

async function getLookupCount () {
  let count

  try {
    let historyModel = await new HistoryModel()

    let data = await historyModel.findOne({
      attributes: [[sequelize.fn('SUM', sequelize.col('count')), 'num']]
    })

    count = data.dataValues.num
  } catch (err) {
    debug(err)
    count = '未知'
  }

  return count
}

/**
 * 查询
 */

async function _find (where) {
  let historyModel = await new HistoryModel()

  return historyModel.findOne({
    where
  })
}

/**
 * 更新
 */

async function _update (data, where) {
  let historyModel = await new HistoryModel()

  return historyModel.update(data, {
    where
  })
}

/**
 * count + 1
 */

async function _incrementCount (id) {
  let historyModel = await new HistoryModel()

  return historyModel.increment('count', {
    where: {
      id
    }
  })
}

module.exports = {
  create,
  update,
  search,
  getRecentList,
  getByIds,
  getHistoryCount,
  getLookupCount
}
