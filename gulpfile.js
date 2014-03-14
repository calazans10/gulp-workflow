var gulp           = require('gulp');
var jshint         = require('gulp-jshint');
var uglify         = require('gulp-uglify');
var minifyCSS      = require('gulp-minify-css');
var concat         = require('gulp-concat');
var rename         = require('gulp-rename');
var imagemin       = require('gulp-imagemin');
var prefix         = require('gulp-autoprefixer');
var minifyHTML     = require('gulp-minify-html');
var bowerFiles     = require('gulp-bower-files');
var express        = require('express');
var refresh        = require('gulp-livereload');
var livereload     = require('connect-livereload');
var lrserver       = require('tiny-lr')();

var expressRoot    = __dirname;
var expressPort    = 4000;
var livereloadPort = 35729;

var server         = express();

var paths = {
	htmlFiles: './static/html/**/*.html',
	htmlDist: './',
	scriptFiles: './static/js/*.js',
	scriptDist: './assets/js',
	styleFiles: './static/css/**/*.css',
	styleDist: './assets/css',
	imageFiles: './static/img/**/*',
	imageDist: './assets//img/',
}

server.use(livereload({
	port: livereloadPort
}));
server.use(express.static(expressRoot));

gulp.task('serve', function() {
	server.listen(expressPort);
	lrserver.listen(livereloadPort);
});

gulp.task('bower', function() {
	bowerFiles().pipe(gulp.dest("./assets/lib"));
});

// Lint JS
gulp.task('lint', function() {
	return gulp.src(paths.scriptFiles)
		.pipe(jshint())
		.pipe(jshint.reporter('default'));
});

// Concat & Minify CSS
gulp.task('styles', function() {
	return gulp.src(paths.styleFiles)
		.pipe(concat('./css'))
		.pipe(rename('all.min.css'))
		.pipe(minifyCSS())
		.pipe(prefix("last 1 version", "> 1%", "ie 8", "ie 7"))
		.pipe(gulp.dest(paths.styleDist))
		.pipe(refresh(lrserver));
});

// Minify HTML
gulp.task('html', function() {
	return gulp.src(paths.htmlFiles)
		.pipe(minifyHTML())
		.pipe(gulp.dest(paths.htmlDist))
		.pipe(refresh(lrserver));
});

// Concat & Minify JS
gulp.task('scripts', function() {
	return gulp.src(paths.scriptFiles)
		.pipe(concat('./js'))
		.pipe(rename('all.min.js'))
		.pipe(uglify())
		.pipe(gulp.dest(paths.scriptDist))
		.pipe(refresh(lrserver));
});

// Copy all static images
gulp.task('images', function() {
	return gulp.src(paths.imageFiles)
		.pipe(imagemin({optimizationLevel: 5}))
		.pipe(gulp.dest(paths.imageDist))
		.pipe(refresh(lrserver));
})

// Watch files
gulp.task('watch', function() {
	gulp.watch(paths.styleFiles, ['styles']);
	gulp.watch(paths.scriptFiles, ['lint', 'scripts']);
	gulp.watch(paths.imageFiles, ['images']);
	gulp.watch(paths.htmlFiles, ['html']);
});

// Default
gulp.task('default', ['styles', 'lint', 'scripts', 'images', 'html', 'watch', 'serve']);
