"use strict";

var Extension = require('expressway').Extension;

/**
 * The Root Extension is your core application.
 * All sub-applications and extensions are attached to this app.
 */
class App extends Extension
{
    /**
     * Constructor.
     * @param app {Application}
     * @param config Function
     */
    constructor(app,config)
    {
        super(app);

        app.use(config('use'));

        this.package = require('../package.json');

        this.use(require('grenade/expressway'), {});

        this.routes.use(config('routes'));
    }

    /**
     * Fired when the application boots.
     * @param next Function
     * @param controller Function
     * @param paths PathService
     */
    boot(next,controller)
    {
        this.webpack.entry('main.js');
        this.webpack.attach(controller('IndexController'));

        this.webpack.server().then(done => {
            super.boot(next);
        });
    }
}

module.exports = App;