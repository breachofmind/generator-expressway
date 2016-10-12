"use strict";

var Expressway = require('expressway');
var csrf = require('csurf');

class authController extends Expressway.Controller
{
    constructor(app)
    {
        super(app);

        this.loginURI = "/login";
        this.successURI = "/";

        this.middleware(csrf());
    }

    /**
     * GET /login
     *
     * Display the login form.
     */
    login(request,response,next)
    {
        if (request.user) {
            response.redirect(this.successURI);
        }
        var flash = request.flash('message');

        return response
            .view('login')
            .set({title: "Login"})
            .use({message: flash[0] || ""});
    }

    /**
     * GET /logout
     *
     * Logs a user out and redirects to the login page.
     */
    logout(request,response,next,log)
    {
        if (request.user) {
            log.access('User logging out: %s', request.user.id);
        }
        request.logout();
        request.flash('message', {
            text:request.lang('auth.logged_out'),
            type:'success'
        });

        response.redirect(this.loginURI);
    }

    /**
     * POST /login
     *
     * Authenticates a username and password.
     * POSTing as ajax will return a response in JSON format.
     */
    authenticate(request,response,next,passport)
    {
        var controller = this;
        var isAjax = request.ajax;

        // Fires if there was an error...
        var kill = function(info)
        {
            var message = request.lang(info.message);

            request.flash('message', {
                text: message,
                type: 'alert'
            });
            return isAjax ? response.smart({success:false, error:message}) : response.redirect(controller.loginURI);
        };

        // Use passport to authenticate.
        // Messages are returned in locale format.
        var opts = {badRequestMessage: 'auth.err_missing_credentials'};

        passport.authenticate('local', opts, function(err,user,info)
        {
            if (err) return next(err);

            if (! user) return kill(info);

            request.logIn(user, function(err)
            {
                if (err) return kill(info);

                return response.smart(isAjax ? {success:true, user:user, redirect:"/"} : response.redirect(controller.successURI), 200);
            });

        })(request,response,next);

        return true;
    }
}

module.exports = authController;