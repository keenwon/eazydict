'use strict';

/* eslint-disable no-console, max-nested-callbacks */

const moment = require('moment');
const {
  pad,
  isExpired,
  fuzzy,
  getLetters,
  arrayContains
} = require('../src/utils');

const mocha = require('mocha');
const chai = require('chai');
chai.should();

describe('Utils 测试', function () {

  describe('# pad 测试', function () {

    let objs = [
      {
        str: 'test',
        width: 6,
        result: 'test  '
      },
      {
        str: '测试',
        width: 6,
        result: '测试  '
      },
      {
        str: 'test测试',
        width: 10,
        result: 'test测试  '
      },
      {
        str: 'test测试',
        result: 'test测试  '
      }
    ];

    objs.forEach((obj) => {
      let title = `test: string ${obj.str}, width: ${obj.width || 'default'}`;

      it(title, function () {
        return pad(obj.str, obj.width)
          .should.equal(obj.result);
      });
    });

  });

  describe('# isExpired 测试', function () {

    let objs = [
      {
        timeStr: moment().subtract(2, 'months').format(),
        range: '3M',
        result: false
      },
      {
        timeStr: moment().subtract(2, 'months').format(),
        range: '1M',
        result: true
      },
      {
        timeStr: moment().subtract(1, 'months').format(),
        result: false
      },
      {
        timeStr: moment().subtract(1, 'minutes').format(),
        range: '1s',
        result: true
      }
    ];

    objs.forEach((obj) => {
      let title = `test: time ${obj.timeStr}, range: ${obj.range || 'default'}`;

      it(title, function () {
        return isExpired(obj.timeStr, obj.range)
          .should.equal(obj.result);
      });
    });

  });

  describe('# fuzzy 测试', function () {

    let objs = [
      {
        keywords: 'foo',
        str: '--f--o--o--',
        result: {
          match: true,
          str: '--<f>--<o>--<o>--'
        }
      },
      {
        keywords: 'foo',
        str: '--o--f--o--o--',
        result: {
          match: true,
          str: '--o--<f>--<o>--<o>--'
        }
      },
      {
        keywords: '',
        str: '--f--o--o--',
        result: {
          match: true,
          str: '--f--o--o--'
        }
      },
      {
        keywords: 'fff',
        str: '--f--o--o--',
        result: {
          match: false
        }
      },
      {
        keywords: 'fooo',
        str: 'foo',
        result: {
          match: false
        }
      }
    ];

    let fn = str => {
      return '<' + str + '>';
    };

    objs.forEach((obj) => {
      let title = `test: keywords ${obj.keywords}, str: ${obj.str}`;

      it(title, function () {
        return fuzzy(obj.keywords, obj.str, fn)
          .should.deep.equal(obj.result);
      });
    });

  });

  describe('# getLetters 测试', function () {

    it('test', function () {
      return getLetters().join('').should
        .equal('abcdefghijklmnopqrstuvwxyz');
    });

  });

  describe('# arrayContains 测试', function () {

    let objs = [
      {
        a: [1, 2, 3],
        b: [1, 2, 3],
        result: true
      },
      {
        a: [1, 2, 3],
        b: [1, 3],
        result: true
      },
      {
        a: [1, 2, 3],
        b: [1, 3, 4],
        result: false
      },
      {
        a: [1, 2, 3],
        b: [9, 3, 4],
        result: false
      },
      {
        a: 1,
        b: [1, 2],
        result: false
      },
      {
        a: [1, 2],
        b: 1,
        result: false
      }
    ];

    objs.forEach((obj) => {
      let title = `test: ${obj.a} contains ${obj.b}`;

      it(title, function () {
        return arrayContains(obj.a, obj.b)
          .should.equal(obj.result);
      });
    });

  });
});