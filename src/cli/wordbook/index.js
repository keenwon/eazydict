'use strict';

const blessed = require('blessed');
const lookupCli = require('../lookup');
const wordbookService = require('../../service/wordbook');

let createContentBox = require('./contentBox');
let createScreen = require('./screen');
let createStatusBox = require('./statusBox');
let createWordBox = require('./wordBox');

let words;
let histories;

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

let contentBox;
let screen;
let statusBox;
let wordBox;

/**
 * 初始化生词列表
 */
function setWordList() {
  // 生词列表
  let wordList = histories.map(history => {
    return history.dataValues.words;
  });

  wordBox.setItems(wordList);
}

/**
 * 显示当前生词
 */
function setContentData() {
  let label = histories[index].dataValues.words
  let content = lookupCli(
    histories[index].dataValues.output,
    contentBox.width
  );

  contentBox.setLabel(` ${label} `);
  contentBox.setContent(content);
}

/**
 * 移动
 */
function move(direction) {
  let _index, length, step;

  if (wordBox.focused) {
    _index = index;
    length = words.length;
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
  let word = words.splice(index, 1);
  histories.splice(index, 1);

  setWordList();
  setContentData();
  screen.render();

  let id = word[0].dataValues.id;

  wordbookService
    .remove(id)
    .catch(err => {
      console.error(err);
    });
}

/**
 * 初始化事件
 */
function initEvent() {
  // 退出快捷键
  screen.key(['escape', 'q', 'C-c'], () => {
    return process.exit(0);
  });

  // tab切换
  screen.key('tab', () => {
    wordBox.focused
      ? contentBox.focus()
      : wordBox.focus();
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

  // move
  screen.key(['up', 'k'], () => move('up'));
  screen.key(['down', 'j', 'g-g'], () => move('down'));
  screen.key(['pageup', 'C-b'], () => move('pageup'));
  screen.key(['pagedown', 'C-f'], () => move('pagedown'));
}

function main(data) {
  words = data.words;
  histories = data.histories;

  screen = createScreen(); // 必须先创建 screen
  contentBox = createContentBox();
  statusBox = createStatusBox(words.length);
  wordBox = createWordBox();

  screen.append(wordBox);
  screen.append(contentBox);
  screen.append(statusBox);

  setWordList();
  setContentData();

  initEvent();

  wordBox.focus();

  screen.render();
}

module.exports = main;
