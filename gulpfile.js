var gulp = require('gulp');
var rollup = require('gulp-rollup');
var rename = require('gulp-rename');
var del = require('del');

gulp.task('build', function() {
  gulp.src('src/runtime/index.js', {read: false})
    .pipe(rollup({ format: 'iife' }))
    .pipe(rename('i28n.js'))
    .pipe(gulp.dest('dist'));
});

gulp.task('watch', ['build'], function() {
  gulp.watch(['./src/**/*'], ['build']);
});

gulp.task('clean', function() {
  return del(['dist']);
});
