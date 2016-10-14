"use strict";

var Expressway = require('expressway');
var app = Expressway.instance.app;
var DefaultAuthController = app.get('DefaultAuthController');

// You can also extend off of this controller and replace various methods
// with your own implementations.
//
// class AuthController extends DefaultAuthController
// {
//     constructor(app)
//     {
//         super(app);
//     }
//
//     index(request,response,next)
//     {
//         // Just replace this method.
//     }
//
// }

module.exports = DefaultAuthController;