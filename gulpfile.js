var gulp = require('gulp');
var autoprefixer = require('gulp-autoprefixer');
var coffee = require('gulp-coffee');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var imagemin = require('gulp-imagemin');
var pug = require('gulp-pug');
var sass = require('gulp-sass');
var sourcemaps = require('gulp-sourcemaps');
var browserSync = require('browser-sync').create();
var runSequence = require('run-sequence');
var del = require('del');

var paths = {
  stylesheets: 'src/css/**/*.scss',
  scripts: 'src/js/**/*.coffee',
  images: 'src/img/**/*'
}

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
  return gulp.src(paths.stylesheets)
    .pipe(sourcemaps.init())
      .pipe(sass().on('error', sass.logError))
      .pipe(autoprefixer({browsers: ['last 2 versions'], cascade: false}))
      .pipe(concat('all.min.css'))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('dist/css'))
    .pipe(browserSync.stream());
});

gulp.task('scripts', function() {
  return gulp.src(paths.scripts)
    .pipe(sourcemaps.init())
      .pipe(coffee())
      .pipe(uglify())
      .pipe(concat('all.min.js'))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('dist/js'))
    .pipe(browserSync.stream());
});

gulp.task('images', function() {
  return gulp.src(paths.images)
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
  gulp.watch(paths.stylesheets, ['stylesheets']);
  gulp.watch(paths.scripts, ['scripts']);
  gulp.watch(paths.images, ['images']);
  gulp.watch('src/index.pug', ['templates']);
  gulp.watch('dist/index.html').on('change', browserSync.reload);
});

gulp.task('build', function() {
  runSequence('clean', ['stylesheets', 'scripts', 'images', 'templates']);
});

gulp.task('default', ['build', 'serve', 'watch']);
