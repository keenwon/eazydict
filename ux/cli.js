'use strict';

const chalk = require('chalk');
const unicons = require('unicons');
const stringBreak = require('string-break');
const cliWidth = require('cli-width');
const { pad } = require('../lib/utils');

const exampleWidth = cliWidth() - 14;

/**
 * 格式化例句
 */
function formatExample() {
  let str = arguments[0];
  let firstLineIndent;
  let indent;

  if (arguments.length === 3) {
    firstLineIndent = arguments[1];
    indent = arguments[2];
  } else {
    firstLineIndent = indent = arguments[1];
  }

  return stringBreak(str, exampleWidth)
    .map((line, index) => {
      return index === 0
        ? firstLineIndent + line
        : indent + line;
    })
    .join('\n');
}

function main(data) {
  let result = [''];
  let count = 0;

  data.forEach(item => {
    let circle = unicons.cli('circle');
    let pluginName = chalk.blue.bold(item.pluginName);
    let url = chalk.black.underline(item.url);

    let hasPhonetics = item.phonetics && item.phonetics.length;
    let hasTranslates = item.translates && item.translates.length;
    let hasExamples = item.examples && item.examples.length

    /**
     * 标题
     */
    if (hasPhonetics || hasTranslates || hasExamples) {
      result.push(`  ${circle} ${pluginName}   ${url}`);
      result.push('');
      count++;
    }

    /**
     * 音标
     */
    if (hasPhonetics) {
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
      result.push(phoneticLine + '');
      result.push('');
    }

    /**
     * 翻译
     */
    if (hasTranslates) {
      item.translates.forEach(translate => {
        let trans = translate.trans;

        if (translate.type) {
          let type = chalk.yellow(pad(translate.type, 8));
          result.push(`    ${type} ${trans}`);
        } else {
          result.push(`    ${trans}`);
        }
      });
      result.push('');
    }

    /**
     * 例句
     */
    if (hasExamples) {
      result.push(`    ${chalk.green('例句:')}`);

      item.examples.forEach(example => {
        let fromFirstLineIndent = `    ${chalk.yellow.bold('+')} `;
        let toFirstLineIndent = `    ${chalk.green.bold('-')} `;
        let indent = '      ';

        let fromStr = formatExample(example.from, fromFirstLineIndent, indent);
        let toStr = formatExample(example.to, toFirstLineIndent, indent);

        result.push('');
        result.push(fromStr);
        result.push(toStr);
      });

      result.push('');
    }
  });

  if (!count) {
    result = ['没有查询到任何结果!'];
  }

  return result.join('\n');
}

module.exports = main;
