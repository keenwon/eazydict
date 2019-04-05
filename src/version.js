'use strict'

const plugins = require('./lib/plugins')
const pkg = require('../package.json')

/**
 * 获取 EazyDict 版本信息
 */

function version () {
  console.log('')
  console.log(`  主程序 EazyDict: ${pkg.version}`)

  console.log('')
  console.log('  插件:')
  plugins.forEach(plugin => {
    // eslint-disable-next-line global-require
    const pluginVersion = require(`${plugin}/package.json`).version
    console.log(`    ${plugin}: ${pluginVersion}`)
  })
  console.log('')
}

module.exports = version
