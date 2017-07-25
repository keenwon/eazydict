'use strict';

const lint = require('mocha-eslint');

let paths = [
  'index.js',
  'src/**/*.js',
  'test/**/*.js',
  'bin/cli'
];

let options = {
  formatter: 'compact',
  alwaysWarn: false,
  timeout: 5000,
  slow: 1000,
  strict: true
};

lint(paths, options);