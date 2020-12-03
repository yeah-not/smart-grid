const gulp = require('gulp');

function defaultTask(cb) {
  console.log('This is the default gulp task - for test only')
  cb();
}

gulp.task('default', defaultTask);
