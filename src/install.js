'use strict';

const npmi = require('npmi');
const chalk = require('chalk');

function install(pluginName) {
  const options = {
    name: pluginName,
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
