'use strict';

/* eslint-disable no-console */

const debug = require('./lib/debug');
const plugins = require('./lib/plugins');
const uxCli = require('./ux/cli');
const config = require('./lib/config');

function main(...argus) {
  let words = argus.slice(0, -1).join(' ');
  let options = argus.slice(-1);

  debug('words: %s', words);
  debug('options: %O', options);

  if (plugins && !plugins.length) {
    console.log('没有启用任何插件');
    return;
  }

  Promise
    .all(plugins.map(plugin => {
      debug(`load plugin ${plugin} use config: %O`, config.plugins[plugin]);

      // eslint-disable-next-line
      return require(plugin)(words, config.plugins[plugin]);
    }))
    .then(data => {
      let successData = [];

      data.forEach(item => {
        if (item.error.code === 0) {
          successData.push(item);
        } else {
          debug(`${item.pluginName} error: ${item.error.message}`);
        }
      });

      let output = uxCli(successData);
      console.log(output);
    })
    .catch(err => {
      console.error(err);
    });
}

module.exports = main;