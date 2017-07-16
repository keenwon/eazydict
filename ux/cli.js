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

    /**
     * 标题
     */
    result.push(`  ${circle} ${pluginName}   ${url}\n`);
    result.push('\n');

    /**
     * 音标
     */
    if (item.phonetics && item.phonetics.length) {
      let phoneticLine = '    ';
      item.phonetics.forEach(phonetic => {
        let value = chalk.gray.bold(phonetic.value);

        if (phonetic.type) {
          let type = chalk.red(phonetic.type);
          phoneticLine += `${type} ${value}  `;
        } else {
          phoneticLine += `${value}  `;
        }
      });
      result.push(phoneticLine + '\n');
      result.push('\n');
    }

    /**
     * 翻译
     */
    if (item.translates && item.translates.length) {
      item.translates.forEach(translate => {
        let trans = translate.trans;

        if (translate.type) {
          let type = chalk.yellow(pad(translate.type, 8));
          result.push(`    ${type} ${trans}\n`);
        } else {
          result.push(`    ${trans}\n`);
        }
      });
      result.push('\n');
    }

    /**
     * 例句
     */
    if (item.examples && item.examples.length) {
      result.push(`    ${chalk.green('例句:')}\n`);

      item.examples.forEach(example => {
        result.push('\n');
        result.push(`    ${chalk.green.bold('-')} ${example.from}\n`);
        result.push(`      ${example.to}\n`);
      });

      result.push('\n');
    }
  });

  return result.join('');
}

module.exports = main;
