'use strict'

const blessed = require('blessed')

/**
 * 创建状态栏
 */

function createStatusBox () {
  return blessed.text({
    valign: 'middle',
    top: '95%',
    height: '5%',
    tags: true
  })
}

module.exports = createStatusBox
