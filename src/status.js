'use strict'

const { getStatus } = require('./service/status')
const statusCli = require('./cli/status')
const {
  loadStart,
  loadSuccess,
  loadFail
} = require('./cli/loader')

/**
 * 获取 EazyDict 状态
 */

function status () {
  loadStart()

  return getStatus().then(state => {
    let items = [
      ['查询单词个数', state.historyCount],
      ['累计查询次数', state.lookupCount],
      ['生词数', state.workbookCount],
      ['数据库大小', state.databaseSize]
    ]

    loadSuccess('load success:')
    let output = statusCli(items)

    console.log('')
    console.log(output)
    console.log('')
  }).catch(err => {
    loadFail()
    console.error(err)
  })
}

module.exports = status
