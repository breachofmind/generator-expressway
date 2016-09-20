"use strict";

var expressway = require('expressway');
var defaults = expressway.Provider.get('controllerDefaults');

// Define middleware if you want.
defaults.REST.middleware = {
    //index: function(request,response,next) {}
    //create: function(request,response,next) {}
};

module.exports = expressway.Controller.create('restController', defaults.REST.controller);