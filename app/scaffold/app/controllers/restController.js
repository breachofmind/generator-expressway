var mvc = require('express-mvc');
var defaults = mvc.Provider.get('controllerDefaults');

module.exports = mvc.Controller.create('restController', defaults.REST.controller);