'use strict';
var proxyquire = require('proxyquire').noCallThru();
var path = require('path');
var assert = require('yeoman-assert');
var helpers = require('yeoman-test');
var mkdirp = require('mkdirp').sync;
var fs = require('fs');
describe('generator-angular-starter:factory', function () {
  before(function () {
    var runContext = helpers.run(path.join(__dirname, '../generators/factory'));
    return runContext
      .inTmpDir(function (dir) {
        // copy folder over for tests to pass
        var tempPath = dir + '/src/tests/';
        mkdirp(tempPath);
        var moduleFile = fs.readFileSync(path.join(__dirname, './static/moduleFile'));
        fs.writeFileSync(tempPath+'index.js', '');
        fs.writeFileSync(tempPath+'tests.module.js', '');
      })
      .withPrompts({
        type: 'controller',
        name: 'TestController',
        module: 'tests'
      })
      .toPromise();
  });

  it('creates files', function () {
    assert.file([
      'src/tests/test.controller.js'
    ]);
  });
});
