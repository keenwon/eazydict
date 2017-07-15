'use strict';

const chalk = require('chalk');
const unicons = require('unicons');
const { pad } = require('../lib/utils');

function main(data) {
  let result = ['\n'];

  data.forEach(item => {
    let circle = unicons.cli('circle');
    let pluginName = chalk.blue.bold(item.pluginName);
    let url = chalk.black.underline(item.url);

    result.push(`  ${circle} ${pluginName}   ${url}\n`);
    result.push('\n');

    if (item.phonetics.length) {
      let phoneticLine = '    ';
      item.phonetics.forEach(phonetic => {
        let type = chalk.red(phonetic.type);
        let value = chalk.gray.bold(phonetic.value);

        phoneticLine += `${type} ${value}  `
      });
      result.push(phoneticLine + '\n');
      result.push('\n');
    }

    if (item.translates.length) {
      item.translates.forEach(translate => {
        if (translate.type) {
          let type = chalk.yellow(pad(translate.type, 8));
          let trans = translate.trans;

          result.push(`    ${type} ${trans}\n`);
        } else {
          result.push(`    ${translate.trans}\n`);
        }
      });
      result.push('\n');
    }

  });

  return result.join('');
}

module.exports = main;
