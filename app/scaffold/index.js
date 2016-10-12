"use strict";

var Expressway  = require('expressway');
var cp          = require('child_process');
var expressway  = Expressway.init(__dirname + "/app/");


expressway.bootstrap().server(function() {

    var app = expressway.app;
    var url = app.get('url');

    // Boot google chrome if developing locally.
    if (app.env == ENV_LOCAL) {
        cp.exec(`open /Applications/Google\\ Chrome.app ${url()}`, function(err){});
    }
});
