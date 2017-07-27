'use strict';

const blessed = require('blessed');
const lookupCli = require('./lookup');

let words;
let histories;

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

  // 切换
  screen.key('tab', function () {
    screen.focusNext();
  });

  return screen;
}

/**
 * 创建单词列表窗口
 */
function createWordBox(list) {
  return blessed.list({
    items: list,
    keys: true,
    vi: true,
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

/**
 * 创建详情窗口
 */
function createContentBox() {
  return blessed.box({
    padding: 1,
    keys: true,
    vi: true,
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
      ch: ' ',
      inverse: false
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

/**
 * 创建状态栏
 */
function createStatusBox(count) {
  return blessed.text({
    // eslint-disable-next-line max-len
    content: `  共: ${count} 条 | 退出: Esc、Ctrl-C、q {|} {cyan-fg}{bold} Made With Heart by Keenwon{/bold}  `,
    valign: 'middle',
    top: '95%',
    height: '5%',
    tags: true
  });
}

function main(data) {
  words = data.words;
  histories = data.histories;

  let wordList = histories.map(history => {
    return history.dataValues.words;
  });

  let screen = createScreen();
  let wordsBox = createWordBox(wordList);
  let contentBox = createContentBox();
  let statusBox = createStatusBox(words.length + 1);

  screen.append(wordsBox);
  screen.append(contentBox);
  screen.append(statusBox);

  // 注册事件
  wordsBox.on('select', (item, index) => {
    let label = item.getText();
    let content = lookupCli(
      histories[index].dataValues.output,
      contentBox.width
    );

    contentBox.setLabel(` ${label} `);
    contentBox.setContent(content);

    screen.render();
  });

  wordsBox.enterSelected(0);
  wordsBox.focus();
  screen.render();
}

module.exports = main;
