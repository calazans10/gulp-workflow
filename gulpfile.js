var gulp         = require('gulp');
var autoprefixer = require('gulp-autoprefixer');
var babel        = require('gulp-babel');
var concat       = require('gulp-concat');
var imagemin     = require('gulp-imagemin');
var sass         = require('gulp-sass');
var sourcemaps   = require('gulp-sourcemaps');
var browserSync  = require('browser-sync').create();
var runSequence  = require('run-sequence');
var del          = require('del');

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

gulp.task('img', function() {
  return gulp.src('src/images/**/*')
    .pipe(imagemin({optimizationLevel: 5}))
    .pipe(gulp.dest('build/img'))
    .pipe(browserSync.stream());
});

gulp.task('js', function() {
  return gulp.src('src/javascripts/**/*.js')
    .pipe(sourcemaps.init())
      .pipe(babel())
      .pipe(concat('all.js'))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('build/js'))
    .pipe(browserSync.stream());
});

gulp.task('css', function() {
  return gulp.src('src/stylesheets/**/*.scss')
    .pipe(sourcemaps.init())
      .pipe(sass().on('error', sass.logError))
      .pipe(autoprefixer({browsers: ['> 1%', 'last 2 versions', 'Firefox ESR']}))
      .pipe(concat('all.css'))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('build/css'))
    .pipe(browserSync.stream());
});

gulp.task('watch', function() {
  gulp.watch('src/images/**/*', ['img']);
  gulp.watch('src/javascripts/**/*.js', ['js']);
  gulp.watch('src/stylesheets/**/*.scss', ['css']);
});

gulp.task('build', function() {
  runSequence('clean', ['img', 'js', 'css']);
});

gulp.task('default', ['build', 'serve', 'watch']);
