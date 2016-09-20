"use strict";

var expressway = require('expressway');

class gatePoliciesProvider extends expressway.Provider
{
    constructor()
    {
        super("gatepolicies");

        this.order = 0;

        this.requires([
            'logger',
            'gate'
        ]);
        this.inside(ENV_WEB);
    }

    /**
     * Register any classes or instances with the application.
     * @returns void
     */
    register(app)
    {
        // Does the user have a superuser status?
        app.gate.policy(function superUserPolicy(user,object,action)
        {
            if (user.is('superuser') || user.hasPermission('superuser')) {
                return true;
            }
        });

        // Model object policies.
        app.gate.policy(function modelCrudPolicy(user,object,action,args)
        {
            if (typeof object == 'string') {
                object = app.ModelFactory.get(object);
                if (!object) {
                    // Move to the next policy.
                    return;
                }
            }

            var key = `${object.name}.${action}`;

            // If the permission doesn't exist, allow by default.
            if (! this.contains(key)) {
                return true;
            }

            var hasPermission = user.hasPermission(key);

            if (object.managed && ! hasPermission) {
                // The model in question needs to be provided.
                if (! args) return false;

                // Does the object's managed property equal the current users id?
                // Example: post.author_id == user.id
                return args[object.managed] == user.id;
            }

            // Boolean: Does the user have the permission?
            return hasPermission;
        });


        // When all else fails, just allow.
        app.gate.policy(function defaultPolicy(user,object,action)
        {
            return true;
        });
    }
}

module.exports = new gatePoliciesProvider();