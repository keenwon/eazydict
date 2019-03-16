'use strict'

/**
 * 字符串模糊搜索
 */

module.exports = function (keywords, str, fn) {
  let source = str.split('')
  let target = keywords.split('')
  let targetIndex = 0

  if (target.length > source.length) {
    return {
      match: false
    }
  }

  for (let i = 0, j = source.length; i < j; i++) {
    if (source[i] !== target[targetIndex]) {
      continue
    }

    source[i] = fn(source[i])
    targetIndex++
  }

  if (targetIndex >= target.length) {
    return {
      match: true,
      str: source.join('')
    }
  }

  return {
    match: false
  }
}
