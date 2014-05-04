var gulp           = require('gulp');
var size           = require('gulp-size');
var clean          = require('gulp-clean');
var jshint         = require('gulp-jshint');
var uglify         = require('gulp-uglify');
var minifyCSS      = require('gulp-minify-css');
var concat         = require('gulp-concat');
var imagemin       = require('gulp-imagemin');
var prefix         = require('gulp-autoprefixer');
var minifyHTML     = require('gulp-minify-html');
var connect        = require('gulp-connect');

var path = {
  'src': {
    'js': './src/js/**/*.js',
    'css': './src/css/**/*.css',
    'img': './src/img/**/*',
    'html': './src/html/**/*.html'
  },
  'build': {
    'js': './build/js',
    'css': './build/css',
    'img': './build/img',
    'html': './'
  }
}

gulp.task('connect', function() {
  connect.server({
    root: ['.', 'build', 'src'],
    port: 8000,
    livereload: true
  });
});

// Lint JS
gulp.task('lint', function() {
  gulp.src(path.src.js)
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

// Concat & Minify JS
gulp.task('scripts', function() {
  gulp.src(path.src.js)
    .pipe(uglify())
    .pipe(concat('all.min.js'))
    .pipe(size())
    .pipe(gulp.dest(path.build.js))
    .pipe(connect.reload());
});

// Concat & Minify CSS
gulp.task('styles', function() {
  gulp.src(path.src.css)
    .pipe(minifyCSS())
    .pipe(prefix("last 1 version", "> 1%", "ie 8", "ie 7"))
    .pipe(concat('all.min.css'))
    .pipe(size())
    .pipe(gulp.dest(path.build.css))
    .pipe(connect.reload());
});

// Copy all static images
gulp.task('images', function() {
  gulp.src(path.src.img)
    .pipe(imagemin({optimizationLevel: 5}))
    .pipe(size())
    .pipe(gulp.dest(path.build.img))
    .pipe(connect.reload());
});

// Minify HTML
gulp.task('html', function() {
  gulp.src(path.src.html)
    .pipe(minifyHTML())
    .pipe(size())
    .pipe(gulp.dest(path.build.html))
    .pipe(connect.reload());
});

gulp.task('clean', function() {
  gulp.src([path.build.css, path.build.js, path.build.img], {read: false})
    .pipe(clean());
});

// Watch files
gulp.task('watch', function() {
  gulp.watch(path.src.js, ['lint', 'scripts']);
  gulp.watch(path.src.css, ['styles']);
  gulp.watch(path.src.img, ['images']);
  gulp.watch(path.src.html, ['html']);
});

gulp.task('build', ['lint', 'scripts', 'styles', 'images', 'html', 'watch', 'connect']);

// Default
gulp.task('default', ['clean'], function () {
  gulp.start('build');
});
