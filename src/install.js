'use strict'

const path = require('path')
const npmi = require('npmi')
const chalk = require('chalk')

const nodeModulesPath = path.join(__dirname, '..')

function install (pluginName) {
  const options = {
    name: pluginName,
    path: nodeModulesPath,
    forceInstall: true
  }

  npmi(options, function (err) {
    if (err) {
      return console.error(err.stack)
    }

    const message = chalk.green(`${options.name} installed successfully`)
    console.log(`\n${message}\n`)
  })
}

module.exports = install
