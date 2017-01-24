"use strict";
var expressway = require('expressway');
global.EXPRESSWAY_CONTEXT = CXT_CLI;
var app = require('./index');
module.exports = app.root.webpack.configuration;