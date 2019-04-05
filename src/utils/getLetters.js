'use strict'

/**
 * 获取26个英文字母
 */

module.exports = function () {
  const letters = []

  for (let i = 97; i <= 122; i++) {
    letters.push(String.fromCharCode(i))
  }

  return letters
}
