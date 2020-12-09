const gulp = require('gulp');
const {series, parallel} = require('gulp');
const del = require('del');

const less = require('gulp-less');
const sourcemaps = require('gulp-sourcemaps');
const gcmq = require('gulp-group-css-media-queries');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');

const browserSync = require('browser-sync').create();

function clean() {
  return del('./build');
}

function styles() {
  return gulp.src('./src/less/styles.less')
         .pipe(sourcemaps.init())
         .pipe(less())
         .pipe(gcmq())
         .pipe(autoprefixer({
           overrideBrowserslist: ['> 0.1%'],
           cascade: false
         }))
         .pipe(cleanCSS({level: 2}))
         .pipe(sourcemaps.write())
         .pipe(gulp.dest('./build/css'))
         .pipe(browserSync.stream());
}

function images() {
  return gulp.src('./src/img/**/*')
         .pipe(gulp.dest('./build/img'));
}

function html() {
  return gulp.src('./src/*.html')
         .pipe(gulp.dest('./build'))
         .pipe(browserSync.stream());
}

function watch() {
  browserSync.init({
      server: {
          baseDir: "./build"
      }
  });

  gulp.watch('./src/less/styles.less', styles);
  gulp.watch('./src/*.html', html);
}

let build = series(clean, parallel(styles, images, html));

gulp.task('build', build);
gulp.task('watch', series(build, watch));
