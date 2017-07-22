'use strict';

const debug = require('./lib/debug');
const co = require('co');
const local = require('./dict/local');
const online = require('./dict/online');
const config = require('./lib/config');
const historyDao = require('./dao/historyDao');
const uxCli = require('./ux/cli');
const { start, success, fail } = require('./ux/loader');

function getFromLocal(words) {
  return local(words);
}

function getFromOnline(words, options) {
  return online(words, options);
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
    start();

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

    success(words);
    console.log(output);
  }).catch(err => {
    fail();
    throw err;
  });
}

module.exports = eazydict;
