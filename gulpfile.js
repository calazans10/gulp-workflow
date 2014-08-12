var gulp        = require('gulp'),
    gutil       = require('gulp-util'),
    del         = require('del'),
    size        = require('gulp-size'),
    uglify      = require('gulp-uglify'),
    minifyCSS   = require('gulp-minify-css'),
    concat      = require('gulp-concat'),
    rename      = require('gulp-rename'),
    changed     = require('gulp-changed'),
    imagemin    = require('gulp-imagemin'),
    minifyHTML  = require('gulp-minify-html'),
    nib         = require('nib'),
    stylus      = require('gulp-stylus'),
    coffee      = require('gulp-coffee'),
    bowerFiles  = require('main-bower-files'),
    runSequence = require('run-sequence'),
    browserSync = require('browser-sync'),
    reload      = browserSync.reload;

var sources = {
  'bower' : './bower.json',
  'vendor': './src/vendor/',
  'stylus': './src/stylus/',
  'html'  : './src/html/**/*.html',
  'coffee': './src/coffee/*.coffee',
  'img'   : './src/img/**/*'
}

var destinations = {
  'css' : './build/css',
  'html': './',
  'js'  : './build/js',
  'img' : './build/img'
}

gulp.task('bower', function() {
  gulp.src(bowerFiles())
    .pipe(gulp.dest(sources.vendor));
});

gulp.task('vendor', function() {
  gulp.src(sources.vendor + '**/*.js')
    .pipe(changed(destinations.js))
    .pipe(uglify())
    .pipe(concat('vendor.js'))
    .pipe(size())
    .pipe(gulp.dest(destinations.js))
    .pipe(reload({stream:true}));

  gulp.src(sources.vendor + '**/*.css')
    .pipe(changed(destinations.css))
    .pipe(minifyCSS())
    .pipe(concat('vendor.css'))
    .pipe(size())
    .pipe(gulp.dest(destinations.css))
    .pipe(reload({stream:true}));
});

gulp.task('stylus', function() {
  gulp.src(sources.stylus + 'main.styl')
    .pipe(changed(destinations.css))
    .pipe(stylus({use: [nib()], compress: true}))
    .pipe(rename('style.css'))
    .pipe(size())
    .pipe(gulp.dest(destinations.css))
    .pipe(reload({stream:true}));
});

gulp.task('coffee', function() {
  gulp.src(sources.coffee)
    .pipe(changed(destinations.js))
    .pipe(coffee({bare: true}).on('error', gutil.log))
    .pipe(uglify())
    .pipe(concat('script.js'))
    .pipe(size())
    .pipe(gulp.dest(destinations.js))
    .pipe(reload({stream:true}));
});

gulp.task('images', function() {
  gulp.src(sources.img)
    .pipe(changed(destinations.img))
    .pipe(imagemin({optimizationLevel: 5}))
    .pipe(size())
    .pipe(gulp.dest(destinations.img))
    .pipe(reload({stream:true}));
});

gulp.task('html', function() {
  gulp.src(sources.html)
    .pipe(changed(destinations.html))
    .pipe(minifyHTML())
    .pipe(size())
    .pipe(gulp.dest(destinations.html))
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
  gulp.watch(sources.bower, ['bower']);
  gulp.watch(sources.vendor, ['vendor']);
  gulp.watch(sources.stylus + '*.styl', ['stylus']);
  gulp.watch(sources.coffee, ['coffee']);
  gulp.watch(sources.img, ['images']);
  gulp.watch(sources.html, ['html']);
});

gulp.task('clean', function(cb) {
  del([destinations.css, destinations.js, destinations.img], cb);
});

gulp.task('build', function() {
  runSequence('clean', ['bower', 'vendor', 'stylus', 'coffee', 'images', 'html']);
});

gulp.task('default', ['build', 'server', 'watch']);
