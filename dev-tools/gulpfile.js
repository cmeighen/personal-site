// --------------------------------------------------
// [Gulpfile]
// --------------------------------------------------

'use strict';
 
var gulp 		= require('gulp'),
	sass 		= require('gulp-sass'),
	changed 	= require('gulp-changed'),
	cleanCSS 	= require('gulp-clean-css'),
	rtlcss 		= require('gulp-rtlcss'),
	rename 		= require('gulp-rename'),
	uglify 		= require('gulp-uglify'),
	pump 		= require('pump'),
	htmlhint  	= require('gulp-htmlhint');


// Gulp plumber error handler
function errorLog(error) {
	console.error.bind(error);
	this.emit('end');
}


// --------------------------------------------------
// [Libraries]
// --------------------------------------------------

// Sass - Compile Sass files into CSS
gulp.task('sass', function () {
	gulp.src('../docs/sass/**/*.scss')
		.pipe(changed('../docs/css/'))
		.pipe(sass({ outputStyle: 'expanded' }))
		.on('error', sass.logError)
		.pipe(gulp.dest('../docs/css/'));
});


// Minify CSS
gulp.task('minify-css', function() {
	// Theme
    gulp.src(['../docs/css/layout.css', '!../docs/css/layout.min.css'])
        .pipe(cleanCSS({debug: true}, function(details) {
            console.log(details.name + ': ' + details.stats.originalSize);
            console.log(details.name + ': ' + details.stats.minifiedSize);
        }))
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('../docs/css/'));

    // RTL
    gulp.src(['../docs/css/layout-rtl.css', '!../docs/css/layout-rtl.min.css'])
        .pipe(cleanCSS({debug: true}, function(details) {
            console.log(details.name + ': ' + details.stats.originalSize);
            console.log(details.name + ': ' + details.stats.minifiedSize);
        }))
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('../docs/css/'));
});


// RTL CSS - Convert LTR CSS to RTL.
gulp.task('rtlcss', function () {
	gulp.src(['../docs/css/layout.css', '!../docs/css/layout.min.css', '!../docs/css/layout-rtl.css', '!../docs/css/layout-rtl.min.css'])
	.pipe(changed('../docs/css/'))
		.pipe(rtlcss())
		.pipe(rename({ suffix: '-rtl' }))
		.pipe(gulp.dest('../docs/css/'));
});


// Minify JS - Minifies JS
gulp.task('uglify', function (cb) {
  	pump([
	        gulp.src(['../docs/js/**/*.js', '!../docs/js/**/*.min.js']),
	        uglify(),
			rename({ suffix: '.min' }),
	        gulp.dest('../docs/js/')
		],
		cb
	);
});


// docshint - Validate docs
gulp.task('htmlhint', function() {
	gulp.src('../docs/*.html')
		.pipe(htmlhint())
		.pipe(htmlhint.reporter())
	  	.pipe(htmlhint.failReporter({ suppress: true }))
});


// --------------------------------------------------
// [Gulp Task - Watch]
// --------------------------------------------------

// Lets us type "gulp" on the command line and run all of our tasks
gulp.task('default', ['sass', 'minify-css', 'rtlcss', 'uglify', 'htmlhint', 'watch']);

// This handles watching and running tasks
gulp.task('watch', function () {
    gulp.watch('../docs/sass/**/*.scss', ['sass']);
    gulp.watch('../docs/css/layout.css', ['minify-css']);
    gulp.watch('../docs/css/layout.css', ['rtlcss']);
    gulp.watch('../docs/js/**/*.js', ['uglify']);
    gulp.watch('../docs/*.html', ['htmlhint']);
});