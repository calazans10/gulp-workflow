var gulp           = require('gulp');
var size           = require('gulp-size');
var clean          = require('gulp-clean');
var uglify         = require('gulp-uglify');
var minifyCSS      = require('gulp-minify-css');
var concat         = require('gulp-concat');
var rename         = require('gulp-rename');
var imagemin       = require('gulp-imagemin');
var minifyHTML     = require('gulp-minify-html');
var nib            = require('nib');
var stylus         = require('gulp-stylus');
var bowerFiles     = require('gulp-bower-files');
var connect        = require('gulp-connect');

var path = {
  'src': {
    'img': './src/img/**/*',
    'html': './src/html/**/*.html',
    'stylus': './src/stylus/',
    'vendor': './src/vendor/'
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

gulp.task('bower', function() {
  bowerFiles().pipe(gulp.dest(path.src.vendor));
});

gulp.task('js', function() {
  gulp.src(path.src.vendor + '/**/*.js')
    .pipe(uglify())
    .pipe(concat('vendor.js'))
    .pipe(size())
    .pipe(gulp.dest(path.build.js))
    .pipe(connect.reload());
});

gulp.task('css', function() {
  gulp.src(path.src.vendor + '/**/*.css')
    .pipe(minifyCSS())
    .pipe(concat('vendor.css'))
    .pipe(size())
    .pipe(gulp.dest(path.build.css))
    .pipe(connect.reload());
});

gulp.task('vendor', ['js', 'css']);

gulp.task('stylus', function() {
  gulp.src(path.src.stylus + 'main.styl')
    .pipe(stylus({use: [nib()], compress: true}))
    .pipe(rename('style.css'))
    .pipe(size())
    .pipe(gulp.dest(path.build.css))
    .pipe(connect.reload());
});

gulp.task('images', function() {
  gulp.src(path.src.img)
    .pipe(imagemin({optimizationLevel: 5}))
    .pipe(size())
    .pipe(gulp.dest(path.build.img))
    .pipe(connect.reload());
});

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

gulp.task('watch', function() {
  // gulp.watch(path.src.vendor, ['vendor']);
  gulp.watch(path.src.stylus + '*.styl', ['stylus']);
  gulp.watch(path.src.img, ['images']);
  gulp.watch(path.src.html, ['html']);
});

gulp.task('build', ['stylus','images', 'html', 'watch', 'connect']);

gulp.task('default', ['clean'], function () {
  gulp.start('build');
});
