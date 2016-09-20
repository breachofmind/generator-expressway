var generators = require('yeoman-generator');
var shortid = require('shortid');

var input = {
    questions: [
        {type: 'input', name:'appName', default:'myapp',                message:"Application name"},
        {type: 'input', name:'desc',    default:'Expressway application',message:"Application description"},
        {type: 'input', name:'appKey',  default:shortid.generate(),     message:"Unique application key"},
        {type: 'input', name:'url',     default:"http://localhost",     message:"URL"},
        {type: 'input', name:'port',    default:8081,                   message:"Port"},
        {type: 'input', name:'db',      default:"localhost/expressway", message:"MongoDB Database URI"},
        {type: 'confirm', name:'useNg', default:true,                   message:"Using Angular?"},
    ],
    answers: {}
};

module.exports = generators.Base.extend({

    /**
    * Get the user configuration info.
    */
    prompting: function()
    {
        return this.prompt(input.questions).then(function(answers) {

            input.answers = answers;
            // Create the configuration file.
            this.fs.copyTpl(
                this.templatePath('env.template'),
                this.destinationPath('app/config/env.js'),
                answers
            );

            // Create the package.json.
            this.fs.copyTpl(
                this.templatePath('package.template'),
                this.destinationPath('package.json'),
                answers
            );
        }.bind(this));
    },

    /**
     * Copy the scaffold files to the user directory.
     */
    writing: function()
    {
        this.fs.copy(
            this.templatePath('../scaffold'),
            this.destinationPath()
        );
    },

    install: function()
    {
        var prod = [
            'csurf'
        ];

        // Load the library only if it's not installed globally.
        try {
            require.resolve('expressway');
        } catch(e) {
            prod.push('breachofmind/expressway');
        }

        if (input.answers.useNg) {
            prod.push('angular');
        }
        var dev = [
            'gulp',
            'gulp-concat',
            'gulp-autoprefixer',
            'gulp-sass',
            'gulp-livereload',
        ];

        this.npmInstall(prod, {save: true});
        this.npmInstall(dev, {saveDev: true});
    },

    end: function()
    {
        console.log('Finished! Type npm run start.');
    }
});
