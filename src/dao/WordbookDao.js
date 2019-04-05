'use strict'

/**
 * 生词本
 */

const debug = require('debug')('eazydict:core:dao:wordbook')
const sequelize = require('sequelize')
const WordbookModel = require('./model/WordbookModel')

/**
 * 保存生词
 */

async function save (historyId) {
  try {
    const wordbookModel = await new WordbookModel()

    await wordbookModel.create({
      historyId
    })
  } catch (error) {
    // historyId 已存在的话，忽略
    if (error.name !== 'SequelizeUniqueConstraintError') {
      throw error
    }
  }

  return true
}

/**
 * 删除生词
 */

async function remove (id) {
  const wordbookModel = await new WordbookModel()

  await wordbookModel.destroy({
    where: {
      id
    }
  })

  return true
}

/**
 * 获取生词
 */

async function getAll (offset = 0, limit = 100) {
  const wordbookModel = await new WordbookModel()

  return wordbookModel.findAll({
    offset,
    limit,
    order: [['id', 'DESC']]
  })
}

/**
 * 取生词数
 *
 * 如果 historyId 存在，计算除了 historyId 之外的数，
 * 也就是即使达到上限，也可以添加已经添加过的词
 */

async function getWordbookCount (historyId) {
  let count

  try {
    const wordbookModel = await new WordbookModel()
    const findOptions = {
      attributes: [[sequelize.fn('COUNT', sequelize.col('id')), 'num']]
    }

    if (typeof historyId === 'number') {
      findOptions.where = {
        historyId: {
          [sequelize.Op.ne]: historyId
        }
      }
    }

    const data = await wordbookModel.findOne(findOptions)

    count = data.dataValues.num
  } catch (err) {
    debug(err)
    count = '未知'
  }

  return count
}

module.exports = {
  save,
  remove,
  getAll,
  getWordbookCount
}
