'use strict'

const config = require('./config')
const pkg = require('../../package.json')

let plugins = []
const dependencies = Object.keys(pkg.dependencies)
  .filter(d => /^eazydict-.+/.test(d))

/**
 * 根据配置文件刷选启用的 plugin
 */

if (Array.isArray(config.enable)) {
  plugins = config.enable.filter(plugin => {
    return dependencies.includes(plugin)
  })
}

module.exports = plugins
