'use strict';

const ora = require('ora');
let spinner;

function start() {
  spinner = ora('Loading...').start();
}

function success(words) {
  spinner.succeed(`Look up "${words}":`);
}

function fail() {
  spinner.fail();
}

module.exports = {
  start,
  success,
  fail
};