'use strict'

const inquirer = require('inquirer')

module.exports = function (list) {
  return inquirer.prompt({
    type: 'list',
    name: 'history',
    message: '最近查询的十条历史记录，按 Enter 键查看详情：',
    choices: list,
    pageSize: Infinity,
    filter: function (answer) {
      return answer.replace(/^[^.]+\.\s/, '')
    }
  })
}
