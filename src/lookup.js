'use strict'

const debug = require('./lib/debug')
const co = require('co')
const moment = require('moment')
const filter = require('./lib/filter')
const notifier = require('./lib/updateNotifier')
const lookupService = require('./service/lookup')
const lookupCli = require('./cli/lookup')
const {
  loadStart,
  loadSuccess,
  loadFail
} = require('./cli/loader')

/**
 * 单词查询
 */

function lookup (words, options = {}) {
  let startTime = Date.now() // 查询开始时间
  let raw = options.raw || false
  let save = options.save || false

  /* eslint-disable no-param-reassign */

  words = Array.isArray(words) ? words : [words]
  words = words
    .map(word => word.trim())
    .join(' ')
    .slice(0, 240) // 限制长度

  // 大小写转换
  if (!raw) {
    words = words.toLowerCase()
  }

  /* eslint-enable no-param-reassign */

  debug('raw: %s', raw)
  debug('save: %s', save)
  debug('words: %s', words)

  return co(function * () {
    loadStart()

    let data = yield lookupService(words, save)

    // 保存到生词本的信息
    let saveInfo = data.saveInfo || false

    let outputData = filter(data.output)
    let output = lookupCli(outputData, 0, saveInfo)
    let endTime = Date.now() // 查询结束时间
    let duration = moment.duration(endTime - startTime).asSeconds() // 耗时

    loadSuccess(`Look up "${words}" in ${duration}s:`)
    console.log(output)

    notifier()
  }).catch(err => {
    loadFail()
    console.error(err)
  })
}

module.exports = lookup
