'use strict';

const blessed = require('blessed');

/**
 * 创建状态栏
 */
function createStatusBox(count) {
  return blessed.text({
    // eslint-disable-next-line max-len
    content: `  共 ${count} 条 | 退出: Esc、Ctrl-C、q; 删除: d-d {|} {cyan-fg}{bold} Made With Heart by Keenwon{/bold}  `,
    valign: 'middle',
    top: '95%',
    height: '5%',
    tags: true
  });
}

module.exports = createStatusBox;
