'use strict';

const debug = require('./lib/debug');
const co = require('co');
const uxCli = require('./ux/cli');
const local = require('./dict/local');
const online = require('./dict/online');
const config = require('./lib/config');
const historyDao = require('./dao/historyDao');

function getFromLocal(words) {
  return local(words)
    .catch(err => {
      throw err;
    });
}

function getFromOnline(words, options) {
  return online(words, options)
    .catch(err => {
      throw err;
    });
}

function eazydict(...argus) {
  let options = argus.slice(-1);
  let words = argus
    .slice(0, -1)
    .map(word => word.trim())
    .join(' ');

  debug('words: %s', words);
  debug('options: %O', options);

  co(function* () {
    let output;
    let localData = yield getFromLocal(words);

    if (localData) {
      output = uxCli(localData);
    } else {
      let onlineData = yield getFromOnline(words, options);
      yield historyDao.create({
        words,
        output: onlineData,
        plugins: JSON.stringify(config.enable)
      });
      output = uxCli(onlineData);
    }

    console.log(output);
  });
}

module.exports = eazydict;
