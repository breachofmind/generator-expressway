"use strict";

var Expressway = require('expressway');

class GatePoliciesProvider extends Expressway.Provider
{
    constructor(app)
    {
        super(app);

        this.order = 0;

        this.requires = [
            'LoggerProvider',
            'GateProvider'
        ];
    }

    /**
     * Register any classes or instances with the application.
     * @param gate Gate
     * @param modelService ModelService
     */
    register(gate, modelService)
    {

        // Does the user have a superuser status?
        gate.policy("Superuser", function(user,object,action)
        {
            if (user.is('superuser') || user.hasPermission('superuser')) {
                return true;
            }
        });

        // Model object policies.
        gate.policy("Model Action", function(user,object,action,args)
        {
            if (typeof object == 'string') {
                object = modelService.get(object);
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
        gate.policy("Default Allow", function(user,object,action)
        {
            return true;
        });
    }
}

module.exports = GatePoliciesProvider;