'use strict'

const debug = require('debug')('eazydict:core:lib:config')
const os = require('os')
const path = require('path')
const fs = require('fs-extra')
const yaml = require('js-yaml')

const home = os.homedir()
const defaultConfigFile = path.join(__dirname, '../..', '.eazydict.yml')
const userConfigFile = path.join(home, '.eazydict.yml')

// 创建用户配置
if (!fs.pathExistsSync(userConfigFile)) {
  fs.copySync(defaultConfigFile, userConfigFile)
}

let content = fs.readFileSync(userConfigFile, 'utf-8')
let config = {}
let userConfig

// 解析 yaml
try {
  userConfig = yaml.safeLoad(content)
} catch (err) {
  console.error(err)
  throw new Error(`用户配置文件解析错误: ${userConfigFile}`)
}

debug(`read config from ${userConfigFile}: %O`, userConfig)

// format config
Object.keys(userConfig).forEach(item => {
  let userConfigItem = userConfig[item]

  if (item === 'enable' && Array.isArray(userConfigItem) && userConfigItem.length) {
    config[item] = userConfigItem.map(key => {
      return `eazydict-${key}`
    })
  } else if (item === 'plugins') {
    config.plugins = Object.create(null)

    Object.keys(userConfigItem).forEach(key => {
      config.plugins[`eazydict-${key}`] = userConfigItem[key]
    })
  } else {
    config[item] = userConfig[item]
  }
})

debug('format config: %O', config)

module.exports = config
