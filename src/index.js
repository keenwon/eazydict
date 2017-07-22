'use strict';

const debug = require('./lib/debug');
const uxCli = require('./ux/cli');
const online = require('./dict/online');

function eazydict(...argus) {
  let words = argus.slice(0, -1).join(' ');
  let options = argus.slice(-1);

  debug('words: %s', words);
  debug('options: %O', options);

  online(words, options)
    .then(data => {
      let output = uxCli(data);
      console.log(output);
    });
}

module.exports = eazydict;