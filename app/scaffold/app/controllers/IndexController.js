"use strict";

var Expressway = require('expressway');

class IndexController extends Expressway.Controller
{
    /**
     * IndexController.index route.
     */
    index(request,response,next)
    {
        return response
            .view('index')
            .set('title','Expressway');
    }
}

module.exports = IndexController;