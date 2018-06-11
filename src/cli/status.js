'use strict';

const Table = require('cli-table3');

module.exports = function (items) {
  let table = new Table({
    colWidths: [20, 20],
    style: {
      border: ['white']
    }
  });

  table.push(...items);

  return table.toString();
}
