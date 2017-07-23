'use strict';

const stringWidth = require('string-width');
const moment = require('moment');

exports.pad = function (str, width = 10) {
  let padChar = ' ';
  let length = stringWidth(str);

  if (!length || length > width) {
    return str;
  }

  let padStr = padChar.repeat(width - length);

  return `${str}${padStr}`;
};

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
