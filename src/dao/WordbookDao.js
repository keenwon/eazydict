'use strict'

/**
 * 生词本
 */

const debug = require('../lib/debug')
const co = require('co')
const sequelize = require('sequelize')
const WordbookModel = require('./model/WordbookModel')

/**
 * 保存生词
 */

function save (historyId) {
  return co(function * () {
    let wordbookModel = yield new WordbookModel()

    yield wordbookModel.create({
      historyId
    })

    return true
  }).catch(error => {
    // historyId 已存在的话，忽略
    if (error.name === 'SequelizeUniqueConstraintError') {
      return true
    }

    throw error
  })
}

/**
 * 删除生词
 */

function remove (id) {
  return co(function * () {
    let wordbookModel = yield new WordbookModel()

    yield wordbookModel.destroy({
      where: {
        id
      }
    })

    return true
  })
}

/**
 * 获取生词
 */

function getAll (offset = 0, limit = 100) {
  return co(function * () {
    let wordbookModel = yield new WordbookModel()
    return yield wordbookModel.findAll({
      offset,
      limit,
      order: [
        ['id', 'DESC']
      ]
    })
  })
}

/**
 * 取生词数
 *
 * 如果 historyId 存在，计算除了 historyId 之外的数，
 * 也就是即使达到上限，也可以添加已经添加过的词
 */

function getWordbookCount (historyId) {
  return co(function * () {
    let wordbookModel = yield new WordbookModel()
    let findOptions = {
      attributes: [
        [sequelize.fn('COUNT', sequelize.col('id')), 'num']
      ]
    }

    if (typeof historyId === 'number') {
      findOptions.where = {
        historyId: {
          [sequelize.Op.ne]: historyId
        }
      }
    }

    let data = yield wordbookModel.findOne(findOptions)

    return data.dataValues.num
  }).catch(err => {
    debug(err)
    return '未知'
  })
}

module.exports = {
  save,
  remove,
  getAll,
  getWordbookCount
}
