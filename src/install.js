'use strict';

const path = require('path');
const npmi = require('npmi');
const chalk = require('chalk');

const nodeModulesPath = path.join(__dirname, '..');

function install(pluginName) {
  const options = {
    name: pluginName,
    path: nodeModulesPath,
    forceInstall: true
  };

  npmi(options, function (err, result) {
    if (err) {
      return console.error(err.stack);
    }

    let message = chalk.green(`${options.name} installed successfully`);
    console.log(`\n${message}\n`);
  });
}

module.exports = install;
