'use strict';

const stringWidth = require('string-width');

exports.pad = function (str, width = 10) {
  let padChar = ' ';
  let length = stringWidth(str);

  if (!length || length > width) {
    return str;
  }

  let padStr = padChar.repeat(width - length);

  return `${str}${padStr}`;
};