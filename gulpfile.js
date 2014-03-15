var gulp           = require('gulp');
var size           = require('gulp-size');
var clean          = require('gulp-clean');
var jshint         = require('gulp-jshint');
var uglify         = require('gulp-uglify');
var minifyCSS      = require('gulp-minify-css');
var concat         = require('gulp-concat');
var rename         = require('gulp-rename');
var imagemin       = require('gulp-imagemin');
var prefix         = require('gulp-autoprefixer');
var minifyHTML     = require('gulp-minify-html');
var bowerFiles     = require('gulp-bower-files');
var refresh        = require('gulp-livereload');
var livereload     = require('connect-livereload');
var express        = require('express');
var server         = express();
var lrserver       = require('tiny-lr')();

var config = {
		'html': {
			'loadPath': './static/html/**/*.html',
			'buildPath': './'
		},
		'img': {
			'loadPath': './static/img/**/*',
			'buildPath': './img'
		},
		'js': {
			'loadPath': './static/js/**/*.js',
			'buildPath': './js'
		},
		'css': {
			'loadPath': './static/css/**/*.css',
			'buildPath': './css'
		}
	}

var expressRoot    = __dirname;
var expressPort    = 4000;
var livereloadPort = 35729;

server.use(livereload({
	port: livereloadPort
}));
server.use(express.static(expressRoot));

gulp.task('serve', function() {
	server.listen(expressPort);
	lrserver.listen(livereloadPort);
});

gulp.task('bower', function() {
	bowerFiles().pipe(gulp.dest("./lib"));
});

// Lint JS
gulp.task('lint', function() {
	return gulp.src(config.js.loadPath)
		.pipe(jshint())
		.pipe(jshint.reporter('default'));
});

// Concat & Minify JS
gulp.task('scripts', function() {
	return gulp.src(config.js.loadPath)
		.pipe(concat('./js'))
		.pipe(rename('all.min.js'))
		.pipe(uglify())
		.pipe(size())
		.pipe(gulp.dest(config.js.buildPath))
		.pipe(refresh(lrserver));
});

// Concat & Minify CSS
gulp.task('styles', function() {
	return gulp.src(config.css.loadPath)
		.pipe(concat('./css'))
		.pipe(rename('all.min.css'))
		.pipe(minifyCSS())
		.pipe(prefix("last 1 version", "> 1%", "ie 8", "ie 7"))
		.pipe(size())
		.pipe(gulp.dest(config.css.buildPath))
		.pipe(refresh(lrserver));
});

// Copy all static images
gulp.task('images', function() {
	return gulp.src(config.img.loadPath)
		.pipe(imagemin({optimizationLevel: 5}))
		.pipe(size())
		.pipe(gulp.dest(config.img.buildPath))
		.pipe(refresh(lrserver));
});

// Minify HTML
gulp.task('html', function() {
	return gulp.src(config.html.loadPath)
		.pipe(minifyHTML())
		.pipe(size())
		.pipe(gulp.dest(config.html.buildPath))
		.pipe(refresh(lrserver));
});

gulp.task('clean', function() {
	return gulp.src(
			[config.css.buildPath, config.js.buildPath, config.img.buildPath],
			{read: false}
		)
		.pipe(clean());
});

// Watch files
gulp.task('watch', function() {
	gulp.watch(config.js.loadPath, ['lint', 'scripts']);
	gulp.watch(config.css.loadPath, ['styles']);
	gulp.watch(config.img.loadPath, ['images']);
	gulp.watch(config.html.loadPath, ['html']);
});

gulp.task('build', ['lint', 'scripts', 'styles', 'images', 'html', 'watch', 'serve']);

// Default
gulp.task('default', ['clean'], function () {
	gulp.start('build');
});
