var generators = require('yeoman-generator');
var shortid = require('shortid');
var _ = require('lodash');

const VIEW_ENGINES = ['ejs','grenade'];
const DB_DRIVERS = ['mongodb'];
const PACKAGES = [
    'angular',
    'react',
    'moment',
    'vue',
    'bootstrap@4.0.0-alpha.6',
    'foundation-sites',
];

const QUESTIONS = [
    q("input",      "desc",     "Application description", "Expressway Application"),
    q("input",      "appKey",   "Unique application key",  shortid.generate()),
    q("input",      "url",      "URL",                     "http://localhost"),
    q("input",      "port",     "Port",                    8081),
    q("list",       "engine",   "Which View Engine?",      "grenade", VIEW_ENGINES),
    //q("list",       "driver",   "Which DB Driver?",        "mongodb", DB_DRIVERS),
    q("input",      "dbHostname", "Database Host", "localhost"),
    q("input",      "dbDatabase", "Database Name", "expressway"),
    q("checkbox",   "packages", "Which packages?",         [], PACKAGES)
];

var answers = {};
var npmProd = [];
var npmDev = [
    "autoprefixer",
    "babel-core",
    "babel-loader",
    "babel-preset-es2015",
    "css-loader",
    "node-sass",
    "postcss-loader",
    "sass-loader",
    "style-loader",
    "webpack",
    "webpack-dev-server",
];


module.exports = generators.Base.extend({

    constructor: function()
    {
        generators.Base.apply(this,arguments);

        this.argument('appName', {type:String, required:true});

        this.appName = _.camelCase(this.appName);
    },

    /**
    * Get the user configuration info.
    */
    prompting: function()
    {
        return this.prompt(QUESTIONS).then(output => {

            answers = output;
            answers.driver = "mongodb";
            answers.appName = this.appName;
            answers.view_engine = answers.engine;

            if (answers.engine == 'grenade') {
                answers.view_engine = "htm";
            }

            answers.imports = [];

            answers.packages.forEach(packageName => {
                if (packageScripts[packageName]) {
                    packageScripts[packageName] (this);
                }
            })
        });
    },

    /**
     * Copy the scaffold files to the user directory.
     */
    writing: function()
    {
        var cp = (from,to,data) => {
            from = this.templatePath(from);
            to = this.destinationPath(to || "");
            if (data) return this.fs.copyTpl(from,to,data);
            return this.fs.copy(from,to);
        };

        // Create the environment configuration file.
        cp('env.template',      'config/env.js',        answers);
        cp('config.template',   'config/config.js',     answers);
        cp('package.template',  'package.json',             answers);
        cp('base.scss.template','resources/scss/base.scss', answers);

        cp('../scaffold');
        cp('../drivers/'+answers.driver, 'app/models');
        cp('../engines/'+answers.engine, 'resources/views');
    },

    /**
     * Install NPM packages
     */
    install: function()
    {
        npmProd = npmProd.concat(answers.packages);

        pushIf(npmDev, 'watchify', onlyIfResolved('watchify'));
        pushIf(npmDev, 'browserify', onlyIfResolved('browserify'));
        pushIf(npmProd, 'breachofmind/expressway', onlyIfResolved('expressway'));
        pushIf(npmProd, 'grenade', onlyIfResolved('grenade') && answers.engine == 'grenade');
        pushIf(npmProd, answers.engine, ['ejs','pug','hbs'].indexOf(answers.engine) > -1);
        pushIf(npmDev, ["vue-loader", "vue-template-compiler"], npmProd.indexOf('vue') > -1);

        this.npmInstall(npmProd, {save: true});
        this.npmInstall(npmDev, {saveDev: true});
    },

    /**
     * Seed and finish.
     */
    end: function()
    {
        console.log('Done!');
        console.log('npm run start')
    }
});



// --------------------------------------------------------------------
// Utilities
// --------------------------------------------------------------------

function q(type,name,message,def,choices) {
    return {type:type, name:name, message:message, choices:choices,default:def}
}

function pushIf(to, push, expression) {
    if (expression) to = to.concat(push);
}

function onlyIfResolved(packageName) {
    try {
        require.resolve(packageName);
    } catch (e) {
        return true;
    }
    return false;
}

var packageScripts = {
    "foundation-sites" : function(yo,data) {
        answers.imports.push(`@import "../../node_modules/foundation-sites/scss/foundation.scss";`);
        answers.imports.push(`@include foundation-everything(true)`);
    },
    "bootstrap@4.0.0-alpha.5" : function(yo,data) {
        answers.imports = [`@import "../../node_modules/bootstrap/scss/bootstrap.scss";`]
    }
};