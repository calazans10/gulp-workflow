var gulp = require('gulp');
var webpack = require('webpack-stream');
var autoprefixer = require('gulp-autoprefixer');
var imagemin = require('gulp-imagemin');
var pug = require('gulp-pug');
var sass = require('gulp-sass');
var csso = require('gulp-csso');
var sourcemaps = require('gulp-sourcemaps');
var rename = require('gulp-rename');
var browserSync = require('browser-sync').create();
var runSequence = require('run-sequence');
var del = require('del');

gulp.task('clean', function() {
  return del(['dist']);
});

gulp.task('serve', function() {
  browserSync.init({
    server: {
      baseDir: './dist',
    },
    open: false
  });
});

gulp.task('stylesheets', function() {
  return gulp.src('src/css/main.scss')
    .pipe(sourcemaps.init())
      .pipe(sass().on('error', sass.logError))
      .pipe(autoprefixer({browsers: ['last 2 versions'], cascade: false}))
      .pipe(csso())
      .pipe(rename('style.css'))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('dist/css'))
    .pipe(browserSync.stream());
});

gulp.task('scripts', function() {
  return gulp.src('src/js/main.ts')
    .pipe(webpack(require('./webpack.config.js')))
    .pipe(gulp.dest('dist/js'))
    .pipe(browserSync.stream());
});

gulp.task('images', function() {
  return gulp.src('src/img/**/*')
    .pipe(imagemin({optimizationLevel: 5}))
    .pipe(gulp.dest('dist/img'))
    .pipe(browserSync.stream());
});

gulp.task('templates', function() {
  return gulp.src('src/index.pug')
    .pipe(pug())
    .pipe(gulp.dest('dist'))
    .pipe(browserSync.stream());
});

gulp.task('watch', function() {
  gulp.watch('src/css/**/*.scss', ['stylesheets']);
  gulp.watch('src/js/**/*.ts', ['scripts']);
  gulp.watch('src/img/**/*', ['images']);
  gulp.watch('src/index.pug', ['templates']);
  gulp.watch('dist/index.html').on('change', browserSync.reload);
});

gulp.task('build', function() {
  runSequence('clean', ['stylesheets', 'scripts', 'images', 'templates']);
});

gulp.task('default', ['build', 'serve', 'watch']);
