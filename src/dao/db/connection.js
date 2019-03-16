'use strict'

const os = require('os')
const path = require('path')
const fs = require('fs-extra')
const Sequelize = require('sequelize')

const home = os.homedir()
const storagePath = path.join(home, '.eazydict/database.sqlite')

// 确保 sqlite 数据库文件存在
fs.ensureFileSync(storagePath)

const sequelize = new Sequelize({
  logging: false,
  host: 'localhost',
  dialect: 'sqlite',
  pool: {
    max: 5,
    min: 0,
    idle: 10000
  },
  storage: storagePath,
  operatorsAliases: false
})

module.exports = sequelize
