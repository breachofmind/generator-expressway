"use strict";

var Extension = require('expressway').Extension;
/**
 * The Root Extension is your core application.
 * All sub-applications and extensions are attached to this app.
 */
class RootExtension extends Extension
{
    /**
     * Constructor.
     * @param app Application
     * @param paths PathService
     */
    constructor(app,paths)
    {
        super(app);

        app.use(app.config.use);

        this.use(require('grenade/expressway'));

        this.middleware = [
            'Static',
            'Init',
            'ConsoleLogging',
            'BodyParser',
            'Localization',
            'Session',
        ];

        this.routes = [
            {
                "GET /" : "IndexController.index",
            },
            'NotFound'
        ];

        this.staticPaths["/"] = paths.public();
    }

    /**
     * Fired when the application boots.
     * @param next Function
     * @param app Application
     * @param controller Function
     * @returns void
     */
    boot(next,app,controller)
    {
        controller('IndexController').defaults.push(viewDefaults);

        super.boot(next);
    }
}

/**
 * Adds default styles and scripts to all controller methods.
 * @param view
 */
function viewDefaults(view) {
    view.style('app', '/app.css');
    view.style('base', '/base.css');
}


module.exports = RootExtension;