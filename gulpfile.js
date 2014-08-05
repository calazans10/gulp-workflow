var gulp        = require('gulp'),
    size        = require('gulp-size'),
    rimraf      = require('gulp-rimraf'),
    uglify      = require('gulp-uglify'),
    minifyCSS   = require('gulp-minify-css'),
    concat      = require('gulp-concat'),
    rename      = require('gulp-rename'),
    imagemin    = require('gulp-imagemin'),
    minifyHTML  = require('gulp-minify-html'),
    nib         = require('nib'),
    stylus      = require('gulp-stylus'),
    bowerFiles  = require('main-bower-files'),
    runSequence = require('run-sequence'),
    browserSync = require('browser-sync'),
    reload      = browserSync.reload;

var path = {
  'src': {
    'img'   : './src/img/**/*',
    'html'  : './src/html/**/*.html',
    'stylus': './src/stylus/',
    'vendor': './src/vendor/'
  },
  'build': {
    'img'  : './build/img',
    'html' : './',
    'bower': './bower.json',
    'css'  : './build/css',
    'js'   : './build/js'
  }
}

gulp.task('bower', function() {
  gulp.src(bowerFiles())
    .pipe(gulp.dest(path.src.vendor));
});

gulp.task('vendor', function() {
  gulp.src(path.src.vendor + '**/*.js')
    .pipe(uglify())
    .pipe(concat('vendor.js'))
    .pipe(size())
    .pipe(gulp.dest(path.build.js))
    .pipe(reload({stream:true}));

  gulp.src(path.src.vendor + '**/*.css')
    .pipe(minifyCSS())
    .pipe(concat('vendor.css'))
    .pipe(size())
    .pipe(gulp.dest(path.build.css))
    .pipe(reload({stream:true}));
});

gulp.task('stylus', function() {
  gulp.src(path.src.stylus + 'main.styl')
    .pipe(stylus({use: [nib()], compress: true}))
    .pipe(rename('style.css'))
    .pipe(size())
    .pipe(gulp.dest(path.build.css))
    .pipe(reload({stream:true}));
});

gulp.task('images', function() {
  gulp.src(path.src.img)
    .pipe(imagemin({optimizationLevel: 5}))
    .pipe(size())
    .pipe(gulp.dest(path.build.img))
    .pipe(reload({stream:true}));
});

gulp.task('html', function() {
  gulp.src(path.src.html)
    .pipe(minifyHTML())
    .pipe(size())
    .pipe(gulp.dest(path.build.html))
    .pipe(reload({stream:true}));
});

gulp.task('server', function() {
  browserSync({
    server: {
      baseDir: __dirname,
    },
    open: false
  })
});

gulp.task('watch', function() {
  gulp.watch(path.src.bower, ['bower']);
  gulp.watch(path.src.vendor, ['vendor']);
  gulp.watch(path.src.stylus + '*.styl', ['stylus']);
  gulp.watch(path.src.img, ['images']);
  gulp.watch(path.src.html, ['html']);
});

gulp.task('clean', function() {
  gulp.src([path.build.css, path.build.js, path.build.img], {read: false})
    .pipe(rimraf());
});

gulp.task('build', function() {
  runSequence('clean', ['bower', 'vendor', 'stylus', 'images', 'html']);
});

gulp.task('default', ['build', 'server', 'watch']);
