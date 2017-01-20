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
     * @param app Application
     * @param paths PathService
     */
    constructor(app,paths)
    {
        super(app);

        app.use(app.config.use);

        this.use(require('grenade/expressway'));

        this.routes.middleware([
            'Static',
            'Init',
            'ConsoleLogging',
            'BodyParser',
            'Localization',
            'Session',
        ]);

        this.routes.add([
            {
                "GET /" : "IndexController.index",
            },
        ]);

        this.routes.error(404, 'NotFound');

        this.routes.static("/", paths.public());
    }

    /**
     * Fired when the application boots.
     * @param next Function
     * @param controller Function
     * @returns void
     */
    boot(next,controller)
    {
        controller('IndexController').defaults.push(viewDefaults);

        super.boot(next);
    }
}

/**
 * Adds default styles and scripts to all controller methods.
 * @param view
 */
function viewDefaults(view)
{
    view.script('js', '/main.bundle.js');
}


module.exports = App;