"use strict";

var Expressway = require('expressway');
var app = Expressway.instance.app;

var DefaultAuthController = app.get('AuthController');

// You can also extend off of this controller and replace various methods
// with your own implementations.
//
// class AuthController extends DefaultAuthController
// {
//     index(request,response,next)
//     {
//         return "Hello";
//     }
// }
//
// module.exports = AuthController;

module.exports = DefaultAuthController;