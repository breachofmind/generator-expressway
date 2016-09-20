"use strict";

var expressway = require('expressway');
var defaults = expressway.Provider.get('controllerDefaults');

module.exports = expressway.Controller.create('langController', defaults.Locales.controller);