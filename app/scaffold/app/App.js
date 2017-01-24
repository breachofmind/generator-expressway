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
     * @param paths {PathService}
     * @param config Function
     */
    constructor(app,paths,config)
    {
        super(app);

        app.use(config('use'));

        this.package = require('../package.json');

        this.use(require('grenade/expressway'), {});

        this.routes.middleware(config('routes.middleware'));
        this.routes.add(config('routes.paths'));
        this.routes.error(404, config('routes.error'));

        this.routes.static("/", paths.public());

        this.use('expressway/src/services/WebpackService');

        this.webpack.entry('main.js');
        this.webpack.showErrors = false;
    }

    /**
     * Fired when the application boots.
     * @param next Function
     * @param controller Function
     * @param devMiddleware Dev
     * @param paths PathService
     */
    boot(next,controller,devMiddleware,paths)
    {
        controller('IndexController').defaults.push(view => {
            this.webpack.loadBundles(view);
        });

        devMiddleware.watch([
            paths.views(),
            paths.public(),
        ]);

        super.boot(next);
    }
}

module.exports = App;