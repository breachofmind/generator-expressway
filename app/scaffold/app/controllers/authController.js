"use strict";

var expressway = require('expressway');
var csrf = require('csurf');

module.exports = expressway.Controller.create('authController', function(app)
{
    this.middleware(csrf());

    var loginUri   = "/login";
    var successUri = "/";


    return {
        /**
         * GET /login
         *
         * Display the login form.
         */
        login: function(request,response)
        {
            if (request.user) {
                response.redirect(successUri);
            }

            return response
                .view('login')
                .set({title: "Login"})
                .use({message: request.flash('message') || null});
        },

        /**
         * GET /logout
         *
         * Logs a user out and redirects to the login page.
         */
        logout: function(request,response)
        {
            if (request.user) {
                app.logger.access('User logging out: %s', request.user.id);
            }
            request.logout();
            request.flash('message', {
                text:request.lang('auth.logged_out'),
                type:'success'
            });

            response.redirect(loginUri);
        },

        /**
         * POST /login
         *
         * Authenticates a username and password.
         * POSTing as ajax will return a response in JSON format.
         */
        authenticate: function(request,response,next)
        {
            var isAjax = request.ajax;

            // Fires if there was an error...
            function kill(info)
            {
                var message = request.lang(info.message);

                request.flash('message', {
                    text: message,
                    type: 'alert'
                });
                return isAjax ? response.smart({success:false, error:message}) : response.redirect(loginUri);
            }

            // Use passport to authenticate.
            // Messages are returned in locale format.
            var opts = {badRequestMessage:'auth.err_missing_credentials'};

            app.passport.authenticate('local', opts, function(err,user,info)
            {
                if (err) return next(err);
                if (! user) return kill(info);

                request.logIn(user, function(err)
                {
                    if (err) return kill(info);

                    return response.smart(isAjax ? {success:true, user:user, redirect:"/"} : response.redirect(successUri), 200);
                });

            })(request,response,next);

            return true;
        },
    }
});