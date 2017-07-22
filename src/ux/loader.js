'use strict';

const ora = require('ora');

function loader(words, time = 500) {
  const spinner = ora('Loading...').start();

  return new Promise(resolve => {
    setTimeout(() => {
      spinner.succeed(`Look up ${words}:`);
      resolve();
    }, time);
  });
}

module.exports = loader;