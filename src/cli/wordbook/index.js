'use strict';

const blessed = require('blessed');
const chalk = require('chalk');
const lookupCli = require('../lookup');
const wordbookService = require('../../service/wordbook');
const utils = require('../../utils');

let createContentBox = require('./contentBox');
let createScreen = require('./screen');
let createStatusBox = require('./statusBox');
let createWordBox = require('./wordBox');

let words;
let activeWords;

/**
 * 当前单词索引
 */
let index = 0;

/**
 * 内容区域的 offset
 */
let offset = 0;

/**
 * 删除模式
 */
let isDeleteMode = false;

/**
 * 搜索模式
 */
let isSearchMode = false;

/**
 * 搜索关键字
 */
let keywords = '';

let contentBox;
let screen;
let statusBox;
let wordBox;

/**
 * 初始化生词列表
 */
function setWordList() {
  // 过滤单词
  activeWords = words.filter(word => {
    if (!isSearchMode || !keywords) {
      word.coloredValue = word.value;
      return true;
    }

    // 测试匹配，高亮关键字
    let result = utils.fuzzy(keywords, word.value, function (str) {
      return chalk.red(str);
    });

    if (result.match) {
      word.coloredValue = result.str;
    } else {
      word.coloredValue = '';
    }

    return result.match;
  });

  // 生词列表
  let wordList = activeWords.map(word => {
    return word.coloredValue || word.value;
  });

  wordBox.setItems(wordList);
}

/**
 * 显示当前生词
 */
function setContentData() {
  if (activeWords[index]) {
    let label = '';
    let content = '';

    label = ` ${activeWords[index].value} `;
    content = lookupCli(
      activeWords[index].output,
      contentBox.width
    );

    contentBox.setLabel(label);
    contentBox.setContent(content);
  } else {
    contentBox.removeLabel();
    contentBox.setContent('');
  }
}

/**
 * 设置状态栏内容
 */
function setStatusData() {
  let content;

  if (isSearchMode) {
    content = `  ${chalk.blue('退出')}：Eac、Ctrl-C | 请输入关键字: ${keywords}`;
  } else {
    // eslint-disable-next-line max-len
    content = `  共 ${activeWords.length} 条 | ${chalk.blue('退出')}: Esc、Ctrl-C、q; ${chalk.blue('删除')}: d-d; ${chalk.blue('搜索')}: / {|} {cyan-fg}{bold} Made With Heart by Keenwon{/bold}  `;
  }

  statusBox.setContent(content);
}

/**
 * 移动
 */
function move(direction) {
  let _index, length, step;

  if (wordBox.focused) {
    _index = index;
    length = activeWords.length;
    step = wordBox.height - 4;
  } else {
    _index = offset;
    length = contentBox.getScrollHeight();
    step = Math.floor((contentBox.height - 1) / 2);
  }

  switch (direction) {
    case 'up':
      _index--;
      break;
    case 'down':
      _index++;
      break;
    case 'pageup':
      _index = _index - step;
      break;
    case 'pagedown':
      _index = _index + step;
      break;
    default:
      _index++;
      break;
  }

  /**
   * wordList 的 up 和 down 可以循环移动
   * 也就是说移到最后一个，继续按 down 移动到第一个
   */
  /* eslint-disable no-lonely-if */
  if (wordBox.focused && (direction === 'up' || direction === 'down')) {
    if (_index < 0) {
      _index = length + _index;
    } else if (_index >= length) {
      _index = _index - length;
    }
  } else {
    if (_index < 0) {
      _index = 0;
    } else if (_index >= length) {
      _index = length - 1;
    }
  }
  /* eslint-enable no-lonely-if */

  // 设置全局值
  if (wordBox.focused) {
    offset = 0;
    index = _index;

    wordBox.select(index);
    setContentData();
  } else {
    offset = _index;
  }

  contentBox.scrollTo(offset);
  screen.render();
}

/**
 * 删除当前的单词
 */
function deleteWord() {
  // 从 activeWords 找到元素Id
  let id = activeWords[index].id;

  // 从 words 中删除
  let wordsIndex = words.findIndex(item => item.id === id);
  words.splice(wordsIndex, 1);

  setWordList();
  setContentData();
  setStatusData();
  screen.render();

  wordbookService
    .remove(id)
    .catch(err => {
      console.error(err);
    });
}

/**
 * 禁用事件
 */
function disableEvent() {
  Object.keys(screen._events).map(type => {
    if (type.startsWith('key')) {
      delete screen._events[type];
    }
  });
}

/**
 * 设置搜索事件
 */
function bindSearchEvent() {
  disableEvent();

  let letters = utils.getLetters();

  letters.push('backspace');

  // 退出快捷键
  screen.key(['escape', 'C-c'], () => {
    keywords = '';
    init('normal');
  });

  screen.key(letters, (i, key) => {
    if (key.name === 'backspace') {
      keywords = keywords.slice(0, -1);
    } else {
      keywords += key.name;
    }

    init('search');
  });

  bindMoveEvent();
}

/**
 * 设置常规事件
 */
function bindNormalEvent() {
  disableEvent();

  // 退出快捷键
  screen.key(['escape', 'q', 'C-c'], () => {
    return process.exit(0);
  });

  // 删除当前生词
  screen.key('d', () => {
    if (isDeleteMode) {
      deleteWord();
      return;
    }

    isDeleteMode = true;
    setTimeout(() => {
      isDeleteMode = false;
    }, 200);
  });

  // 搜索
  screen.key('/', () => init('search'));

  bindMoveEvent();
}

/**
 * 绑定光标移动事件
 */
function bindMoveEvent() {
  // tab切换
  screen.key(['tab', 'left', 'right'], () => {
    wordBox.focused
      ? contentBox.focus()
      : wordBox.focus();
  });

  // move
  screen.key(['up', 'k'], () => move('up'));
  screen.key(['down', 'j', 'g-g'], () => move('down'));
  screen.key(['pageup', 'C-b'], () => move('pageup'));
  screen.key(['pagedown', 'C-f'], () => move('pagedown'));
}

function init(mode) {
  index = 0;
  offset = 0;
  isSearchMode = mode === 'search';

  setWordList();
  setContentData();
  setStatusData();

  if (mode === 'normal') {
    bindNormalEvent();
  } else {
    bindSearchEvent();
  }

  wordBox.focus();
  wordBox.select(index);
  screen.render();
}

function main(data) {
  words = data;
  activeWords = data;

  screen = createScreen(); // 必须先创建 screen
  contentBox = createContentBox();
  statusBox = createStatusBox();
  wordBox = createWordBox();

  screen.append(wordBox);
  screen.append(contentBox);
  screen.append(statusBox);

  init('normal');
}

module.exports = main;
