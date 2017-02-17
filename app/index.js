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
    'breachofmind/expressway-auth',
    'breachofmind/expressway-rest',
    'breachofmind/expressway-ashlee',
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
var npmProd = [
    "breachofmind/expressway"
];
var npmDev = [
    "breachofmind/expressway-dev",
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
                npmProd.push('grenade');
                answers.view_engine = "htm";
            }
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
        cp('package.template',  'package.json',         answers);
        cp('gitignore.template',  '.gitignore');

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

        pushTo(npmProd, answers.engine)
            .when(['ejs','pug','hbs'].indexOf(answers.engine) > -1);

        // If vue is selected, add the webpack loaders.
        pushTo(npmDev, ["vue-loader", "vue-template-compiler"])
            .when(npmProd.indexOf('vue') > -1);

        this.npmInstall(npmProd, {save: true});
        this.npmInstall(npmDev, {saveDev: true});
    },

    /**
     * Seed and finish.
     */
    end: function()
    {
        console.log('Done!');
        console.log('npm run start');
    }
});



// --------------------------------------------------------------------
// Utilities
// --------------------------------------------------------------------

function pushTo(arr, items) {
    return {
        when(condition) {
            if (condition) {
                arr = arr.concat(items);
            }
        }
    }
}

function q(type,name,message,def,choices) {
    return {type:type, name:name, message:message, choices:choices,default:def}
}