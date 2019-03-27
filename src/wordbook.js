'use strict'

const chalk = require('chalk')
const wordbookService = require('./service/wordbook')
const wordbookCli = require('./cli/wordbook')
const { loadStart, loadSuccess, loadFail } = require('./cli/loader')
const { icon } = require('./utils')

/**
 * 保存查询过的单词到生词本
 */

async function saveLast (offset = 0) {
  try {
    let result = await wordbookService.saveLast(offset)

    let message
    if (result.success) {
      message = chalk.green(`  ${icon.check} ${result.message}`)
    } else {
      message = chalk.red(`  ${icon.cross} ${result.message}`)
    }

    console.log(`\n${message}\n`)
  } catch (err) {
    console.error(err)
  }
}

/**
 * 打开生词本
 */

function open () {
  loadStart()

  return wordbookService
    .getAll()
    .then(data => {
      if (!data.words.length || !data.histories.length) {
        loadSuccess('暂时没有生词')
        return
      }

      let words = mergeWordAndHistory(data.words, data.histories)

      loadSuccess('Open Wordbook')
      wordbookCli(words)
    })
    .catch(err => {
      loadFail()
      console.error(err)
    })
}

/**
 * 合并生词和历史，输出到生词本
 */

function mergeWordAndHistory (words, histories) {
  let result = []

  words.forEach((word, index) => {
    let history = histories[index]

    if (!history) {
      return
    }

    result.push(
      Object.assign({}, word.dataValues, {
        value: history.dataValues.words,
        output: history.dataValues.output
      })
    )
  })

  return result
}

module.exports = {
  saveLast,
  open
}
