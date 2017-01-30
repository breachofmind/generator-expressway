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

function onStart(url)
{
    if (app.env == ENV_LOCAL && app.context == CXT_WEB) {
        cp.exec(`open /Applications/Google\\ Chrome.app ${url.get()}`, function(err){});
    }
}

app.on('started', app.callFn(onStart));

module.exports = app;