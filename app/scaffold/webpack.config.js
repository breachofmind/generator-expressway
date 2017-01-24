"use strict";

global.EXPRESSWAY_CONTEXT = "cli";

var app = require('./index');

module.exports = app.root.webpack.configuration;