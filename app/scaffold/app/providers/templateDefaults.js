"use strict";

var mvc = require('express-mvc');

class TemplateDefaultsProvider extends mvc.Provider
{
    constructor()
    {
        super('templateDefaults');

        this.requires('template');
    }

    register(app)
    {
        app.Template.defaults = function(view)
        {
            this.style('foundation', "https://cdnjs.cloudflare.com/ajax/libs/foundation/6.2.3/foundation-flex.min.css");
            this.meta('viewport','width=device-width');
        };
    }
}

module.exports = new TemplateDefaultsProvider();