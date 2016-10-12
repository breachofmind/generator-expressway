"use strict";

var expressway = require('expressway');

class indexController extends expressway.Controller
{
    constructor(app)
    {
        super(app);
    }

    index(request,response,next)
    {
        return response
            .view('index')
            .set('title','Expressway');
    }
}

module.exports = indexController;