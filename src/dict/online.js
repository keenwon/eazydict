'use strict';

const debug = require('../lib/debug');
const plugins = require('../lib/plugins');
const uxCli = require('../ux/cli');
const loader = require('../ux/loader');
const config = require('../lib/config');

function main(words, options) {
  if (plugins && !plugins.length) {
    console.log('没有启用任何插件');
    return;
  }

  let pluginList = plugins.map(plugin => {
    debug(`load plugin ${plugin} use config: %O`, config.plugins[plugin]);

    // eslint-disable-next-line
    return require(plugin)(words, config.plugins[plugin]);
  });

  return Promise.all(pluginList).then(data => {
    let successData = [];

    data.forEach(item => {
      if (item.error.code !== 0) {
        debug(`${item.pluginName} error: ${item.error.message}`);
      }

      successData.push(item);
    });

    return Promise.resolve(successData);
  });
}

module.exports = main;
