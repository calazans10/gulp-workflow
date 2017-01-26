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
  stylesheets: 'client/css/**/*.scss',
  scripts: 'client/js/**/*.coffee',
  templates: 'client/html/**/*.pug',
  images: 'client/img/**/*'
}

gulp.task('clean', function() {
  return del(['app']);
});

gulp.task('serve', function() {
  browserSync.init({
    server: {
      baseDir: './app',
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
    .pipe(gulp.dest('app/css'))
    .pipe(browserSync.stream());
});

gulp.task('scripts', function() {
  return gulp.src(paths.scripts)
    .pipe(sourcemaps.init())
      .pipe(coffee())
      .pipe(uglify())
      .pipe(concat('all.min.js'))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('app/js'))
    .pipe(browserSync.stream());
});

gulp.task('templates', function() {
  return gulp.src(paths.templates)
    .pipe(pug())
    .pipe(gulp.dest('app'))
    .pipe(browserSync.stream());
})

gulp.task('images', function() {
  return gulp.src(paths.images)
    .pipe(imagemin({optimizationLevel: 5}))
    .pipe(gulp.dest('app/img'))
    .pipe(browserSync.stream());
});

gulp.task('watch', function() {
  gulp.watch(paths.stylesheets, ['stylesheets']);
  gulp.watch(paths.scripts, ['scripts']);
  gulp.watch(paths.templates, ['templates']);
  gulp.watch(paths.images, ['images']);
  gulp.watch('app/*.html').on('change', browserSync.reload);
});

gulp.task('build', function() {
  runSequence('clean', ['stylesheets', 'scripts', 'templates','images']);
});

gulp.task('default', ['build', 'serve', 'watch']);
