'use strict';

const stringWidth = require('string-width');
const moment = require('moment');

/**
 * 根据宽度，在字符串右侧补齐空格
 */
exports.pad = function (str, width = 10) {
  let padChar = ' ';
  let length = stringWidth(str);

  if (!length || length > width) {
    return str;
  }

  let padStr = padChar.repeat(width - length);

  return `${str}${padStr}`;
};

/**
 * 判断时间是否过期
 */
exports.isExpired = function (timeStr, range) {
  let now = moment();
  let cacheTime = moment(new Date(timeStr));
  let result;

  try {
    let time = range.slice(0, -1);
    let unit = range.slice(-1);

    result = cacheTime.isBefore(now.subtract(time, unit));
  } catch (err) {
    result = cacheTime.isBefore(now.subtract(2, 'M'));
  }

  return result;
}

/**
 * 获取26个英文字母
 */
exports.getLetters = function () {
  var letters = [];

  for (let i = 97; i <= 122; i++) {
    letters.push(String.fromCharCode(i));
  }

  return letters;
}

/**
 * 字符串模糊搜索
 */
exports.fuzzy = function (keywords, str, fn) {
  let source = str.split('');
  let target = keywords.split('');
  let targetIndex = 0;

  if (target.length > source.length) {
    return {
      match: false
    };
  }

  for (let i = 0, j = source.length; i < j; i++) {
    if (source[i] !== target[targetIndex]) {
      continue;
    }

    source[i] = fn(source[i]);
    targetIndex++;
  }

  if (targetIndex >= target.length) {
    return {
      match: true,
      str: source.join('')
    };
  }

  return {
    match: false
  };
}
