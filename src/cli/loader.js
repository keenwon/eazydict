'use strict';

const ora = require('ora');
let spinner;

function start() {
  spinner = ora('Loading...').start();
}

function success(message = '') {
  spinner.succeed(message);
}

function fail() {
  spinner.fail();
}

module.exports = {
  loadStart: start,
  loadSuccess: success,
  loadFail: fail
};