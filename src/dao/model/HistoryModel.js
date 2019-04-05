'use strict'

/**
 * 历史记录
 */

const Sequelize = require('sequelize')
const connection = require('../db/connection')

const fields = {
  // 查询的单词&短语
  words: {
    type: Sequelize.STRING
  },

  // 查询次数
  count: {
    type: Sequelize.INTEGER,
    defaultValue: 1
  },

  // 缓存的插件列表
  plugins: {
    type: Sequelize.STRING
  },

  // 缓存查询结果
  output: {
    type: Sequelize.JSON
  },

  // 生成缓存的时间
  cacheAt: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.NOW
  }
}

const options = {
  indexes: [
    {
      fields: ['words']
    },
    {
      fields: [
        {
          attribute: 'count',
          order: 'DESC'
        }
      ]
    },
    {
      fields: [
        {
          attribute: 'updatedAt',
          order: 'DESC'
        }
      ]
    }
  ]
}

const History = connection.define('history', fields, options)

module.exports = function () {
  return History.sync({
    logging: false
  }).then(() => History)
}
