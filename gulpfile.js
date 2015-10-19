var gulp        = require('gulp');
var browserSync = require('browser-sync').create();
var runSequence = require('run-sequence');
var imagemin    = require('gulp-imagemin');
var del         = require('del');

gulp.task('clean', function() {
  del(['build']);
});

gulp.task('serve', function() {
  browserSync.init({
    server: {
      baseDir: './',
    },
    open: false
  });
});

gulp.task('images', function() {
  return gulp.src('src/images/**/*')
    .pipe(imagemin({optimizationLevel: 5}))
    .pipe(gulp.dest('build/images'))
    .pipe(browserSync.stream());
});

gulp.task('watch', function() {
  gulp.watch('src/images/**/*', ['images']);
});

gulp.task('build', function() {
  runSequence('clean', ['images']);
});

gulp.task('default', ['build', 'serve', 'watch']);
