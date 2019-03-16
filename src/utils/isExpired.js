'use strict'

const moment = require('moment')

/**
 * 判断时间是否过期
 */

module.exports = function (timeStr, range) {
  let now = moment()
  let cacheTime = moment(new Date(timeStr))
  let result

  try {
    let time = range.slice(0, -1)
    let unit = range.slice(-1)

    result = cacheTime.isBefore(now.subtract(time, unit))
  } catch (err) {
    result = cacheTime.isBefore(now.subtract(2, 'M'))
  }

  return result
}
