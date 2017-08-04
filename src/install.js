'use strict';

const npmi = require('npmi');

function install(pluginName) {
  const options = {
    name: pluginName,
    forceInstall: false
  };

  npmi(options, function (err, result) {
    if (err) {
      return console.error(err);
    }

    console.log(`${options.name} installed successfully`);
  });
}

module.exports = install;
