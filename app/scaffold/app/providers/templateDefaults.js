"use strict";

var expressway = require('expressway');

class TemplateDefaultsProvider extends expressway.Provider
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
            this.meta('viewport','width=device-width');

            // Stylesheets
            this.style('$foundation', "https://cdnjs.cloudflare.com/ajax/libs/foundation/6.2.3/foundation-flex.min.css");
            this.style('$base', "/base.css");
            this.style('$css', "/app.css");

            // Scripts
            this.script('$js', "/src.js");
        };
    }
}

module.exports = new TemplateDefaultsProvider();