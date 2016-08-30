#!/usr/local/bin/node
var gulp        = require('gulp');
var sass        = require('gulp-sass');
var concat      = require('gulp-concat');
var autoprefix  = require('gulp-autoprefixer');
var livereload  = require('gulp-livereload');
var mvc         = require('express-mvc');
var app         = mvc.init(__dirname+"/app/", ENV_CLI).bootstrap();
var $           = mvc.Gulper.set(gulp);


var FILES = $.collections({
    scss: ['base.scss','app.scss'],
    lib: [],
    npm: ['angular/angular.min.js'],
    js: ['main.js'],
});


gulp.task('sass', function()
{
    var options = {outputStyle:"compressed"};

    return gulp.src(FILES.scss)
        .pipe(sass(options)
            .on('error', sass.logError))
        .pipe(autoprefix())
        .pipe($.dest())
        .pipe(livereload());
});


gulp.task('js:lib', function()
{
    gulp.src(FILES.npm)
        .pipe(concat('npm.js'))
        .pipe($.dest());
    gulp.src(FILES.lib)
        .pipe(concat('lib.js'))
        .pipe($.dest());
    return true;
});


gulp.task('js:src', function()
{
    return gulp.src(FILES.js)
        .pipe(concat('src.js'))
        .pipe($.dest());
});


gulp.task('watch', function()
{
    livereload.listen();

    var lrPaths = [
        paths.views+'/**/*.ejs',
        paths.js+'/**/*.js'
    ];

    gulp.watch(paths.js   + '/**/*.js',     ['js:src']);
    gulp.watch(paths.scss + '/**/*.scss',   ['sass']);
    gulp.watch(lrPaths, function(event) {
        gulp.src(event.path).pipe(livereload());
    });
});

gulp.task('default', ['sass','js:lib','js:src']);