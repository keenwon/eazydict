'use strict';

const blessed = require('blessed');

/**
 * 创建详情窗口
 */
function createContentBox() {
  return blessed.box({
    padding: 1,
    scrollable: true,
    border: {
      type: 'line',
      fg: 'blue'
    },
    top: '0%',
    height: '95%',
    left: '25%',
    width: '75%',
    scrollbar: {
      ch: ' '
    },
    style: {
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

module.exports = createContentBox;
