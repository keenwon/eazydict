'use strict'

/**
 * 数组 a 包含 b
 */

module.exports = function (a, b) {
  if (!Array.isArray(a) || !Array.isArray(b) ||
    a.length < b.length) {
    return false
  }

  let contains = true

  for (let i = 0, j = b.length; i < j; i++) {
    if (!a.includes(b[i])) {
      contains = false
      break
    }
  }

  return contains
}
