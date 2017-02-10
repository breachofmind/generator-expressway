"use strict";

var Controller = require('expressway').Controller;

class IndexController extends Controller
{
    /**
     * Constructor.
     * @injectable
     * @param app Application
     */
    constructor(app)
    {
        super(app);

        // Add route-specific middleware.
        // this.middleware('index','CSRF')
    }

    /**
     * IndexController.index route.
     * @injectable
     */
    index(request,response,next,view)
    {
        return view.template('index').title('Expressway');
    }
}

module.exports = IndexController;