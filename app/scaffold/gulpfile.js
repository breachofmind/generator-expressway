#!/usr/local/bin/node
"use strict";

var gulp        = require('gulp');
var sass        = require('gulp-sass');
var concat      = require('gulp-concat');
var livereload  = require('gulp-livereload');
var Expressway  = require('expressway');
var app         = Expressway.init(__dirname+"/app/", ENV_CLI).app;
var build       = new Expressway.GulpBuilder(app,gulp);

// --------------------------------------------------------------------
// File collections and settings
// --------------------------------------------------------------------
var FILES = build.collections({
    scss: ['base.scss','app.scss'],
    lib: [],
    npm: ['angular/angular.min.js'],
    js: ['main.js'],
});

var sassOptions = {outputStyle:"compressed"};
var viewExtension = app.conf('view_engine');

// --------------------------------------------------------------------
// Tasks
// --------------------------------------------------------------------
gulp.task('js:npm', build.concat(FILES.npm, 'npm.js'));
gulp.task('js:lib', build.concat(FILES.lib, 'lib.js'));
gulp.task('js:src', build.concat(FILES.js, 'src.js'));
gulp.task('sass',   build.sass(FILES.scss, sassOptions));


gulp.task('watch', function()
{
    livereload.listen();

    build.watch('js',   ['js:src']);
    build.watch('scss', ['sass']);

    // When any view or javascript file changes,
    // livereload the browser.
    var livereloadPaths = [
        build.paths.views + '/**/*.' + viewExtension,
        build.paths.build + '/**/*.js'
    ];
    gulp.watch(livereloadPaths, function(event) {
        gulp.src(event.path).pipe(livereload());
    });
});

gulp.task('default', ['sass','js:lib','js:src','js:npm']);
