'use strict';

/* eslint-disable no-console */

const debug = require('./lib/debug');
const plugins = require('./lib/plugins');
const uxCli = require('./ux/cli');

function main(...argus) {
  let words = argus.slice(0, -1).join(' ');
  let options = argus.slice(-1);

  debug('words: %s', words);
  debug('options: %O', options);

  Promise
    .all(plugins.map(plugin => {
      return plugin(words);
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