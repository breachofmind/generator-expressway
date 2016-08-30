"use strict";
var mvc = require('express-mvc');
var csrf = require('csurf');

module.exports = mvc.Controller.create('authController', function(app)
{
    this.middleware(csrf());

    return {
        /**
         * GET /login
         *
         * Display the login form.
         */
        login: function(request,response)
        {
            if (request.user) {
                response.redirect('/');
            }
            return response.view('login')
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
            request.flash('message', 'auth.logged_out');

            response.redirect('/login');
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

            function kill(info) {
                request.flash('message', info.message);
                return isAjax ? response.smart({success:false, error:info.message}) : response.redirect('/login');
            }

            // Use passport to authenticate.
            app.passport.authenticate('local', function(err,user,info)
            {
                if (err) return next(err);
                if (! user) return kill(info);

                request.logIn(user, function(err)
                {
                    if (err) return kill(info);

                    return response.smart(isAjax ? {success:true, user:user, redirect:"/admin"} : response.redirect('/'), 200);
                });

            })(request,response,next);

            return true;
        },
    }
});