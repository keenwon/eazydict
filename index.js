'use strict';

/* eslint-disable no-console */

const plugins = require('./lib/plugins');
const uxCli = require('./ux/cli');

function main(word, options) {
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