const gulp = require('gulp');
const {series, parallel} = require('gulp');
const del = require('del');

const less = require('gulp-less');

function clean() {
  return del('./build');
}

function styles() {
  return gulp.src('./src/less/styles.less')
         .pipe(less())
         .pipe(gulp.dest('./build/css'));
}

function images() {
  return gulp.src('./src/img/**/*')
         .pipe(gulp.dest('./build/img'));
}

function html() {
  return gulp.src('./src/*.html')
         .pipe(gulp.dest('./build'));
}

let build = series(clean, parallel(styles, images, html));

gulp.task('build', build);
