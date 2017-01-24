"use strict";

var expressway  = require('expressway');
var cp = require('child_process');

// Create the expressway Application instance.
var app = expressway({
    config: [
        require('./config/config'),
        require('./config/env'),
        require('./config/routes'),
    ],
    rootPath: __dirname,
});

// Start the server if running the script with 'start'.
if (process.argv[2] == "start")
{
    app.start(function(url,app) {
        // Boot google chrome if developing locally.
        if (app.env == ENV_LOCAL && app.context == CXT_WEB) {
            cp.exec(`open /Applications/Google\\ Chrome.app ${url.get()}`, function(err){});
        }
    });
}

module.exports = app;