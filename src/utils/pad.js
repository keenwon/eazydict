'use strict'

const stringWidth = require('string-width')

/**
 * 根据宽度，在字符串右侧补齐空格
 */

module.exports = function (str, width = 10) {
  let padChar = ' '
  let length = stringWidth(str)

  if (!length || length > width) {
    return str
  }

  let padStr = padChar.repeat(width - length)

  return `${str}${padStr}`
}
