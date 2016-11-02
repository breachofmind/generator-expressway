"use strict";

var Expressway = require('expressway');

/**
 * Sets up all templates with
 * some common scripts and stylesheets.
 */
class TemplateDefaultsProvider extends Expressway.Provider
{
    constructor(app)
    {
        super(app);

        this.requires = ['ViewProvider'];
        this.contexts = [CXT_TEST, CXT_WEB];
    }

    /**
     * Register the provider with the application.
     */
    register()
    {
        Expressway.Template.defaults = function(view)
        {
            this.meta('viewport','width=device-width');

            // Stylesheets
            this.style('$base', "/base.css");
            this.style('$css', "/app.css");

            // Scripts
            this.script('$js', "/app.bundle.js");
        };
    }
}

module.exports = TemplateDefaultsProvider;