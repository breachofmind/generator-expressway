"use strict";

var Provider = require('expressway').Provider;

class GatePoliciesProvider extends Provider
{
    constructor(app)
    {
        super(app);

        this.order = 20;
    }

    /**
     * Add policies to the application.
     * @injectable
     * @param app Application
     * @param gate GateService
     * @param Policy Function
     */
    boot(next,app,gate,Policy)
    {
        class AppPolicy extends Policy
        {
            before(user,ability,object)
            {
                if (user.is('superuser')) {
                    return true;
                }
            }

            // Other methods...
            view(user,ability,object)
            {
                return true;
            }
        }

        gate.define('App', new AppPolicy);

        // gate.allows(user, 'App.view')

        next();
    }
}

module.exports = GatePoliciesProvider;