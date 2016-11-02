#!/usr/local/bin/node
"use strict";

var gulp        = require('gulp');
var Expressway  = require('expressway');
var build       = Expressway.gulp(__dirname+"/app/", gulp);
var app         = Expressway.instance.app;
var path        = app.get('path');
var config      = app.get('config');

// --------------------------------------------------------------------
// File collections and settings
// --------------------------------------------------------------------

var sassOptions = {outputStyle:"compressed"};
var sassFiles   = ['app.scss', 'base.scss'];
var jsEntries   = [path.resources('js/main.js')];

// --------------------------------------------------------------------
// Tasks
// --------------------------------------------------------------------

build.js({
    entries: jsEntries,
    debug: true,
    sourcemaps: true,
    outputFile: 'app.bundle.js',
});

build.sass(path.prepend(path.resources('scss/'), sassFiles), sassOptions);

build.watch([
    path.views('**/*.'+config('view_engine')),
    path.public('**/*.js'),
    path.public('**/*.css'),
    [path.resources('js/**/*.js'), ['js']],
    [path.resources('scss/**/*.scss'), ['sass']],
]);

build.task('default', ['sass','js']);