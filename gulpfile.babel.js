import gulp from 'gulp';
import autoprefixer from 'gulp-autoprefixer';
import cleanCSS from 'gulp-clean-css';
import del from 'del';
import imagemin from 'gulp-imagemin';
import pug from 'gulp-pug';
import sass from 'gulp-sass';
import sourcemaps from 'gulp-sourcemaps';
import webpack from 'webpack-stream';
import { create as bsCreate } from 'browser-sync';

const browserSync = bsCreate();

const paths = {
  styles: {
    src: 'src/styles/**/*.scss',
    dest: 'dist/styles/'
  },
  scripts: {
    src: 'src/scripts/**/*.js',
    dest: 'dist/scripts/'
  },
  images: {
    src: 'src/images/**/*.{jpg,jpeg,png}',
    dest: 'dist/images/'
  }
};

export const clean = () => del(['dist']);

export function serve() {
  return browserSync.init({
    server: {
      baseDir: './dist'
    },
    open: false
  });
}

export function styles() {
  return gulp
    .src(paths.styles.src)
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({ browsers: ['last 2 versions'], cascade: false }))
    .pipe(cleanCSS())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(paths.styles.dest))
    .pipe(browserSync.stream());
}

export function scripts() {
  return gulp
    .src(paths.scripts.src)
    .pipe(webpack(require('./webpack.config.js')))
    .pipe(gulp.dest(paths.scripts.dest))
    .pipe(browserSync.stream());
}

export function images() {
  return gulp
    .src(paths.images.src)
    .pipe(imagemin({ optimizationLevel: 5 }))
    .pipe(gulp.dest(paths.images.dest))
    .pipe(browserSync.stream());
}

export function templates() {
  return gulp
    .src('src/index.pug')
    .pipe(pug())
    .pipe(gulp.dest('dist'))
    .pipe(browserSync.stream());
}

export function watch() {
  gulp.watch(paths.styles.src, styles);
  gulp.watch(paths.scripts.src, scripts);
  gulp.watch(paths.images.src, images);
  gulp.watch('src/index.pug', templates);
  gulp.watch('dist/index.html').on('change', browserSync.reload);
}

const build = gulp.series(clean, gulp.parallel(styles, scripts, images, templates));

const defaultTask = gulp.parallel(build, serve, watch);

gulp.task('build', build);

gulp.task('default', defaultTask);

export default defaultTask;
