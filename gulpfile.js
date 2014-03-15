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

var path = {
		'html': {
			'load': './static/html/**/*.html',
			'build': './'
		},
		'img': {
			'load': './static/img/**/*',
			'build': './img'
		},
		'js': {
			'load': './static/js/**/*.js',
			'build': './js'
		},
		'css': {
			'load': './static/css/**/*.css',
			'build': './css'
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
	return gulp.src(path.js.load)
		.pipe(jshint())
		.pipe(jshint.reporter('default'));
});

// Concat & Minify JS
gulp.task('scripts', function() {
	return gulp.src(path.js.load)
		.pipe(concat('./js'))
		.pipe(rename('all.min.js'))
		.pipe(uglify())
		.pipe(size())
		.pipe(gulp.dest(path.js.build))
		.pipe(refresh(lrserver));
});

// Concat & Minify CSS
gulp.task('styles', function() {
	return gulp.src(path.css.load)
		.pipe(concat('./css'))
		.pipe(rename('all.min.css'))
		.pipe(minifyCSS())
		.pipe(prefix("last 1 version", "> 1%", "ie 8", "ie 7"))
		.pipe(size())
		.pipe(gulp.dest(path.css.build))
		.pipe(refresh(lrserver));
});

// Copy all static images
gulp.task('images', function() {
	return gulp.src(path.img.load)
		.pipe(imagemin({optimizationLevel: 5}))
		.pipe(size())
		.pipe(gulp.dest(path.img.build))
		.pipe(refresh(lrserver));
});

// Minify HTML
gulp.task('html', function() {
	return gulp.src(path.html.load)
		.pipe(minifyHTML())
		.pipe(size())
		.pipe(gulp.dest(path.html.build))
		.pipe(refresh(lrserver));
});

gulp.task('clean', function() {
	return gulp.src([path.css.build, path.js.build, path.img.build], {read: false})
		.pipe(clean());
});

// Watch files
gulp.task('watch', function() {
	gulp.watch(path.js.load, ['lint', 'scripts']);
	gulp.watch(path.css.load, ['styles']);
	gulp.watch(path.img.load, ['images']);
	gulp.watch(path.html.load, ['html']);
});

gulp.task('build', ['lint', 'scripts', 'styles', 'images', 'html', 'watch', 'serve']);

// Default
gulp.task('default', ['clean'], function () {
	gulp.start('build');
});
