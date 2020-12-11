const gulp = require('gulp');
const {series, parallel} = require('gulp');
const gulpif = require('gulp-if');
const del = require('del');
const browserSync = require('browser-sync').create();

const isDev = (process.argv.indexOf('--dev') !== -1);
const isProd = !isDev;

const less = require('gulp-less');
const sourcemaps = require('gulp-sourcemaps');
const gcmq = require('gulp-group-css-media-queries');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const smartgrid = require('smart-grid');

function clean() {
  return del('./build');
}

function styles() {
  return gulp.src('./src/less/+(styles|styles-ie9|styles-percent).less')
         .pipe(gulpif(isDev, sourcemaps.init()))
         .pipe(less())
         .pipe(gcmq())
         .pipe(autoprefixer({
           overrideBrowserslist: ['> 0.1%'],
           cascade: false
         }))
         .pipe(gulpif(isProd, cleanCSS({level: 2})))
         .pipe(gulpif(isDev, sourcemaps.write()))
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

  gulp.watch('./src/less/*.less', styles);
  gulp.watch('./src/*.html', html);
  gulp.watch('./smartgrid.js', grid);
}

function grid(done) {
  delete require.cache[require.resolve('./smartgrid.js')];

  let settings = require('./smartgrid.js');
  smartgrid('./src/less', settings);

  settings.offset = '3.1%';
  settings.filename = 'smart-grid-percent';
  smartgrid('./src/less', settings);

  done();
}

let build = series(clean, parallel(styles, images, html));

gulp.task('build', series(grid, build));
gulp.task('watch', series('build', watch));
