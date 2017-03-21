'use strict';

var path = require('path');
var gulp = require('gulp');
var nsp = require('gulp-nsp');
var util = require('gulp-util');
var exec = require('gulp-exec');
var mocha = require('gulp-mocha');
var eslint = require('gulp-eslint');
var plumber = require('gulp-plumber');
var connect = require('gulp-connect');
var istanbul = require('gulp-istanbul');
var excludeGitignore = require('gulp-exclude-gitignore');
var templateCache = require('gulp-angular-templatecache');
var templateHeader = '/* DO NOT MODIFY, GENERATED VIA GULP */\r\n"use strict";\r\nmodule.exports = "<%%= module %>";\r\nangular.module("<%%= module %>"<%%= standalone %>).run(["$templateCache", function($templateCache) {';

gulp.task('lint', function () {
  return gulp.src(['src/**/*.js', '!src/index.js', '!src/templates.js'])
    .pipe(excludeGitignore())
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

gulp.task('nsp', function (cb) {
  nsp({package: path.resolve('package.json')}, cb);
});

gulp.task('pre-test', ['nsp'], function () {
  return gulp.src(['src/**/*.js', '!src/**/*.module.js', '!src/index.js'])
    .pipe(excludeGitignore())
    .pipe(istanbul({
      includeUntested: true
    }))
    .pipe(istanbul.hookRequire());
});

gulp.task('test', ['pre-test'], function (cb) {
  var mochaErr;

  gulp.src('test/**/*.js')
    .pipe(plumber())
    .pipe(mocha({reporter: 'spec'}))
    .on('error', function (err) {
      mochaErr = err;
    })
    .pipe(istanbul.writeReports())
    .on('end', function () {
      cb(mochaErr);
    });
});

gulp.task('connect', function () {
  connect.server({
    root: 'public',
    livereload: true
  });
});

gulp.task('templates', function () {
  return gulp.src('src/**/*.html')
    .pipe(templateCache({
      templateHeader: templateHeader,
      standalone: true
    }))
    .pipe(gulp.dest('src'))
    .pipe(connect.reload());
});

gulp.task('pack', function () {
  return gulp.src('')
    .pipe(exec('webpack --progress'))
    .pipe(exec.reporter())
    .pipe(connect.reload());
});

gulp.task('pack-min', function () {
  return gulp.src('')
    .pipe(exec('webpack -p --progress'))
    .pipe(exec.reporter());
});

gulp.task('watch-files', function () {
  gulp.watch(['src/**/*.html'], ['templates']);
  gulp.watch(['src/**/*.js'], ['pack', 'templates']);
  util.log('Watching files for changes...');
});

gulp.task('watch-test-files', function () {
  gulp.watch(['test/**/*.test.js'], ['lint', 'test']);
});

gulp.task('watch', ['templates', 'pack', 'watch-files', 'connect']);

gulp.task('watch-tests', ['watch-test-files']);

gulp.task('default', ['lint', 'test'])
