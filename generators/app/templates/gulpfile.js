'use strict';

var gulp = require('gulp');
var util = require('gulp-util');
var exec = require('gulp-exec');
var spawn = require('gulp-spawn');
var connect = require('gulp-connect');
var templateCache = require('gulp-angular-templatecache');
var templateHeader = '/* DO NOT MODIFY, GENERATED VIA GULP */\r\n"use strict";\r\nmodule.exports = "<%%= module %>";\r\nangular.module("<%%= module %>"<%%= standalone %>).run(["$templateCache", function($templateCache) {';


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
  gulp.watch(['src/**/*.js'], ['pack']); // this will see templates.js change from that task
  util.log('Watching files for changes...');
});

gulp.task('watch', ['templates', 'pack', 'watch-files', 'connect']);
