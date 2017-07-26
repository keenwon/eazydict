'use strict';

const blessed = require('blessed');

/**
 * 创建 screen
 */
function createScreen() {
  let screen = blessed.screen({
    fullUnicode: true
  });

  screen.title = 'EazyDict Wordbook';

  // 退出快捷键
  screen.key(['escape', 'q', 'C-c'], function () {
    return process.exit(0);
  });

  return screen;
}

/**
 * 创建单词列表窗口
 */
function createWordBox(content) {
  return blessed.box({
    label: ' Words ',
    padding: 1,
    scrollable: true,
    content,
    border: {
      type: 'line',
      fg: 'blue'
    },
    top: '0%',
    height: '95%',
    width: '25%',
    scrollbar: {
      ch: ' ',
      inverse: false
    },
    style: {
      scrollbar: {
        bg: 'blue',
        fg: 'black'
      }
    }
  });
}

/**
 * 创建详情窗口
 */
function createContentBox(title, content) {
  return blessed.box({
    label: ` ${title} `,
    padding: 1,
    scrollable: true,
    content,
    border: {
      type: 'line',
      fg: 'blue'
    },
    top: '0%',
    height: '95%',
    left: '25%',
    width: '75%',
    scrollbar: {
      ch: ' ',
      inverse: false
    },
    style: {
      scrollbar: {
        bg: 'blue',
        fg: 'black'
      }
    }
  });
}

/**
 * 创建状态栏
 */
function createStatusBox() {
  return blessed.text({
    // eslint-disable-next-line max-len
    content: '  共: 1237834 条 | 退出: Esc、Ctrl-C、q {|} {cyan-fg}{bold} Made With Heart by Keenwon{/bold}  ',
    valign: 'middle',
    top: '95%',
    height: '5%',
    tags: true
  });
}

function main() {
  let screen = createScreen();
  let wordsBox = createWordBox();
  let contentBox = createContentBox();
  let statusBox = createStatusBox();

  screen.append(wordsBox);
  screen.append(contentBox);
  screen.append(statusBox);

  screen.render();
}

module.exports = main;

main();
