"use strict";
var mvc = require('express-mvc');

module.exports = mvc.Controller.create('indexController', function(app)
{
    return {
        index: function(request,response,next) {
            return response.view('index');
        }
    }
});