"use strict";

var expressway = require('expressway');

module.exports = expressway.Controller.create('indexController', function(app)
{
    return {
        index: function(request,response,next) {
            return response
                .view('index')
                .set('title','Expressway');
        }
    }
});