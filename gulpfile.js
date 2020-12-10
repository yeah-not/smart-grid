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
  return gulp.src('./src/less/styles.less')
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

  gulp.watch('./src/less/styles.less', styles);
  gulp.watch('./src/*.html', html);
}

function grid(done) {
  const settings = {
    columns: 24,
    offset: '10px',
    // mobileFirst: true,
    container: {
        maxWidth: '950px',
        fields: '30px'
    },
    breakPoints: {
      md: {
        width: "920px",
        fields: "15px"
      },
      sm: {
        width: "720px"
      },
      xs: {
        width: "576px"
      },
      xxs: {
        width: "420px"
      }
    }
  };

  smartgrid('./src/less', settings);
  done();
}

let build = series(clean, parallel(styles, images, html));

gulp.task('build', build);
gulp.task('watch', series(build, watch));
gulp.task('grid', grid);
