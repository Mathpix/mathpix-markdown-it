'use strict';
var path     = require('path');
var generate = require('markdown-it-testgen');

/* eslint-env mocha */

describe('Basic', function () {
  var md = require('markdown-it')()
              .use(require('../'));
  generate(path.join(__dirname, 'fixtures/basic.txt'), md);
});

describe('Requirements', function () {
  var md = require('markdown-it')()
              .use(require('../'));
  generate(path.join(__dirname, 'fixtures/requirements.txt'), md);
});

describe('Other Notes', function () {
  var md = require('markdown-it')()
              .use(require('../'));
  generate(path.join(__dirname, 'fixtures/notes.txt'), md);
});

describe('Issues', function () {
  var md = require('markdown-it')()
              .use(require('../'));
  generate(path.join(__dirname, 'fixtures/issues.txt'), md);
});

describe('(optional) Multilines', function () {
  var md = require('markdown-it')()
              .use(require('../'), { enableMultilineRows: true });
  generate(path.join(__dirname, 'fixtures/multilines.txt'), md);
});

describe('(optional) Rowspans', function () {
  var md = require('markdown-it')()
              .use(require('../'), { enableMultilineRows: true, enableRowspan: true });
  generate(path.join(__dirname, 'fixtures/rowspan.txt'), md);
});
