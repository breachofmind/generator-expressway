/**
 * Provides some routes for the application.
 * @param router Router
 * @param LocaleController LocaleController
 * @param RESTController RESTController
 * @param AuthController AuthController
 */
module.exports = function(router, LocaleController, RESTController, AuthController)
{
    router.alias('api', '/api/v1');
    router.alias('auth', '/auth');

    router.app(router.to('api','locale'), LocaleController.routes);
    router.app(router.to('api'), RESTController.routes);
    router.app(router.to('auth'), AuthController.routes);

    router.app({
        'GET /' : 'IndexController.index'
    });
};