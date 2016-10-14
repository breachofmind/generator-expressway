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

        this.requires = ['TemplateProvider'];
        this.contexts = [CXT_TEST, CXT_WEB];
    }

    /**
     * Register the provider with the application.
     * @param Template Template
     */
    register(Template)
    {
        Template.defaults = function(view)
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

module.exports = TemplateDefaultsProvider;