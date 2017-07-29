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

  return screen;
}

module.exports = createScreen;
