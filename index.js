'use strict';

/* eslint-disable no-console */

const debug = require('./lib/debug');
const plugins = require('./lib/plugins');
const uxCli = require('./ux/cli');

function main(word, options) {
  debug('word: %s', word);
  debug('options: %O', options);

  Promise
    .all(plugins.map(plugin => {
      return plugin(word);
    }))
    .then(data => {
      let output = uxCli(data);
      console.log(output);
    });
}

module.exports = main;