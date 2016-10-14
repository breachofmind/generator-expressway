/**
 * Provides some routes for the application.
 * @param router {Router}
 * @param app {Application}
 * @param ControllerDefaultsProvider {ControllerDefaultsProvider}
 */
module.exports = function(router, app, ControllerDefaultsProvider)
{
    // Use the default controllers,
    // which should be enough to get started.
    ControllerDefaultsProvider.AuthController.routes(router);
    ControllerDefaultsProvider.LocaleController.routes(router);
    ControllerDefaultsProvider.RESTController.routes(router);

    // Application routes.
    router.get({
        '/' : 'indexController.index'
    });
};