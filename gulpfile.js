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

var paths = {
  'src': {
    'vendor': './src/vendor/',
    'stylus': './src/stylus/',
    'coffee': './src/coffee/*.coffee',
    'img'   : './src/img/**/*',
    'html'  : './src/html/**/*.html'
  },
  'build': {
    'bower': './bower.json',
    'js'   : './build/js',
    'css'  : './build/css',
    'img'  : './build/img',
    'html' : './'
  }
}

gulp.task('bower', function() {
  gulp.src(bowerFiles())
    .pipe(gulp.dest(paths.src.vendor));
});

gulp.task('vendor', function() {
  gulp.src(paths.src.vendor + '**/*.js')
    .pipe(changed(paths.build.js))
    .pipe(uglify())
    .pipe(concat('vendor.js'))
    .pipe(size())
    .pipe(gulp.dest(paths.build.js))
    .pipe(reload({stream:true}));

  gulp.src(paths.src.vendor + '**/*.css')
    .pipe(changed(paths.build.css))
    .pipe(minifyCSS())
    .pipe(concat('vendor.css'))
    .pipe(size())
    .pipe(gulp.dest(paths.build.css))
    .pipe(reload({stream:true}));
});

gulp.task('stylus', function() {
  gulp.src(paths.src.stylus + 'main.styl')
    .pipe(changed(paths.build.css))
    .pipe(stylus({use: [nib()], compress: true}))
    .pipe(rename('style.css'))
    .pipe(size())
    .pipe(gulp.dest(paths.build.css))
    .pipe(reload({stream:true}));
});

gulp.task('coffee', function() {
  gulp.src(paths.src.coffee)
    .pipe(changed(paths.build.js))
    .pipe(coffee({bare: true}).on('error', gutil.log))
    .pipe(uglify())
    .pipe(concat('script.js'))
    .pipe(size())
    .pipe(gulp.dest(paths.build.js))
    .pipe(reload({stream:true}));
});

gulp.task('images', function() {
  gulp.src(paths.src.img)
    .pipe(changed(paths.build.img))
    .pipe(imagemin({optimizationLevel: 5}))
    .pipe(size())
    .pipe(gulp.dest(paths.build.img))
    .pipe(reload({stream:true}));
});

gulp.task('html', function() {
  gulp.src(paths.src.html)
    .pipe(changed(paths.build.html))
    .pipe(minifyHTML())
    .pipe(size())
    .pipe(gulp.dest(paths.build.html))
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
  gulp.watch(paths.src.bower, ['bower']);
  gulp.watch(paths.src.vendor, ['vendor']);
  gulp.watch(paths.src.stylus + '*.styl', ['stylus']);
  gulp.watch(paths.src.coffee, ['coffee']);
  gulp.watch(paths.src.img, ['images']);
  gulp.watch(paths.src.html, ['html']);
});

gulp.task('clean', function(cb) {
  del([paths.build.css, paths.build.js, paths.build.img], cb);
});

gulp.task('build', function() {
  runSequence('clean', ['bower', 'vendor', 'stylus', 'coffee', 'images', 'html']);
});

gulp.task('default', ['build', 'server', 'watch']);
