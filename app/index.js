var generators = require('yeoman-generator');
var shortid = require('shortid');
var _ = require('lodash');

var input = {
    questions: [
        {type: 'input', name:'desc',    default:'Expressway application',message:"Application description"},
        {type: 'input', name:'appKey',  default:shortid.generate(),     message:"Unique application key"},
        {type: 'input', name:'url',     default:"http://localhost",     message:"URL"},
        {type: 'input', name:'port',    default:8081,                   message:"Port"},
        {type: 'list',  name:'engine',  default:'grenade',              message:"Which View Engine?",   choices:['ejs','grenade']},
        {type: 'list',  name:'driver',  default:'mongodb',              message:"Which DB Driver?",     choices:['mongodb','mysql']},
        {type: 'input', name:'db',      default:"localhost/expressway", message:"Database URI"},
        {type: 'confirm', name:'useNg', default:true,                   message:"Using Angular?"},
    ],
    answers: {}
};

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
        var self = this;

        return this.prompt(input.questions).then(function(answers) {

            var providers = [];

            answers.db = answers.driver+"://"+answers.db;
            answers.appName = self.appName;
            answers.view_engine = answers.engine;

            if (answers.engine == 'grenade') {
                answers.view_engine = "htm";
                providers.push('require("grenade").provider()');
            }

            switch (answers.driver) {
                case 'mongodb' : providers.push('system.MongoDriverProvider'); break;
                case 'mysql' : providers.push('system.MySQLDriverProvider'); break;
            }

            answers.providers = providers;

            input.answers = answers;

        }.bind(this));
    },

    /**
     * Copy the scaffold files to the user directory.
     */
    writing: function()
    {
        // Create the environment configuration file.
        this.fs.copyTpl(
            this.templatePath('env.template'),
            this.destinationPath('app/config/env.js'),
            input.answers
        );
        // Create the configuration file.
        this.fs.copyTpl(
            this.templatePath('config.template'),
            this.destinationPath('app/config/config.js'),
            input.answers
        );
        // Create the configuration file.
        this.fs.copyTpl(
            this.templatePath('system.template'),
            this.destinationPath('app/config/system.js'),
            input.answers
        );

        // Create the package.json.
        this.fs.copyTpl(
            this.templatePath('package.template'),
            this.destinationPath('package.json'),
            input.answers
        );

        this.fs.copy(
            this.templatePath('../scaffold'),
            this.destinationPath()
        );
        this.fs.copy(
            this.templatePath('../drivers/'+input.answers.driver),
            this.destinationPath('app/models')
        );
        this.fs.copy(
            this.templatePath('../engines/'+input.answers.engine),
            this.destinationPath('resources/views')
        );

        // grenade
        if (input.answers.engine == 'grenade') {
            this.fs.copy(
                this.templatePath('../grenade-files/components'),
                this.destinationPath('app/components')
            );
        }
    },

    install: function()
    {
        var prod = [];

        var dev = [
            'gulp',
            'gulp-concat',
            'gulp-autoprefixer',
            'gulp-sass',
            'gulp-livereload',
        ];

        // Load the library only if it's not installed globally.
        try { require.resolve('expressway'); } catch(e) { prod.push('breachofmind/expressway'); }
        if (input.answers.engine == 'grenade') {
            try { require.resolve('grenade'); } catch(e) { prod.push('grenade'); }
        }
        if (['ejs','pug','hbs'].indexOf(input.answers.engine) > -1) {
            prod.push(input.answers.engine);
        }


        if (input.answers.useNg) {
            prod.push('angular');
        }

        this.npmInstall(prod, {save: true});
        this.npmInstall(dev, {saveDev: true});
    },

    end: function()
    {
        console.log('Finished! Type npm run install');
    }
});
