'use strict';

const blessed = require('blessed');

/**
 * 创建单词列表窗口
 */
function createWordBox() {
  return blessed.list({
    label: ' Words ',
    padding: 1,
    scrollable: true,
    border: {
      type: 'line',
      fg: 'blue'
    },
    top: '0%',
    height: '95%',
    width: '25%',
    scrollbar: {
      ch: ' '
    },
    style: {
      selected: {
        bg: 'blue'
      },
      scrollbar: {
        bg: 'green'
      },
      focus: {
        border: {
          fg: 'red'
        }
      }
    }
  });
}

module.exports = createWordBox;
