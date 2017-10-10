'use strict';

/* eslint-disable max-params */

const chalk = require('chalk');
const unicons = require('unicons');
const stringBreak = require('string-break');
const cliWidth = require('cli-width');
const config = require('../lib/config');
const { pad } = require('../utils');

let windowWidth;

chalk.enabled = typeof config.colorful === 'boolean'
  ? config.colorful
  : true;

/**
 * 高亮关键字
 */
function highlight(str, words) {
  let regexp = new RegExp(words, 'ig');

  return str.replace(regexp, substr => {
    return chalk.red(substr);
  });
}

/**
 * 格式化例句
 */
function formatExample(str, words, firstLineIndent, indent) {
  let exampleWidth = windowWidth - 14;

  // 兼容 windows 上 git-bash 等
  if (exampleWidth <= 0) {
    return firstLineIndent + str;
  }

  return stringBreak(str, exampleWidth)
    .map((line, index) => {
      let highlightLine = highlight(line, words);

      return index === 0
        ? firstLineIndent + highlightLine
        : indent + highlightLine;
    })
    .join('\n');
}

function main(data, width, saveInfo) {
  let result = [''];
  let count = 0;

  windowWidth = width
    ? width
    : cliWidth();

  // 输出翻译信息
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

        let fromStr = formatExample(example.from, item.words, fromFirstLineIndent, indent);
        let toStr = formatExample(example.to, item.words, toFirstLineIndent, indent);

        result.push('');
        result.push(fromStr);
        result.push(toStr);
      });

      result.push('');
    }
  });

  // 输出生词本保存信息
  if (saveInfo) {
    result.push(`  ${chalk.green(unicons.cli('check') + ' 已保存到生词本')}`);
    result.push('');
  }

  if (!count) {
    result = [
      '',
      chalk.red(`  ${unicons.cli('cross')} 没有查询到任何结果!`),
      ''
    ];
  }

  return result.join('\n');
}

module.exports = main;
