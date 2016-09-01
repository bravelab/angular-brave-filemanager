'use strict';

// Require
var gulp = require('gulp');
var templateCache = require('gulp-angular-templatecache');
var uglify = require('gulp-uglify');
var minifyCss = require('gulp-clean-css');
var concat = require('gulp-concat');
var eslint = require('gulp-eslint');
var del = require('del');
var path = require('path');

// Vars
var src = 'src/';
var dst = 'dist/';
var tplPath = 'src/templates'; //must be same as fileManagerConfig.tplPath

var jsFileUgly  = 'angular-filemanager.min.js';
var jsFileRaw   = 'angular-filemanager.js';

var cssFile = 'angular-filemanager.min.css';
var config = {
    lint: {
        src: ['src/**/*.js', 'test/**/*.spec.js']
    }
};

gulp.task('clean', function (cb) {
  del(dst + '/*', cb);
});

gulp.task('cache-templates', function () {
  return gulp.src(tplPath + '/*.html')
    .pipe(templateCache(jsFileUgly, {
      module: 'FileManagerApp',
      base: function(file) {
        return tplPath + '/' + path.basename(file.history);
      }
    }))
    .pipe(gulp.dest(dst));
});

gulp.task('concat-uglify-js', ['cache-templates'], function() {
  return gulp.src([
    src + 'js/app.js',
      src + 'js/*/*.js',
      dst + '/' + jsFileUgly
    ])
    .pipe(concat(jsFileUgly))
    .pipe(uglify())
    .pipe(gulp.dest(dst));
});

gulp.task('concat-js', function() {
  return gulp.src([
    src + 'js/app.js',
      src + 'js/*/*.js'
    ])
    .pipe(concat(jsFileRaw))
    .pipe(gulp.dest(dst));
});

gulp.task('minify-css', function() {
  return gulp.src(src + 'css/*.css')
    .pipe(minifyCss({compatibility: 'ie8'}))
    .pipe(concat(cssFile))
    .pipe(gulp.dest(dst));
});

gulp.task('lint', function () {
  return gulp.src([src + 'js/app.js', src + 'js/*/*.js'])
    .pipe(eslint({
      'rules': {
          'quotes': [2, 'single'], 
          // 'linebreak-style': [2, 'unix'],
          'no-console': 0,
          'semi': [2, 'always']
      },
      'env': {
          'browser': true
      },
      'globals': {
          'angular': true,
          'jQuery': true
      },
      'extends': 'eslint:recommended'
    }))
    .pipe(eslint.format())
    .pipe(eslint.failOnError());
});


gulp.task('default', ['watch']);
gulp.task('build', ['lint', 'clean', 'concat-js']); // 'minify-css'

gulp.task('watch', function () {
    gulp.watch(config.lint.src, ['build']);
});