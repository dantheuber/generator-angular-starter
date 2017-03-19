'use strict';
var path = require('path');
var assert = require('yeoman-assert');
var helpers = require('yeoman-test');

describe('generator-angular-starter:app', function () {
  before(function () {
    return helpers.run(path.join(__dirname, '../generators/app'))
      .withPrompts({
        name: 'test-app',
        author: 'tester',
        githubUsername: 'tester',
        gitRepo: 'testrepo'
      })
      .toPromise();
  });

  it('creates files', function () {
    assert.file([
      'public/index.html',
       'package.json',
       'webpack.config.js',
       '.bowerrc',
       'bower.json'
    ]);
  });
});
